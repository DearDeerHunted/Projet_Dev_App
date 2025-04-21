import { useState, useEffect } from "react"
import { View, Text, ScrollView, Alert, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { checkToken, handleLogout } from '../components/tools';
import { styles } from "../components/styles";
import { BASE_URL } from '../../env';

const Ranking = () => {
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [rankings, setRankings] = useState({
        topUsers: [],
        topCaches: [],
        leastFoundCaches: []
    });

    useEffect(() => {
        const loadRanking = async () => {
            setLoading(true);
            const token = await checkToken(navigation);
            
            // Envoi requête au backend
            try{
                const response = await fetch(`${BASE_URL}/ranking`, {
                    method: 'POST',
                    headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });

                const data = await response.json();
                if(!data.success){
                    Alert.alert("Erreur", data.message);
                    return;
                }
                
                setRankings(data);
            }
            catch(error){
                Alert.alert("Erreur de connexion");
            }

            setLoading(false);
        };

        loadRanking();
        
        const unsubscribe = navigation.addListener('focus', () => {
            loadRanking();
        });
        return unsubscribe;
    }, [navigation]);

    if(loading){
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="green" />
                <Text style={{marginTop: 20}}>Chargement des classements...</Text>
            </View>
        );
    }

    return(
        <ImageBackground
            source={require('../../assets/fond-carte2.jpg')}
            style={[styles.background, {alignItems: 'center'}]}
            resizeMode="cover"
        >
            <TouchableOpacity style={[styles.button, {position: 'absolute', top: 5, left: 5,}]} onPress={() => handleLogout(navigation)}>
                            <Text style={styles.buttonText}>Déconnexion</Text>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={{padding: 20, marginTop: 30}}>
                <View style={styles.containerCaches}>
                    <Text style={[styles.title, {marginBottom: 20}]}>Les meilleurs chasseurs de trésors</Text>
                    {rankings.topUsers.map((user, index) => (
                        <View key={index} style={styles.rankBlock}>
                            <Text style={styles.buttonText}>{index + 1}. {user.nom} {"\n"} Score: {user.score || 0}</Text>
                        </View>
                    ))}
                    <Text style={[styles.title, {marginTop: 20, marginBottom: 20}]}>Les caches les plus appréciées</Text>
                    {rankings.topCaches.map((cache, index) => (
                        <TouchableOpacity key={index} style={styles.rankBlock} onPress={() => {navigation.navigate('list', {cacheIdFromOutside:cache._id});}}>
                            <Text style={styles.buttonText}>{index + 1}. {cache.coordonnées && cache.coordonnées.latitude && cache.coordonnées.longitude ?
                                `(${cache.coordonnées.latitude.toFixed(3)}, ${cache.coordonnées.longitude.toFixed(3)})`: 'Inconnues'}
                                {"\n"} Créateur: {cache.créateur} {"\n"} Note: {cache.note}</Text>
                        </TouchableOpacity>
                    ))}
                    <Text style={[styles.title, {marginTop: 20, marginBottom: 20}]}>Les caches les moins trouvées</Text>
                    {rankings.leastFoundCaches.map((cache, index) => (
                        <TouchableOpacity key={index} style={styles.rankBlock} onPress={() => {navigation.navigate('list', {cacheIdFromOutside:cache._id});}}>
                            <Text style={styles.buttonText}>{index + 1}. {cache.coordonnées && cache.coordonnées.latitude && cache.coordonnées.longitude ?
                            `(${cache.coordonnées.latitude.toFixed(3)}, ${cache.coordonnées.longitude.toFixed(3)})`: 'Inconnues'}
                            {"\n"} Créateur: {cache.créateur}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

export default Ranking;