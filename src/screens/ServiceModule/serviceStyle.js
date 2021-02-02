import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({

    statusColor: {
        flex: 0,
        backgroundColor: 'white'
    },
    bottomColor: {
        flex: 1,
        backgroundColor: 'white'
    },


    buttonStyle: {
        padding: 15,
        borderRadius: 50,
        width:'92%',
        alignItems: 'center',
        backgroundColor: '#4CC9CA',
        margin: 20,
        
    },



    filterHeader: { fontSize: 12, color: 'grey', fontFamily: 'HelveticaNeueLTStd-Md', textTransform: 'uppercase' },
    filterCheckImg: { height: 25, width: 25, resizeMode: 'contain' },
    fiterCheckText: { fontSize: 18, fontFamily: 'HelveticaNeueLTStd-Roman', color: 'black', paddingLeft: 10 ,paddingTop: Platform.OS === 'ios' ? 8:0, },

    buttonTextStyle: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'HelveticaNeueLTStd-Md',
        paddingTop: Platform.OS === 'ios' ? 8:0,
    },


    textInput: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 5 , 
        paddingTop:Platform.OS === 'ios' ? 20: 10,
        paddingBottom:Platform.OS === 'ios' ? 15: 10,
    },

    imageSend: {
        width: 25,
        height: 25,
        resizeMode :'contain'
    },

});