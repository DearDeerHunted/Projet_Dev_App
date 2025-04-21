const express = require("express")
const {MongoClient, ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// Config MongoDB
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'Projet';

// Connexion à la base de données
let db;
async function connectBase(){
    try{
        await client.connect();
        db = client.db(dbName);
        console.log('Connecté à la base de données');
    }
    catch(error){
        console.log('Erreur de connexion à la base de données', error);
        process.exit(1);
    }
}

const JWT_SECRET_KEY = 'KEYXXX';

// Connexion client
app.post('/login', async (req, res) => {
    const {email, password } = req.body;

    try {
        const collection = db.collection('utilisateurs');
        const user = await collection.findOne({email});

        if(!user||!(await bcrypt.compare(password, user.mot_de_passe))){
            return res.status(401).json({success:false, message: "Email ou mot de passe incorrect"});
        }

        // Token JWT
        const token = jwt.sign({userId: user._id}, JWT_SECRET_KEY, {expiresIn:'24h'});
        
        return res.status(200).json({success:true, token});
    }
    catch(error){
        console.log('Erreur connexion:', error);
        return res.status(500).json({success:false, message: "Erreur serveur"});
    }
});

// Ajouter un client
app.post('/register', async (req, res) => {
    const {email,name,password} = req.body;

    try {
        const collection = db.collection('utilisateurs');

        if(await collection.findOne({email:email})){
            return res.status(400).json({success:false, message: "Cet email a déjà un compte associé"});
        }

        if(await collection.findOne({nom:name})){
            return res.status(400).json({success:false, message: "Ce nom d'utilisateur a déjà un compte associé"});
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        await collection.insertOne({
            email,
            nom:name,
            mot_de_passe:hashedPassword,
            date_inscription: new Date(),
            caches_trouvées: [],
            score:0
        });
        
        return res.status(201).json({success:true, message: "Utilisateur créé avec succès"});
    }
    catch(error){
        console.log('Erreur inscription:', error);
        return res.status(500).json({success:false, message: "Erreur serveur"});
    }
});

// Vérification du token
function checkToken(req, res, next){
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

    if(!token){
        return res.status(401).json({success: false, message: 'Accès non autorisé, connexion requise'});
    }

    jwt.verify(token, JWT_SECRET_KEY, (error, user) => {
        if(error){
            return res.status(403).json({success: false, message: 'Token invalide ou expiré'});
        }

        req.user = user;
        next();
    })
}

// Vérifier l'accès
app.get('/protected', checkToken, (req, res) => {
    return res.status(200).json({success: true, message: 'Accès autorisé', user: req.user});
});

// Ajouter une cache
app.post('/add-cache', checkToken, async (req, res) => {
    const {latitude, longitude, difficulte, description} = req.body;

    try {
        const collection = db.collection('caches');

        const newCache = {
            coordonnées: {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
            },
            créateur_ID: req.user.userId,
            difficulté: parseInt(difficulte),
            description: description || "",
            date_de_création: new Date(),
            note: null,
            nb_trouvées: 0,
            premier_découvreur_ID: null,
            découvreurs: [],
            évaluateurs: {},
            code: generateCode()

        };

        await collection.insertOne(newCache);
        return res.status(201).json({success:true, message: "Cache créée avec succès"});
    
    }
    catch(error){
        console.log('Erreur ajout cache:', error);
        return res.status(500).json({success: false, message: "Erreur serveur"});
    }
        
});

// Génération du code de validation de la cache
function generateCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Valider une cache avec un code
app.post('/check-cache', checkToken, async (req, res) => {
    const {cacheId, code} = req.body;

    try{
        const cache = await db.collection('caches').findOne({_id: new ObjectId(cacheId)});
        if(!cache){
            return res.status(404).json({success: false, message: "Cache introuvable"});
        }

        const userId = req.user.userId;
        if((cache.découvreurs || []).includes(userId.toString())){
            return res.status(400).json({success: false, message: "Cache déjà validée"});
        }

        if(cache.code!==code){
            return res.status(400).json({success: false, message: "Code incorrect"});
        }

        let scoreToAdd = cache.difficulté || 0;
        if(!cache.premier_découvreur_ID){
            scoreToAdd += 5;
        }
        await db.collection('utilisateurs').updateOne(
            { _id: new ObjectId(userId)},
            {
                $push: {caches_trouvées: cacheId},
                $inc: {score: scoreToAdd}
            }
        );

        const update = {
            $inc: {nb_trouvées: 1},
            $addToSet: {découvreurs: userId}
        };
        if(!cache.premier_découvreur_ID){
            update.$set = {premier_découvreur_ID: userId};
        }

        await db.collection('caches').updateOne(
            {_id: new ObjectId(cacheId)},
            update
        );

        return res.json({success: true, message: "Cache validée avec succès"});
    
    }
    catch(error){
        console.log("Erreur validation cache:", error);
        return res.status(500).json({success: false, message: "Erreur serveur"});
    }
})

// Noter une cache
app.post('/eval-cache', checkToken, async (req, res) => {
    const {cacheId, note} = req.body;

    try{
        const cache = await db.collection('caches').findOne({_id: new ObjectId(cacheId)});
        if(!cache){
            return res.status(404).json({success: false, message: "Cache introuvable"});
        }

        const userId = req.user.userId;
        const votants = cache.évaluateurs || {};
        votants[userId.toString()] = note;

        const notes = Object.values(votants);
        const totalNotes = notes.reduce((acc, curr) => acc + curr, 0);
        const nouvelleNote = totalNotes / notes.length;

        await db.collection('caches').updateOne(
            {_id: new ObjectId(cacheId)},
            {
                $set: {
                    note: nouvelleNote,
                    évaluateurs: votants
                }
            }
        );
        return res.json({success: true, message: "Cache notée avec succès"});
    }
    catch(error){
        console.log("Erreur notation cache:", error);
        return res.status(500).json({success: false, message: "Erreur serveur"});
    }
});

// Chercher des caches
app.post('/search-caches', checkToken, async (req, res) => {
    try {
        const {
            scoreMin,
            scoreMax,
            difficulty,
            author,
            dateMin,
            dateMax,
            found,
            not_found,
            cacheIdFromOutside,
            page,
            perPage,
        } = req.body || {};

        let totalCaches = 0;
        let caches = [];

        if(cacheIdFromOutside){
            const cache = await db.collection('caches').findOne({ _id: new ObjectId(cacheIdFromOutside)});
            if(!cache){
                return res.json({success: false, message: "Cache non trouvée"});
            }

            caches = [cache];
            totalCaches = 1;
        }
        else{
            const query = {};
            
            if(scoreMin!==undefined || scoreMax!==undefined){
                query.$or = [
                    {note: null},
                    {
                        note: {
                            ...(scoreMin!==undefined ? {$gte:scoreMin} : {}),
                            ...(scoreMax!==undefined ? {$lte:scoreMax} : {})
                        }
                    }
                ];
            }

            if(difficulty){
                query.difficulté = parseInt(difficulty);
            }

            if(author){
                // Liste des créateurs dont le nom contient author
                const creators = await db.collection('utilisateurs').find({
                    nom: {$regex: new RegExp(author, 'i')}
                }).toArray();

                if(creators.length>0){
                    const creatorIds = creators.map(creator => creator._id.toString());
                    query.créateur_ID = {$in: creatorIds};
                }
                else{
                    return res.json({ success: true, caches: [], totalCaches: 0 });
                }
            }

            if(dateMin || dateMax){
                const dateFilter = {};
                if(dateMin===dateMax){
                    const date = new Date(dateMin);
                    const nextDay = new Date(date);
                    nextDay.setDate(date.getDate()+1);
                    dateFilter.$gte = date;
                    dateFilter.$lt = nextDay;
                }
                else{
                    if(dateMin){
                        dateFilter.$gte = new Date(dateMin);
                    }
                    if(dateMax){
                        dateFilter.$lte = new Date(dateMax);
                    }
                }
                query.date_de_création = dateFilter;
            }
            
            if(found && !not_found){
                query.nb_trouvées = {$gt:0};
            }
            else if(!found  && not_found ){
                query.nb_trouvées = 0;
            }
        
            totalCaches = await db.collection('caches').countDocuments(query);
            caches = await db.collection('caches')
                .find(query)
                .sort({date_de_création:-1})
                .skip((page - 1) * perPage)
                .limit(perPage)
                .toArray();
        }

        // Préchargement créateurs & découvreurs
        const createurIDs = caches.map(c => c.créateur_ID?.toString()).filter(Boolean);
        const premierIDs = caches.map(c => c.premier_découvreur_ID?.toString()).filter(Boolean);
        const allUserIDs = [...new Set([...createurIDs, ...premierIDs])];
        
        const utilisateurs = await db.collection('utilisateurs').find({ _id: {$in:allUserIDs.map(id => new ObjectId(id))}}).toArray();
        const userMap = Object.fromEntries(utilisateurs.map(u => [u._id.toString(), u.nom]));

        // ajout créateur, premier_découvreur, isOwner, déjà_vu
        caches = caches.map(cache => {
            const créateurID = cache.créateur_ID?.toString();
            const premierID = cache.premier_découvreur_ID?.toString();

            return{
                ...cache,
                créateur: userMap[créateurID] || 'Inconnu',
                premier_découvreur: premierID ? userMap[premierID] || 'Inconnu' : undefined,
                isOwner: créateurID === req.user.userId,
                déjà_vu: (cache.découvreurs || []).includes(req.user.userId.toString()),
            };
        });

        return res.json({success: true, caches, totalCaches});
    }
    catch(error){
        console.log('Erreur récupération caches:', error);
        return res.status(500).json({success: false, message: "Erreur serveur"});
    }
});

// Chercher les caches à afficher sur la map
app.post('/search-caches-map', checkToken, async (req, res) => {
    try {
        const {
            north,
            south,
            east,
            west
        } = req.body || {};

        let query = {};

        if (north && south && east && west) {
            query = {
                "coordonnées.latitude": {$gte:south, $lte:north},
                "coordonnées.longitude": {$gte:west, $lte:east}
            };
        }

        let caches = await db.collection('caches').find(query).toArray();

        const utilisateur = await db.collection('utilisateurs').findOne({ _id: new ObjectId(req.user.userId) });
        const cachesTrouvées = utilisateur?.caches_trouvées || [];

        const createurIDs = [...new Set(caches.map(c => c.créateur_ID?.toString()))];
        const createurs = await db.collection('utilisateurs')
            .find({ _id: { $in: createurIDs.map(id => new ObjectId(id)) } })
            .toArray();
        const createurMap = Object.fromEntries(createurs.map(c => [c._id.toString(), c.nom]));

        caches = caches.map(cache => {
            const idStr = cache.créateur_ID?.toString();
            cache.créateur = createurMap[idStr] || 'Inconnu';
            cache.isOwner = idStr === req.user.userId;
            cache.déjà_vu = cachesTrouvées.includes(cache._id.toString());
            return cache;
        });

        return res.json({success: true, caches});
    }
    catch(error){
        console.log('Erreur récupération caches sur la map:', error);
        return res.status(500).json({success: false, message: "Erreur serveur"});
    }
});

// Chercher les meilleurs utilisateurs & caches
app.post('/ranking', checkToken, async (req, res) => {
    try{
        const topUsers = await db.collection('utilisateurs')
            .find({})
            .sort({score:-1})
            .limit(3)
            .toArray();

        let topCaches = await db.collection('caches')
            .find({note:{$ne: null}})
            .sort({note:-1})
            .limit(3)
            .toArray();

        topCaches = await Promise.all(topCaches.map(async (cache) => {
            const creator = await db.collection('utilisateurs').findOne({_id: new ObjectId(cache.créateur_ID)});
            cache.créateur = creator ? creator.nom : 'Inconnu';
            return cache;
        }));

        const allCaches = await db.collection('caches').find({}).toArray();
        let leastFoundCaches = allCaches.map(cache => {
            if (cache.nb_trouvées>0 && cache.date_de_création) {
                const creationDate = new Date(cache.date_de_création);
                const today = new Date();
                const timeSinceCreation = today-creationDate;
                const ratio = cache.nb_trouvées / (timeSinceCreation || 1);
                return { ...cache, ratio };
            }
            return cache;
        });
        leastFoundCaches.sort((a, b) => a.ratio - b.ratio);
        leastFoundCaches = leastFoundCaches.slice(0, 3);

        leastFoundCaches = await Promise.all(leastFoundCaches.map(async (cache) => {
            const creator = await db.collection('utilisateurs').findOne({_id: new ObjectId(cache.créateur_ID)});
            cache.créateur = creator ? creator.nom : 'Inconnu';
            return cache;
        }));

        return res.json({
            success: true,
            topUsers,
            topCaches,
            leastFoundCaches
        });

    }
    catch(error){
        console.log('Erreur récupération classement:', error);
        return res.status(500).json({success: false, message: "Erreur serveur"});
    }
});

// Supprimer une cache
app.delete('/delete-cache/:id', checkToken, async (req, res) => {
    const cacheId = req.params.id;

    try{
        const collection = db.collection('caches');
        const result = await collection.deleteOne({
            _id: new ObjectId(cacheId),
            créateur_ID: req.user.userId
        });

        if(result.deletedCount === 0){
            return res.status(404).json({success:false, message: "Cache non trouvée"})
        }

        return res.status(200).json({success:true, message: "Cache supprimée avec succès"})
    }
    catch(error){
        console.log("Erreur suppression:", error);
        return res.status(500).json({success: false, message: "Erreur serveur"});
    }
});

// Modifier une cache
app.put('/update-cache/:id', checkToken, async (req, res) => {
    const cacheId = req.params.id;
    const {latitude, longitude, difficulte, description} = req.body;

    if(!latitude || !longitude || !difficulte){
        return res.status(400).json({success:false, message: "Champs manquants"});
    }

    try{
        const collection = db.collection('caches');
        const result = await collection.updateOne(
            {
            _id: new ObjectId(cacheId),
            créateur_ID: req.user.userId
            },
            {
                $set:{
                    'coordonnées.latitude': parseFloat(latitude),
                    'coordonnées.longitude': parseFloat(longitude),
                    difficulté: parseInt(difficulte),
                    description: description || ""
                }
            }
        );

        if(result.modifiedCount === 0){
            return res.status(404).json({success:false, message: "Cache non trouvée"})
        }

        return res.status(200).json({success:true, message: "Cache mise à jour avec succès"})
    }
    catch(error){
        console.log("Erreur mise à jour:", error);
        return res.status(500).json({success:false, message: "Erreur serveur"});
    }
});

// Ouverture du serveur
app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
    connectBase();
});

// login.html est définie comme la page par défaut
app.get('/', (req, res) => {
    res.redirect('/login.html');
});