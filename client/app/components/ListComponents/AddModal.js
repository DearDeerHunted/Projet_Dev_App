import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../styles';

const AddModal = ({
    navigation,
    setAddModalVisible,
    newCache,
    setNewCache,
    submitCache,
    currentId,
    setCurrentId,
    reloadCaches,
    setMapModalVisible, }) => {

    const [isDiffModalVisible, setDiffModalVisible] = useState(false);

    const toggleModal = () => {
        setDiffModalVisible(!isDiffModalVisible);
    };

    const dismissModal = () => {
        setDiffModalVisible(false);
        Keyboard.dismiss();
    };

    return(
        <>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Ajouter une cache</Text>

                    <TextInput
                        placeholder="Latitude"
                        keyboardType="numeric"
                        value={newCache.latitude}
                        onChangeText={(text) => setNewCache({...newCache, latitude: text})}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Longitude"
                        keyboardType="numeric"
                        value={newCache.longitude}
                        onChangeText={(text) => setNewCache({...newCache, longitude: text})}
                        style={styles.input}
                    />
                    <TouchableOpacity onPress={toggleModal} style={styles.input}>
                        <Text style={{ color: '#000' }}>
                            Difficulté : {newCache.difficulte}
                        </Text>
                    </TouchableOpacity>
                    <Modal
                        transparent={true}
                        animationType="fade"
                        visible={isDiffModalVisible}
                        onRequestClose={toggleModal}
                    >
                        <TouchableWithoutFeedback onPress={dismissModal}>
                            <View style={styles.modalOverlay}>
                                <TouchableWithoutFeedback>
                                    <View style={styles.modalDiffContainer}>
                                        <Text style={styles.modalTitle}>Choisir la difficulté</Text>
                                        <Picker
                                            selectedValue={newCache.difficulte}
                                            onValueChange={(itemValue) => setNewCache({ ...newCache, difficulte: itemValue })}
                                            style={styles.picker}
                                        >
                                            <Picker.Item label="1 - Facile" value="1" />
                                            <Picker.Item label="2" value="2" />
                                            <Picker.Item label="3" value="3" />
                                            <Picker.Item label="4" value="4" />
                                            <Picker.Item label="5 - Difficile" value="5" />
                                        </Picker>
                                        <TouchableOpacity onPress={dismissModal} style={styles.button}>
                                            <Text style={styles.buttonText}>Confirmer</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>

                    <TextInput
                        placeholder="Description"
                        value={newCache.description}
                        onChangeText={(text) => setNewCache({...newCache, description: text})}
                        style={styles.input}
                        multiline={true}
                        numberOfLines={4} // nb lignes visibles
                    />

                    <TouchableOpacity
                        style={[styles.button, {backgroundColor: 'blue', marginTop: 10}]}
                        onPress={() => setMapModalVisible(true)}
                    >
                        <Text style={styles.buttonText}>Sélectionner l'emplacement sur la carte</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, {marginTop: 10}]}
                        onPress={() => {
                            submitCache({
                                navigation,
                                latitude: newCache.latitude,
                                longitude: newCache.longitude,
                                difficulte: newCache.difficulte,
                                description: newCache.description,
                                id: currentId,
                                setAddModalVisible,
                                setNewCache,
                                setCurrentId,
                                loadCaches: reloadCaches
                            });
                        }}
                    >
                        <Text style={styles.buttonText}>
                            {currentId ? 'Modifier' : 'Ajouter'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, {backgroundColor: 'red', marginTop: 10}]}
                        onPress={() => setAddModalVisible(false)}
                    >
                        <Text style={styles.buttonText}>Annuler</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </>
    );
};

export default AddModal;