import React from 'react';
import { TouchableOpacity, ActivityIndicator, View, Text } from 'react-native';
import MapView from 'react-native-maps';

const MapModal = ({
    setMapModalVisible,
    locationLoaded,
    newCache,
    setNewCache,
    setLocationLoaded }) => {
    
    return(
        <View style={{flex: 1, backgroundColor: 'white', borderRadius: 10, overflow: 'hidden'}}>
            {locationLoaded ? (
                <MapView
                    style={{flex: 1}}
                    initialRegion={{
                        latitude: parseFloat(newCache.latitude) || 44.806340,
                        longitude: parseFloat(newCache.longitude) || -0.605355,
                        latitudeDelta: 0.001,
                        longitudeDelta: 0.001,
                    }}
                    onPress={(e) => {
                        const { latitude, longitude } = e.nativeEvent.coordinate;
                        setNewCache({
                            ...newCache,
                            latitude: latitude.toString(),
                            longitude: longitude.toString(),
                        });
                        setLocationLoaded(false);
                        setMapModalVisible(false);
                    }}
                />
            ):(
                <ActivityIndicator size="large" color="green" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
            )}
            <TouchableOpacity
                style={{padding: 10, backgroundColor: 'red', alignItems: 'center'}}
                onPress={() => setMapModalVisible(false)}
            >
                <Text style={{color: 'white'}}>Annuler</Text>
            </TouchableOpacity>
        </View>
    );
};

export default MapModal;