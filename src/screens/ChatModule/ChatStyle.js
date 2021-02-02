import { StyleSheet, Platform } from 'react-native';

export default ChatStyle = StyleSheet.create({

    statusColor: {
        flex: 0,
        backgroundColor: 'white'
    },
    bottomColor: {
        flex: 1,
        backgroundColor: 'white'
    },

    viewBlue: {
        // marginTop: 5,
        padding: 10,
        alignItems: 'flex-end',
        // width: '70%',
        alignSelf: 'flex-end',
        marginLeft: 60,
    },
    blueMsg: {
        overflow: 'hidden',
        color: '#fff',
        fontFamily: 'HelveticaNeueLTStd-Roman',
        fontSize: 14,
        textAlign: 'left',
        borderRadius: 20,
    },
    viewGrey: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '90%',
        alignSelf: 'flex-start'
    },
    greyMsgView: {
        // width: '70%',
        overflow: 'hidden',
        backgroundColor: '#ededed',
        textAlign: 'left',
        padding: 10,
        marginLeft: 5,
        borderRadius: 10,
        borderTopLeftRadius: 0,
        marginRight: 60,
    },

    greyText: {
        color: 'black',
        fontFamily: 'HelveticaNeueLTStd-Roman',
        fontSize: 16,
    },

    timeText: {
        color: 'grey',
        paddingTop: 5,
        fontFamily: 'HelveticaNeueLTStd-Roman',
        fontSize: 12,
    },


    flatStyle: {
        padding: 5,
        marginTop: 10,
        borderBottomColor: '#959595'
    },

    inputView: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    image: {
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    imageSend: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    textInput: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 5,
        paddingTop: Platform.OS === 'ios' ? 15 : 10,
        paddingBottom: Platform.OS === 'ios' ? 15 : 10
    },


    barStyle: { width: '100%', paddingTop: 10, paddingBottom: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    headerText: { flex: 1, color: 'black', fontSize: 20, paddingRight: 5, textAlign: 'center', fontFamily: 'HelveticaNeueLTStd-Roman' },


    reportCheckImg: { height: 25, width: 25, resizeMode: 'contain' },
    reportCheckText: { fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Roman', color: 'black', paddingLeft: 10, marginTop: Platform.OS=='ios'?5:0 },





    // Chat Screen 

    viewMain: { width: '100%', backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 5, paddingTop: 0 },
    viewChat: { flex: 1, flexDirection: 'row', padding: 5, alignItems: 'center', paddingTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: 'grey' },
    viewInternalChat: { flex: 1, paddingLeft: 5, paddingRight: 5, flexDirection: 'row' },
    barberImage: { height: 70, width: 70, borderRadius: 5 },
    barberSalon: { fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' },
    messageText: { paddingBottom: 5, paddingTop: 5, fontSize: 14, width: '95%', fontFamily: 'HelveticaNeueLTStd-Roman', color: 'grey' },
    timeText: { fontSize: 14, color: 'grey', fontFamily: 'HelveticaNeueLTStd-Roman' },


    // Single Chat 

    menuStyle: { fontFamily: 'HelveticaNeueLTStd-Roman', height: 40 },
    reportView: { flexDirection: 'row', paddingTop: 5, paddingBottom: 5, alignItems: 'center' },
    reportUser: { fontSize: 18, fontFamily: 'HelveticaNeueLTStd-Md', color: 'black', padding: 10, textAlign: 'center' },

    modalView: { height: 'auto', borderRadius: 20, backgroundColor: 'white', marginLeft: 10, marginRight: 10 },
    crossView: { alignItems: 'flex-end', padding: 15, paddingBottom: 5 },
    crossImage: { height: 20, width: 20, },
    buttonStyle: {
        padding: 15,
        borderRadius: 50,
        alignItems: 'center',
        backgroundColor: '#4CC9CA',
        alignSelf: 'center',
        width: 200,
        marginTop: 10,
        marginBottom: 25
    },

    buttonTextStyle: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'HelveticaNeueLTStd-Md',
        marginTop: Platform.OS=='ios'?10:0
    },


    rowBack: {
        backgroundColor: 'white',
        // height: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1
    },



});