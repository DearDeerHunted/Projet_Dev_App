import React from 'react';
import { TouchableOpacity, TextInput, Text, TouchableWithoutFeedback, Alert, View, Keyboard } from 'react-native';
import Slider from '@react-native-community/slider';
import { styles } from '../styles';

const EvalModal = ({
        setEvalModalVisible,
        userNote,
        setUserNote,
        handleEvaluation,
        currentId,
        navigation,
        reloadCaches }) => {

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContainer}>
                <Text style={styles.title}>Evaluer la cache</Text>
                    <Slider
                        style={{ width: 250, height: 40 }}
                        minimumValue={1}
                        maximumValue={5}
                        step={1}
                        value={userNote}
                        minimumTrackTintColor="#FFD700"
                        maximumTrackTintColor="#000000"
                        onValueChange={(value) => setUserNote(value)}
                    />
                    <Text style={{ fontSize: 18, marginTop: 10 }}>Note : {userNote}/5</Text>

                    <TouchableOpacity
                        style={[styles.button, {marginTop: 10}]}
                        onPress={async () => {
                            if(!userNote){
                                Alert.alert("Erreur", "Note requise");
                                return;
                            }

                            await handleEvaluation({userNote, currentId, navigation, loadCaches : reloadCaches, setUserNote});
                            setEvalModalVisible(false);
                        }}
                    >
                        <Text style={styles.buttonText}>Valider</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, {backgroundColor: 'red', marginTop: 10}]}
                        onPress={() => setEvalModalVisible(false)}
                    >
                        <Text style={styles.buttonText}>Annuler</Text>
                    </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};
  
export default EvalModal;