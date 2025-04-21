import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, ScrollView, ImageBackground, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Modal from 'react-native-modal';

import { checkToken, handleLogout, locate } from '../components/tools';
import { styles } from "../components/styles";
import { loadCaches } from "../components/ListComponents/load";
import { submitCache, deleteCache, handleValidate, handleEvaluation } from "../components/ListComponents/actions";
import CacheItem from "../components/ListComponents/CacheItem";
import AddModal from '../components/ListComponents/AddModal';
import MapModal from '../components/ListComponents/MapModal';
import CodeModal from '../components/ListComponents/CodeModal';
import EvalModal from '../components/ListComponents/EvalModal';
import FilterModal from '../components/ListComponents/FilterModal';

const List = () => {
    const navigation = useNavigation();

    const route = useRoute();
    const {cacheIdFromOutside} = route.params || {};

    const [caches, setCaches] = useState([]);
    const [totalCaches, setTotalCaches] = useState(0);

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const [loading, setLoading] = useState(true);
    const [locationLoaded, setLocationLoaded] = useState(false);

    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isMapModalVisible, setMapModalVisible] = useState(false);
    const [isCodeModalVisible, setCodeModalVisible] = useState(false);
    const [isEvalModalVisible, setEvalModalVisible] = useState(false);
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);

    const [currentId, setCurrentId] = useState(null);
    const [newCache, setNewCache] = useState({
        latitude: '',
        longitude: '',
        difficulte: '1',
        description: '',
    });

    const [userCode, setUserCode] = useState('');
    const [userNote, setUserNote] = useState(null);

    const [filters, setFilters] = useState({
        scoreMin: 1,
        scoreMax: 5,
        difficulty: null,
        author: '',
        dateMin: '',
        dateMax: '',
        found : false,
        not_found : false,
        cacheIdFromOutside: cacheIdFromOutside || '',
      });
    
    useEffect(() => {
        const verifyToken = async () => {
            await checkToken(navigation);
        };
        verifyToken();
        
    }, [navigation]);

    const reloadCaches = () => {
        loadCaches({
            ...filters,
            page,
            perPage,
            setCaches,
            setTotalCaches,
            setLoading
        });
    };

    useEffect(() => {
        reloadCaches();
    }, [page, perPage]);

    useEffect(() => {
        setPage(1);
        reloadCaches();
    }, [filters]);

    useEffect(() => {
        const handleLocate = async () => {
            setLocationLoaded(false);
            if(!newCache.latitude || !newCache.longitude){
                const userLocation = await locate();

                if(!userLocation || !userLocation.coords){
                    console.log("Impossible de récupérer la localisation");
                    setLocationLoaded(true);
                    return;
                }
                
                setNewCache((prev) => ({
                    ...prev,
                    latitude: userLocation.coords.latitude.toString(),
                    longitude: userLocation.coords.longitude.toString(),
                }));
            }
            setLocationLoaded(true);
        };

        if(isMapModalVisible){
            handleLocate();
        }
    }, [isMapModalVisible]);

    // Redirection vers la carte
    const viewOnMap = (latitude, longitude) => {
        navigation.navigate('map', {
            latitude: latitude,
            longitude: longitude,
            delta: 0.001
        });
    };

    // Modification d'une cache
    const editCache = (cache) => {
        setNewCache({
            latitude: cache.coordonnées.latitude.toString(),
            longitude: cache.coordonnées.longitude.toString(),
            difficulte: cache.difficulté.toString(),
            description: cache.description || '',
        });
        setCurrentId(cache._id);
        setAddModalVisible(true);
    };

    // Validation d'une cache par code
    const validCache = (cache) => {
        setCurrentId(cache._id);
        setCodeModalVisible(true);
    };

    // Evaluation d'une cache
    const evalCache = (cache) => {
        setCurrentId(cache._id);
        setEvalModalVisible(true);
    };

    return(
        <ImageBackground
                source={require('../../assets/fond-carte2.jpg')}
                style={styles.background}
                resizeMode="cover"
        >
            <View style={styles.containerCaches}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                    <TouchableOpacity style={styles.button} onPress={() => handleLogout(navigation)}>
                    <Text style={styles.buttonText}>Déconnexion</Text>
                    </TouchableOpacity>

                    {!cacheIdFromOutside && (
                        <TouchableOpacity style={styles.button} onPress={() => {setCurrentId(null); setAddModalVisible(true)}}>
                            <Text style={styles.buttonText}>Ajouter une cache</Text>
                        </TouchableOpacity>
                    )}
                </View>
                {!cacheIdFromOutside && (
                    <TouchableOpacity style={[styles.button, { alignSelf: 'center', marginBottom: 30, width: '60%' }]} onPress={() => {setFilterModalVisible(true)}}>
                        <Text style={styles.buttonText}>Filtrer les caches</Text>
                    </TouchableOpacity>
                )}

                <Modal isVisible={isFilterModalVisible}>
                    <FilterModal
                        setFilterModalVisible={setFilterModalVisible}
                        filters={filters}
                        setFilters={setFilters}
                    />
                </Modal>

                <Text style={styles.title}>Résultats de la recherche</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="green" style={{marginTop: 20}} />
                ) : (
                        <ScrollView style={styles.scroll}>
                            {caches.length > 0 ? (
                                caches.map((cache) => (
                                    <CacheItem
                                        key={cache._id}
                                        cache={cache}
                                        viewOnMap={viewOnMap}
                                        editCache={editCache}
                                        validCache={validCache}
                                        deleteCache={deleteCache}
                                        evalCache={evalCache}
                                        navigation={navigation}
                                        reloadCaches={reloadCaches}
                                    />
                                ))
                            ) : (
                                <Text style={styles.noCacheText}>Aucune cache trouvée.</Text>
                            )}
                        </ScrollView>
                    )}

                {!cacheIdFromOutside && (
                    <View style={styles.pagination}>
                        <TouchableOpacity
                            onPress={() => page > 1 && setPage(page - 1)}
                            style={[styles.button, page === 1 && styles.disabledButton]}
                            disabled={page === 1}
                        >
                            <Text style={styles.buttonText}>{"<"}</Text>
                        </TouchableOpacity>

                        <Text style={styles.pageText}>Page {page} / {Math.max(1, Math.ceil(totalCaches / perPage))}</Text>

                        <TouchableOpacity
                            onPress={() => setPage(page + 1)}
                            style={[styles.button, (page * perPage >= totalCaches) && styles.disabledButton]}
                            disabled={page >= Math.ceil(totalCaches / perPage)}
                        >
                            <Text style={styles.buttonText}>{">"}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <Modal isVisible={isAddModalVisible}>
                <AddModal
                    navigation={navigation}
                    setAddModalVisible={setAddModalVisible}
                    newCache={newCache}
                    setNewCache={setNewCache}
                    submitCache={submitCache}
                    currentId={currentId}
                    setCurrentId={setCurrentId}
                    reloadCaches={reloadCaches}
                    setMapModalVisible={setMapModalVisible}
                />
                <Modal isVisible={isMapModalVisible}>
                    <MapModal
                        setMapModalVisible={setMapModalVisible}
                        locationLoaded={locationLoaded}
                        newCache={newCache}
                        setNewCache={setNewCache}
                        setLocationLoaded={setLocationLoaded}
                    />
                </Modal>
            </Modal>
            
            <Modal isVisible={isCodeModalVisible}>
                <CodeModal
                    setCodeModalVisible={setCodeModalVisible}
                    userCode={userCode}
                    setUserCode={setUserCode}
                    handleValidate={handleValidate}
                    currentId={currentId}
                    navigation={navigation}
                    reloadCaches={reloadCaches}
                />
            </Modal>

            <Modal isVisible={isEvalModalVisible}>
                <EvalModal
                    setEvalModalVisible={setEvalModalVisible}
                    userNote={userNote}
                    setUserNote={setUserNote}
                    handleEvaluation={handleEvaluation}
                    currentId={currentId}
                    navigation={navigation}
                    reloadCaches={reloadCaches}
                />
            </Modal>
        </ImageBackground>
    );
};

export default List;