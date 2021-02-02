import { StyleSheet, Platform, Dimensions } from 'react-native';
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
        marginTop: 10,
        padding: 15,
        width: '100%',
        borderRadius: 50,
        alignItems: 'center',
        backgroundColor: '#4CC9CA',
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
        fontFamily: 'HelveticaNeueLTStd-Roman',
        paddingTop: Platform.OS === 'ios' ? 15 : 10,
        paddingBottom: Platform.OS === 'ios' ? 15 : 10
    },
    inputView: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    inputStyle: {
        width: '100%', fontSize: 16, color: colors.black, fontFamily: 'HelveticaNeueLTStd-Lt',
        paddingTop: Platform.OS === 'ios' ? 10 : 5,
        paddingBottom: Platform.OS === 'ios' ? 10 : 5
    },

    editView: { width: '100%', flexDirection: 'column' },


    viewStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 50
    },

    touchService: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingLeft: 5 },
    touchServiceBack: { width: '95%', height: 100, resizeMode: 'contain' },
    viewStyleService: { flexDirection: 'column', position: 'absolute', justifyContent: 'center', alignSelf: 'center', top: 0, bottom: 0 },
    touchProduct: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingRight: 5 },
    productImage: { width: 50, height: 50, resizeMode: 'contain', alignSelf: 'center' },
    productText: { fontFamily: 'HelveticaNeueLTStd-Md', color: 'white', fontSize: 14, marginTop: 5 },


    barStyle: { width: '100%', paddingTop: 10, paddingBottom: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    headerText: { flex: 1, color: 'black', fontSize: 20, paddingRight: 15, textAlign: 'center', fontFamily: 'HelveticaNeueLTStd-Roman' },

    buttonTextStyle: { color: colors.white, fontSize: 16, fontFamily: 'HelveticaNeueLTStd-Md', paddingTop: Platform.OS === 'ios' ? 5 : 0, },


    portfolioImage: { height: Dimensions.get('window').width, width: '100%', marginTop: 5 },
    portfolioTitle: { fontSize: 16, width: '95%', color: 'black', fontFamily: 'HelveticaNeueLTStd-Md', marginTop: 20 },
    portfolioDes: { fontSize: 14, width: '95%', fontFamily: 'HelveticaNeueLTStd-Lt', color: 'black' },
    tagText: { fontSize: 14, width: '95%', fontFamily: 'HelveticaNeueLTStd-Roman', color: 'black', marginTop: 5 },

    likeMainView: { flexDirection: 'row', marginTop: 10, marginBottom: 10 },
    likeView: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    likeImage: { height: 20, width: 20 },
    likeText: { marginLeft: 5, fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey', paddingTop: Platform.OS === 'ios' ? 8 : 0 },


    // Detail Screen

    detailLikeView: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 5, paddingTop: 0, paddingBottom: 8, paddingLeft: 20, borderBottomColor: '#d7dada', borderBottomWidth: 1 },
    detailLike: { height: 40, width: 40 },
    detailLikeText: { marginLeft: 10, fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Md', paddingTop: Platform.OS === 'ios' ? 8 : 0 },

    likeCommentView: { flexDirection: 'row', marginTop: 10, marginBottom: 10, padding: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1, borderTopWidth: 1, borderTopColor: '#d7dada' },
    commentView: { flex: 1, flexDirection: 'column', padding: 5, paddingLeft: 15, marginLeft: 5, marginRight: 5, backgroundColor: '#4CC9CA', borderRadius: 20, borderTopLeftRadius: 0, },
    commentImage: { height: 50, width: 50, borderRadius: 5 },
    commentName: { fontSize: 16, color: 'white', fontFamily: 'HelveticaNeueLTStd-Md' },
    comment: { fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'white' },
    commentTime: { fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey', marginTop: 5, marginBottom: 5 },


    prodUserText: { fontSize: 15, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md', paddingLeft: 10 },


    // Notification Style 

    notificationTitle: { fontSize: 15, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' },
    notificationTime: { fontSize: 12, marginTop: 5, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt' },
    timerView: { alignItems: 'center', backgroundColor: '#4CC9CA', width: 70, borderRadius: 20, padding: 5 },
    timerText: { textAlign: 'center', fontSize: 14, width: '100%', fontFamily: 'HelveticaNeueLTStd-Lt', color: 'white', marginTop: Platform.OS == 'ios' ? 5 : 0 },


});