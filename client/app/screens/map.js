import { useState, useEffect} from "react"
import { View, Text, TouchableOpacity, Alert} from 'react-native';
import { useNavigation, useRoute} from '@react-navigation/native';
import MapView, { Marker, Callout} from 'react-native-maps';
import { ActivityIndicator} from 'react-native';

import { checkToken, handleLogout, locate } from '../components/tools';
import { styles } from "../components/styles";
import { BASE_URL } from '../../env';
import { loadCaches } from "../components/ListComponents/load";

const Map = () => {
    const [location, setLocation] = useState(null);
    const [caches, setCaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCache, setSelectedCache] = useState(null);

    const navigation = useNavigation();
    const route = useRoute();
    const {latitude, longitude, delta} = route.params || {};
    const [region, setRegion] = useState({
        latitude: latitude || 44.806340,
        longitude: longitude || -0.605355,
        latitudeDelta: delta || 0.005,
        longitudeDelta: delta || 0.005,
    });

    // Zone de l'écran
    const getBoundingBox = (region) => {
        const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
    
        const north = latitude + latitudeDelta;
        const south = latitude - latitudeDelta;
        const east = longitude + longitudeDelta;
        const west = longitude - longitudeDelta;
    
        return {north, south, east, west};
    };

    useEffect(() => {

        // Chargement des caches sur la carte
        const loadCaches = async (region) => {

            const token = await checkToken(navigation);
            const {north, south, east, west} = getBoundingBox(region);
            
            // Envoi requête au backend
            try{
                const response = await fetch(`${BASE_URL}/search-caches-map`, {
                    method: 'POST',
                    headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({north, south, east, west}),
                });
                
                const data = await response.json();
                if(!data.success){
                    Alert.alert("Erreur", data.message);
                    return;
                }
                setCaches(data.caches);
                setLoading(false);
            }
            catch(error){
                Alert.alert("Erreur de connexion" + error);
            }
        };

        loadCaches(region);
    }, [region]);

    useEffect(() => {
        const handleLocate = async () => {
            const location = await locate();
            if(location){
                setLocation(location.coords);
                setRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                });
            }
            else{
                setLocation({
                    latitude: 44.806340,
                    longitude: -0.605355,
                });
            }
        };

        handleLocate();
    }, []);

    const getMarkerIcon = (cache) => {
        if(cache.isOwner){
            return require('../../assets/marker-icon-green.png');
        }
        else if(cache.déjà_vu){
            return require('../../assets/marker-icon-grey.png');
        }
        return require('../../assets/marker-icon-red.png');
    };

    const handleCenterMapOnUser = () => {
        if(location){
          setRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
        }
    };

    return(
        <View style={styles.containerMap}>
            {loading || !location ? (
            <ActivityIndicator size="large" color="green" />
        ) : (
            <>
                <MapView
                    style={styles.map}
                    region={region}
                    showsUserLocation
                    onRegionChangeComplete={(newRegion) => {setRegion(newRegion); loadCaches(newRegion);}}
                >
                    {caches.map((cache) => {
                        return(
                            <Marker
                                key={cache._id}
                                coordinate={{
                                    latitude: cache.coordonnées.latitude,
                                    longitude: cache.coordonnées.longitude,
                                }}
                                image={getMarkerIcon(cache)}
                                onPress={() => setSelectedCache(cache)}
                            >
                            </Marker>
                        );
                    })}
                </MapView>

                {selectedCache && (
                    <View style={{
                        position: 'absolute',
                        bottom: 80,
                        left: 20,
                        right: 20,
                        backgroundColor: 'white',
                        borderRadius: 10,
                        padding: 15,
                    }}>
                        <Text style={{ fontWeight: 'bold' }}>
                            {selectedCache.difficulté ? `Difficulté : ${selectedCache.difficulté}` : 'Difficulté inconnue'}
                        </Text>
                        <Text>
                            {selectedCache.créateur ? `Créé par : ${selectedCache.créateur}` : 'Créateur : Inconnu'}
                        </Text>
                        <Text>
                            {selectedCache.description ? selectedCache.description : 'Pas de description disponible'}
                        </Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                // Redirection vers list
                                navigation.navigate('list', {cacheIdFromOutside:selectedCache._id});
                                setSelectedCache(null);
                            }}
                        >
                            <Text style={styles.buttonText}>Voir les détails</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setSelectedCache(null)}
                            style={{ position: 'absolute', top: 5, right: 10 }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>×</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity style={[styles.button, {position: 'absolute', bottom: 5, right: 5}]} onPress={handleCenterMapOnUser}>
                    <Text style={styles.buttonText}>Se localiser</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.button, {position: 'absolute', top: 5, left: 5}]} onPress={() => handleLogout(navigation)}>
                    <Text style={styles.buttonText}>Déconnexion</Text>
                </TouchableOpacity>
            </>
        )}
        </View>
    );
};
    
export default Map;