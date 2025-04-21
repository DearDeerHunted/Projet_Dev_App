import { Alert } from 'react-native';

import { checkToken } from '../tools';
import { BASE_URL } from '../../../env';

// Ajouter/Modifier une cache
export const submitCache = async ({
    navigation,
    latitude,
    longitude,
    difficulte,
    description,
    id = null,
    setAddModalVisible,
    setNewCache,
    setCurrentId,
    loadCaches : reloadCaches}) => {

    if(!latitude || !longitude || isNaN(latitude) || isNaN(longitude)){
        Alert.alert("Erreur", "Veuillez entrer des coordonnées valides");
        return;
    }

    const diff = parseInt(difficulte);
    if(isNaN(diff) || !Number.isInteger(diff)|| diff < 1 || diff > 5){
        Alert.alert("Erreur", "La difficulté doit être un nombre entier entre 1 et 5");
        return;
    }

    const token = await checkToken(navigation);

    try {
        const endpoint = id ? `${BASE_URL}/update-cache/${id}` : `${BASE_URL}/add-cache`;
        const method = id ? 'PUT' : 'POST';
    
        const response = await fetch(endpoint, {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                latitude,
                longitude,
                difficulte,
                description
            })
        });

        const data = await response.json();
        if(!data.success){
            Alert.alert("Erreur", data.message);
            setAddModalVisible(false);
            return;
        }
    
        Alert.alert(id ? "Cache modifiée avec succès" : "Cache ajoutée avec succès");
        
        // Reset du formulaire
        setNewCache({
            latitude: '',
            longitude: '',
            difficulte: '1',
            description: '',
        });
        setCurrentId(null);
        setAddModalVisible(false);
        reloadCaches();

    }
    catch(error){
        console.log("Erreur lors de la validation de la cache :", error.message, error.stack);
        Alert.alert("Erreur de connexion");
        setAddModalVisible(false);
    }
};

// Suppression d'une cache
export const deleteCache = ({cache, navigation, loadCaches: reloadCaches}) => {
    Alert.alert('Suppression de cache', 'Êtes-vous sûr de vouloir supprimer cette cache?',
        [
            {
                text: 'Annuler',
                style: 'cancel'
            },
            {
                text: 'Supprimer',
                onPress: async () => {

                    // Vérification du token utilisateur
                    const token = await checkToken(navigation);

                    // Envoi de la requête de suppression au backend
                    try{
                        const response = await fetch(`${BASE_URL}/delete-cache/${cache._id}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        });

                        const data = await response.json();

                        if(!data.success){
                            Alert.alert("Erreur", data.message);
                            return;
                        }

                        Alert.alert('Succès', 'Cache supprimée avec succès');
                        reloadCaches();

                    }
                    catch(error){
                        console.log("Erreur lors de la validation de la cache :", error.message, error.stack);
                        Alert.alert("Erreur de connexion");
                    }
                }
            }
        ],
        {cancelable: true}
    );
};

// Validation d'une cache par code
export const handleValidate = async ({userCode, currentId, navigation, loadCaches : reloadCaches, setUserCode}) => {
    
    if(!userCode){
        Alert.alert("Erreur", "Code requis");
        return;
    }

    // Vérification du token de l'utilisateur
    const token = await checkToken(navigation);

    // Envoi de la requête de validation de la cache au backend
    try {
        const response = await fetch(`${BASE_URL}/check-cache`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({cacheId: currentId, code: userCode})
        });

        const data = await response.json();

        if(!data.success){
            Alert.alert("Erreur", data.message);
            return;
        }

        Alert.alert('Succès', 'Cache validée avec succès');
        reloadCaches();
        setUserCode('');
    }
    catch(error){
        console.log("Erreur lors de la validation de la cache :", error.message, error.stack);
        Alert.alert("Erreur de connexion");
    }
};

// Notation de la cache
export const handleEvaluation = async ({userNote, currentId, navigation, loadCaches : reloadCaches, setUserNote}) => {

    if(!userNote){
        Alert.alert("Erreur", "Note requise");
        return;
    }

    // Vérification du token de l'utilisateur
    const token = await checkToken(navigation);

    // Envoi de la requête de notation de la cache au backend
    try {
        const response = await fetch(`${BASE_URL}/eval-cache`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({cacheId: currentId, note: userNote})
        });

        const data = await response.json();

        if(!data.success){
            Alert.alert("Erreur", data.message);
            return;
        }

        Alert.alert('Succès', 'Cache notée avec succès');
        reloadCaches();
        setUserNote(null);
    }
    catch(error){
        console.log("Erreur lors de la notation de la cache :", error.message, error.stack);
        Alert.alert("Erreur de connexion");
    }
};