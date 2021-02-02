import { Dimensions, StyleSheet } from 'react-native';
import colors from '../../constants/Colors'
import { Colors } from 'react-native/Libraries/NewAppScreen';


export default styles = StyleSheet.create({

    statusColor: {
        flex: 0,
        backgroundColor: 'white'
    },
    bottomColor: {
        flex: 1,
        backgroundColor: 'white'
    },

    imagesStyle: { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' },

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
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 50
    },
    buttonStyle: {
        width: '100%',
        marginTop: 10,
        padding: 15,
        borderRadius: 50,
        alignItems: 'center',
        backgroundColor: '#4CC9CA'
    },
    buttonTextStyle: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'HelveticaNeueLTStd-Md',
        paddingTop: Platform.OS === 'ios' ? 8 : 0,
    },

    editView: {
        width: '100%',
        flexDirection: 'column',
    },


    inputStyle: {
        width: '100%',
        height: 40,
        borderWidth: 0.5,
        fontSize: 14,
        fontFamily: 'HelveticaNeueLTStd-Lt',
        borderColor: 'white',
        borderBottomColor: '#d7dada'
    },


    //My Profile

    portfolioImage: { height: Dimensions.get('screen').width, width: '100%', marginTop: 5 },
    portfolioTitle: { fontSize: 16, width: '95%', color: 'black', fontFamily: 'HelveticaNeueLTStd-Md', marginTop: 20 },
    portfolioDes: { fontSize: 14, width: '95%', fontFamily: 'HelveticaNeueLTStd-Lt', color: 'black' },
    tagText: { fontSize: 14, width: '95%', fontFamily: 'HelveticaNeueLTStd-Roman', color: 'black', marginTop: 5 },

    likeMainView: { flexDirection: 'row', marginTop: 10, marginBottom: 10 },
    likeView: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    likeImage: { height: 20, width: 20 },
    likeText: { marginLeft: 5, fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey', paddingTop: Platform.OS === 'ios' ? 8 : 0 },

    detaiView: { borderBottomColor: '#d7dada', borderBottomWidth: 1, padding: 10 },
    detaiTitle: { flex: 1, fontSize: 10, fontFamily: 'HelveticaNeueLTStd-Md', color: '#BBBBBB', textTransform: 'uppercase', },
    detaiDes: { marginTop: 5, flex: 1, fontSize: 16, fontFamily: 'HelveticaNeueLTStd-Roman', color: 'black' },


    // Edit Profile
    createviewStyle: { flex: 1, alignItems: 'center', paddingLeft: 20, paddingRight: 20, marginTop: 20 },
    createImage: { width: 110, height: 110, borderRadius: 55, },
    uploadImageText: { color: colors.black, fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt', marginTop: 5 },

    createInputStyle: {
        width: '100%', fontSize: 16, color: colors.black, fontFamily: 'HelveticaNeueLTStd-Lt',
        paddingTop: Platform.OS === 'ios' ? 10 : 5,
        paddingBottom: Platform.OS === 'ios' ? 10 : 5
    },

    createInputView: {
        paddingTop: Platform.OS === 'ios' ? 10 : 5,
        paddingBottom: Platform.OS === 'ios' ? 10 : 5, flexDirection: 'row',
        alignItems: 'center', borderColor: colors.white, borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: colors.greyText
    },


    createFirstView: { width: '50%', flexDirection: 'column', borderColor: colors.white, borderWidth: 0, borderBottomWidth: 1, borderBottomColor: colors.greyText },

    editText: {
        textTransform: 'uppercase',
        color: '#BBBBBB',
        fontSize: 12,
        fontFamily: 'HelveticaNeueLTStd-Md',
        paddingLeft:Platform.OS === 'ios' ?0:2,
    },


    
    selectFlag: {
        color: 'red',
        fontSize: 12,
        fontFamily: 'HelveticaNeueLTStd-Md',
        paddingTop: Platform.OS === 'ios' ? 10 : 5,
    },

    // Toolbar 

    childViewContainer: {
        alignItems: 'center',
        height: 40,
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },

    headertext: {
        fontSize: 20,
        color: '#fff',
        fontFamily: 'HelveticaNeueLTStd-Roman',
    },


});