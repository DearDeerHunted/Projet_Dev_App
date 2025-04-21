import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center'
    },

    title: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    noCacheText: {
        fontStyle: 'italic',
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    pageText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    label: {
        marginTop: 10,
        fontWeight: 'bold',
    },

    scroll: {
        marginBottom: 20,
    },

    container: {
        backgroundColor: 'white',
        padding: 20,
        borderColor: '#333',
        borderWidth: 2,
        borderRadius: 8,
        width: 300,
    },
    containerMenu: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        position: 'relative',
    },
    formcontainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 20,
        maxHeight: 250,
        zIndex: 10,
    },
    containerMap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerCaches: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.7)',
    },
    cacheItem: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        elevation: 2,
    },
    link: {
        marginTop: 15,
        textAlign: 'center',
    },
    
    button: {
        zIndex: 10,
        padding: 10,
        backgroundColor: 'green',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    disabledButton: {
        backgroundColor: 'gray',
    },
    iconButton: {
        width: 50,
        height: 50,
        padding: 10,
        backgroundColor: 'green',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    cacheActions: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 10,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalDiffContainer: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    rankBlock: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
      },
    map: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
    },
})