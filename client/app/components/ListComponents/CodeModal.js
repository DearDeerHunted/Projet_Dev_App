import React from 'react';
import { TouchableOpacity, TextInput, Text, TouchableWithoutFeedback, Alert, View, Keyboard } from 'react-native';
import { styles } from '../styles';

const CodeModal = ({
        setCodeModalVisible,
        userCode,
        setUserCode,
        handleValidate,
        currentId,
        navigation,
        reloadCaches }) => {

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContainer}>
                <Text style={styles.title}>Code de validation</Text>
                    <TextInput
                        placeholder="Code"
                        value={userCode}
                        onChangeText={setUserCode}
                        style={styles.input}
                    />

                    <TouchableOpacity
                        style={[styles.button, {marginTop: 10}]}
                        onPress={async () => {
                            if(!userCode){
                                Alert.alert("Erreur", "Code requis");
                                return;
                            }

                            await handleValidate({userCode, currentId, navigation, loadCaches: reloadCaches, setUserCode});
                            setCodeModalVisible(false);
                        }}
                    >
                        <Text style={styles.buttonText}>Valider</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, {backgroundColor: 'red', marginTop: 10}]}
                        onPress={() => setCodeModalVisible(false)}
                    >
                        <Text style={styles.buttonText}>Annuler</Text>
                    </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};
  
export default CodeModal;