import { Alert } from 'react-native';

import { checkToken } from '../tools';
import { BASE_URL } from '../../../env';

// Chargement les caches
export const loadCaches = async ({
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
        setCaches,
        setTotalCaches,
        setLoading,
        navigation
    }) => {

    setLoading(true);
    const token = await checkToken(navigation);
    
    // Envoi requête au backend
    try{
        const response = await fetch(`${BASE_URL}/search-caches`, {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
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
                perPage
            })
        });

        const data = await response.json();
        if(!data.success){
            Alert.alert("Erreur", data.message);
            return;
        }

        if(Array.isArray(data.caches)){
            setCaches(data.caches);
            setTotalCaches(data.totalCaches);
        }
        else{
            setCaches([]);
            Alert.alert("Info", "Aucune cache trouvée.");
        }
    }
    catch(error){
        Alert.alert("Erreur de connexion");
    }
    finally{
        setLoading(false);
    }
};