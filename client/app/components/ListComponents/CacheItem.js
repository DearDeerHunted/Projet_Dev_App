import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../styles';

const CacheItem = ({cache, viewOnMap, editCache, validCache, deleteCache, evalCache, navigation, reloadCaches}) => {

    return(
        <View style={styles.cacheItem}>
            <View style={styles.cacheInfo}>
                <Text><Text style={styles.boldText}>Coordonnées :</Text> {cache.coordonnées.latitude.toFixed(3)}, {cache.coordonnées.longitude.toFixed(3)}</Text>
                <Text><Text style={styles.boldText}>Créateur :</Text> {cache.créateur}</Text>
                <Text><Text style={styles.boldText}>Difficulté :</Text> {cache.difficulté}</Text>
                <Text><Text style={styles.boldText}>Notation :</Text> {cache.note === null ? "N/A" : cache.note}</Text>
                <Text><Text style={styles.boldText}>Nombre de fois trouvées :</Text> {cache.nb_trouvées}</Text>
                <Text><Text style={styles.boldText}>Premier découvreur :</Text> {cache.premier_découvreur || "N/A"}</Text>
                <Text><Text style={styles.boldText}>Date d'ajout :</Text> {new Date(cache.date_de_création).toLocaleDateString()}</Text>
                <Text><Text style={styles.boldText}>Description :</Text> {cache.description || "N/A"}</Text>
                {cache.isOwner && <Text><Text style={styles.boldText}>Code :</Text> {cache.code}</Text>}
            </View>

            <View style={styles.cacheActions}>
                <TouchableOpacity style={styles.iconButton} onPress={() => viewOnMap(cache.coordonnées.latitude, cache.coordonnées.longitude)}>
                    <Icon name="map-marker" size={30} color="white" />
                </TouchableOpacity>

                {cache.isOwner ? (
                    <>
                        <TouchableOpacity style={styles.iconButton} onPress={() => editCache(cache)}>
                            <Icon name="pencil" size={30} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton} onPress={() => deleteCache({cache, navigation, loadCaches: reloadCaches})}>
                            <Icon name="trash" size={30} color="white" />
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        {cache.déjà_vu ? (
                            <TouchableOpacity style={styles.iconButton} onPress={() => evalCache(cache)}>
                                <Icon name="star" size={30} color="white" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.iconButton} onPress={() => validCache(cache)}>
                                <Icon name="key" size={30} color="white" />
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </View>
        </View>
    );
};

export default CacheItem;