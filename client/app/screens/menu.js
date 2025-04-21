import {useEffect} from "react"
import {View, Text, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MapView from 'react-native-maps';

import { checkToken, handleLogout } from '../components/tools';
import { styles } from "../components/styles";

const Menu = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const verifyToken = async () => {
            await checkToken(navigation);
        };
        verifyToken();
        
    }, [navigation]);

    return(
        <View style={styles.containerMenu}>
            <TouchableOpacity style={[styles.button, {position: 'absolute', top: 5, left: 5,}]} onPress={() => handleLogout(navigation)}>
                <Text style={styles.buttonText}>Déconnexion</Text>
            </TouchableOpacity>

            <View style={styles.formcontainer}>
                <TouchableOpacity style={[styles.button]} onPress={() => navigation.navigate('map')}>
                    <Text style={[styles.buttonText, {fontSize: 24}]}>Parcourir la carte</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, {marginTop: 20}]} onPress={() => navigation.navigate('list')}>
                    <Text style={[styles.buttonText, {fontSize: 24}]}>Rechercher une cache</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, {marginTop: 20}]} onPress={() => navigation.navigate('ranking')}>
                    <Text style={[styles.buttonText, {fontSize: 24}]}>Classement</Text>
                </TouchableOpacity>
            </View>

            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 44.807078,
                    longitude: -0.602689,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
            </MapView>
        </View>
      );
    };

export default Menu;