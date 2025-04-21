import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, Keyboard, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { styles } from "../components/styles";
import { BASE_URL } from '../../env';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        
        // Vérification des champs
        if(!email || !password){
            Alert.alert("Erreur", "Veuillez remplir tous les champs");
            return;
        }

        // Envoi requête au backend
        try{
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            })

            const data = await response.json();
            if(!data.success){
                Alert.alert("Erreur", data.message);
                return;
            }

            if(data.token){
                // Ajout token
                await AsyncStorage.setItem('token', data.token);
                // Redirection
                navigation.navigate('menu');
            }
        }
        catch(error){
            Alert.alert("Erreur de connexion");
        }
    };

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ImageBackground
                source={require('../../assets/fond-carte2.jpg')}
                style={[styles.background, {alignItems: 'center'}]}
                resizeMode="cover"
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Se connecter</Text>

                    <Text style={styles.label}>Email :</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Entrez votre email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Text style={styles.label}>Mot de passe :</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Entrez votre mot de passe"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Se connecter</Text>
                    </TouchableOpacity>

                    <Text style={styles.link}>
                        Pas encore de compte ?{' '}
                    <Text
                        style={{ color: 'blue' }}
                        onPress={() => navigation.navigate('register')}
                    >
                        Créer un compte
                    </Text>
                    </Text>
                </View>
            </ImageBackground>
        </TouchableWithoutFeedback>
    );
};
  
export default Login;