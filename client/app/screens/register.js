import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from "../components/styles";
import { BASE_URL } from '../../env';

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleRegister = async () => {

        // Vérification des champs
        if(!email || !username || !password){
            Alert.alert("Erreur", "Veuillez remplir tous les champs");
            return;
        }

        // Envoi requête au backend
        try{
            const response = await fetch(`${BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, name: username, password})
            })

            const data = await response.json();
            if(!data.success){
                Alert.alert("Erreur", data.message);
                return;
            }

            Alert.alert('Succès', 'Enregistrement réalisé avec succès', [
            {
                text: 'OK',
                onPress: () => {
                // Redirection
                navigation.navigate('login');
                },
            },
            ]);
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
                <Text style={styles.title}>Créer un compte</Text>

                <Text style={styles.label}>Email :</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Entrez votre email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={styles.label}>Nom d'utilisateur :</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Entrez votre nom"
                    autoCapitalize="none"
                    value={username}
                    onChangeText={setUsername}
                />

                <Text style={styles.label}>Mot de passe :</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Entrez votre mot de passe"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Créer un compte</Text>
                </TouchableOpacity>

                <Text style={styles.link}>
                    Déjà membre ?{' '}
                <Text
                    style={{ color: 'blue' }}
                    onPress={() => navigation.navigate('login')}
                >
                    Se connecter
                </Text>
                </Text>
            </View>
            </ImageBackground>
        </TouchableWithoutFeedback>
    );
};

export default Register;