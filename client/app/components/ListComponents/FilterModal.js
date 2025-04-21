import { useState } from "react"
import { View, Text, TextInput, Button, TouchableOpacity, Switch, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import { styles } from "../styles";

const FilterModal = ({setFilterModalVisible, filters, setFilters}) => {

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
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <Text style={styles.label}>Note min-max</Text>
                        <MultiSlider
                            values={[filters.scoreMin, filters.scoreMax]}
                            sliderLength={280}
                            onValuesChange={(values) => {
                                if (values[0] !== values[1]) {
                                    setFilters((prev) => ({
                                        ...prev,
                                        scoreMin: values[0],
                                        scoreMax: values[1],
                                    }));
                                }
                            }}
                            min={1}
                            max={5}
                            step={1}
                            allowOverlap={false}
                            snapped
                            minMarkerOverlapDistance={40}
                            enableLabel={true}
                        />
                        <Text style={styles.label}>Difficilé</Text>
                        <TouchableOpacity onPress={toggleModal} style={styles.input}>
                            <Text style={{ color: '#000' }}>
                                {filters.difficulty === "" || filters.difficulty === null ? "Toutes" : `${filters.difficulty}`}
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
                                                selectedValue={filters.difficulty}
                                                onValueChange={(itemValue) => setFilters((prev) => ({ ...prev, difficulty: itemValue }))}
                                                style={styles.picker}
                                            >
                                                <Picker.Item label="Toutes" value="" />
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

                        <Text style={styles.label}>Créateur</Text>
                        <TextInput
                            value={filters.author}
                            onChangeText={(text) =>
                                setFilters((prev) => ({ ...prev, author: text }))
                            }
                            placeholder="Nom de l'auteur"
                            style={styles.input}
                        />

                        <Text style={styles.label}>Date min-max (yyyy-mm-dd)</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                            <TextInput
                                value={filters.dateMin}
                                onChangeText={(text) =>
                                setFilters((prev) => ({ ...prev, dateMin: text }))
                                }
                                placeholder="Min: 1999-12-03"
                                style={[styles.input, { flex: 1 }]}
                            />
                            <TextInput
                                value={filters.dateMax}
                                onChangeText={(text) =>
                                setFilters((prev) => ({ ...prev, dateMax: text }))
                                }
                                placeholder="Max: 2003-11-21"
                                style={[styles.input, { flex: 1 }]}
                            />
                        </View>


                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                            <Text style={styles.label}>Trouvées</Text>
                            <Switch
                                value={filters.found }
                                onValueChange={(val) =>
                                    setFilters((prev) => ({ ...prev, found : val }))
                                }
                                style={{ marginHorizontal: 10 }}
                            />
                            <Text style={styles.label}>Jamais trouvées</Text>
                            <Switch
                                value={filters.not_found }
                                onValueChange={(val) =>
                                    setFilters((prev) => ({ ...prev, not_found : val }))
                                }
                                style={{ marginHorizontal: 10 }}
                            />
                        </View>

                        <View style={{ marginTop: 20 }}>
                            <Button title="Fermer" onPress={() => setFilterModalVisible(false)} />
                        </View>
                    </View>
                </View>
            </View>
        </>
    );
};

export default FilterModal;