import { StyleSheet } from 'react-native';
import colors from '../../constants/Colors'

export default styles = StyleSheet.create({

    statusColor: {
        flex: 0,
        backgroundColor: 'white'
    },
    bottomColor: {
        flex: 1,
        backgroundColor: 'white'
    },
    welcomeText: {
        color: '#000', fontSize: 16,
        fontFamily: 'HelveticaNeueLTStd-Lt',
    },

    bacStyle:{ flex :1 , height: 100, resizeMode: 'contain' , justifyContent :'center'},
    imagesStyle:{ width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' },

    image: {
        width: 30,
        height: 30,
    },
    textInput: {
        flex: 1,
        paddingLeft: 5,
        paddingRight: 5
    },
    inputView: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewStyle: {
        flex: 1,
        flexDirection :'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 50
    },
    buttonStyle: {
        marginTop: 10,
        padding: 10,
        width :160,
        borderRadius: 50,
        alignItems: 'center',
        backgroundColor: '#4CC9CA',
    },
    buttonTextStyle: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'HelveticaNeueLTStd-Md',
        paddingTop: Platform.OS === 'ios' ? 8:0
    },
      
    editView: {
        width: '100%',
        flexDirection: 'column',
    },

    editText: {
        textTransform: 'uppercase',
        color: '#000',
        fontSize: 12,
        fontFamily: 'HelveticaNeueLTStd-Lt',
    },
    inputStyle: {
        width: '100%',
        borderWidth: 0.5,
        fontSize: 14,
        fontFamily: 'HelveticaNeueLTStd-Lt',
        borderColor: 'white',
        borderBottomColor: '#d7dada',
        paddingTop:Platform.OS === 'ios' ? 10 : 5,
        paddingBottom:Platform.OS === 'ios' ? 10 : 5
    },


    popText: { fontSize: 22, color: colors.black, fontFamily: 'HelveticaNeueLTStd-Md' },

    appIcon: { width: 200, height: 50, resizeMode: 'contain' },
    buttonStyle: { width: '100%', marginTop: 10, padding: 15, borderRadius: 50, alignItems: 'center', backgroundColor: colors.appColor },


});