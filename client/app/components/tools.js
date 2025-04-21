import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import * as Location from 'expo-location';

// Vérification du token
export const checkToken = async (navigation) => {
    const token = await AsyncStorage.getItem('token');
    if(!token){
        Alert.alert('Erreur', 'Vous êtes déconnecté');
        navigation.reset({
            index: 0, // Reset la pile
            routes: [{name:'login'}], // Redirection
        });
    }
    return token;
};

// Déconnexion
export const handleLogout = async (navigation) => {
    await AsyncStorage.removeItem('token');
    navigation.reset({
        index: 0, // Reset la pile
        routes: [{name:'login'}], // Redirection
    });
}

// Localisation de l'utilisateur
export const locate = async () => {
    const {status} = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted'){
        Alert.alert('Permission refusée', 'Accéder à votre localisation refusée');
        return;
    }

    const userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
    });

    return(userLocation);
};