import { StyleSheet } from 'react-native';

const HeaderStyles = StyleSheet.create({
    headerContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    logo: {
        width: '100%',
        height: 200,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        margin: 15,
        padding: 15,
    },
    subtitle: {
        fontSize: 30,
        color: '#666',
        marginBottom: 20,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    patientButton: {
        backgroundColor: '#ff9900',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
        flex: 1,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    loginText: {
        color: '#007BFF',
        marginTop: 10,
    },
    provisionalButton: {
        backgroundColor: '#28A745',
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
    },
    
});

export default HeaderStyles;
