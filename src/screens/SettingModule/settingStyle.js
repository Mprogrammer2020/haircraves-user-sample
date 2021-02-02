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


    buttonStyle: {
        width: '25%',
        marginTop: 10,
        padding: 10,
        borderRadius: 50,
        alignItems: 'center',
        backgroundColor: '#4CC9CA',

    },
    buttonTextStyle: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'HelveticaNeueLTStd-Lt'
    },


    // Setting Screen 

    touchView: { flexDirection: 'row', paddingBottom: 15, paddingTop: 15, borderBottomColor: '#d7dada', borderBottomWidth: 1 },
    titleText: { flex: 1, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' },
    arrowImage: { height: 15, width: 15 },
    versionText: { fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' },
    versionView: { flexDirection: 'row', paddingBottom: 15, paddingTop: 15 },

    barStyle: { width: '100%', paddingTop: 10, paddingBottom: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    headerText: { flex: 1, color: 'black', fontSize: 20, paddingRight: 5, textAlign: 'center', fontFamily: 'HelveticaNeueLTStd-Roman' },

    // Blocked Screen
    salonView : { flex: 1, flexDirection: 'row', paddingTop: 10, paddingBottom: 10, alignItems: 'center', borderBottomColor: colors.dividerGrey, borderBottomWidth: 1 } ,
    salonImage :{ height: 70, width: 70, borderRadius: 5 } ,
    salonName :{ flex: 1, paddingLeft: 5, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' } ,
    unblockText: { textAlign: 'center', fontSize: 14, width: '95%', fontFamily: 'HelveticaNeueLTStd-Md', color: 'white', paddingTop: Platform.OS === 'ios' ? 5 : 0, },

});