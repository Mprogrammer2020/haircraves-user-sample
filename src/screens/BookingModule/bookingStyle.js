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
        marginTop: 10,
        padding: 15,
        width: 160,
        borderRadius: 50,
        alignItems: 'center',
        backgroundColor: '#4CC9CA',
    },
    buttonTextStyle: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'HelveticaNeueLTStd-Md',
        paddingTop: Platform.OS === 'ios' ? 8 : 0,
    },





    statusText: { fontSize: 12, color: '#BBBBBB', fontFamily: 'HelveticaNeueLTStd-Md', textTransform: 'uppercase' },

    popText: { fontSize: 20, color: colors.black, fontFamily: 'HelveticaNeueLTStd-Lt' },
    pophow: { fontSize: 16, color: colors.black, fontFamily: 'HelveticaNeueLTStd-Roman', marginTop: 5, marginBottom: 5 },
    everything: { fontSize: 16, color: colors.black, fontFamily: 'HelveticaNeueLTStd-Roman'},


    appIcon: { width: 200, height: 50, resizeMode: 'contain' },

    editView: { width: '100%', flexDirection: 'column' },

    inputStyle: {
        width: '100%', fontSize: 16, color: colors.black, fontFamily: 'HelveticaNeueLTStd-Lt',
        paddingTop: Platform.OS === 'ios' ? 10 : 5,
        paddingBottom: Platform.OS === 'ios' ? 10 : 5
    },


    // My Booking Screen

    mainUpCmplt : { height: 45, marginTop: 15, flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
    viewUpcomming : { backgroundColor: '#4CC9CA', width: '50%', height: 45, alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 30, borderBottomLeftRadius: 30},
    viewCompleted: { backgroundColor: '#DCDADA', width: '50%', alignItems: 'center', justifyContent: 'center', height: 45, borderTopRightRadius: 30, borderBottomRightRadius: 30 } ,
    stylishText: { paddingTop: 5, fontSize: 12, color: '#BBBBBB', fontFamily: 'HelveticaNeueLTStd-Md', textTransform: 'uppercase' },
    stylishImages: { height: 50, width: 50 },
    rightArrow: { height: 20, width: 20 },
    stylishSalon: { fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' },
    stylishAddress : { fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'black' } ,
    stylishDateBooking: { fontSize: 12, color: '#BBBBBB', fontFamily: 'HelveticaNeueLTStd-Md', textTransform: 'uppercase' },
    bookingDay: { fontSize: 14, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman', marginTop: 5, marginBottom: 5 },
    bookingTime: { fontSize: 12, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' },
    bookingStatus: { fontSize: 16, color: '#32ba7c', fontFamily: 'HelveticaNeueLTStd-Roman', marginTop: 5, marginBottom: 5 },


     // Active Cancelled Completed Detail Screen

     bookingID : { fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman', marginTop: 5, marginBottom: 5 },
     detailStatus: { fontSize: 16, fontFamily: 'HelveticaNeueLTStd-Roman', marginTop: 5, marginBottom: 5 } ,
     detailDay :{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman', marginTop: 5, marginBottom: 5 } ,
     detailTime : { fontSize: 12, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt' } ,
     detailSalonName : { fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman', paddingTop: 4, paddingBottom: 4 } ,
     locationImages : { height: 20, width: 20, resizeMode: 'contain', borderRadius: 5 } ,
     detailSalonAddress : { flex: 1, fontSize: 14, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' },
     detailSellerImages : { height: 50, width: 50, borderRadius: 5, paddingLeft: 5 } ,
     detaiGrand: {fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md' },
     detailServiceTax :{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman', paddingBottom: 5 },
     noteText :{ fontSize: 14, color: 'black', fontStyle: 'italic' } ,
     buttonView : { padding: 15, width: '95%', alignSelf: 'center', borderRadius: 50, alignItems: 'center', backgroundColor: '#4CC9CA', marginTop: 15 } ,
     detailService : { fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' },
     detailServiceTime : { fontSize: 14, color: '#BBBBBB', fontFamily: 'HelveticaNeueLTStd-Md', paddingBottom: 5 },
     detailServicePrice: { paddingTop: 5, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' },
     reasonText : { fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman', marginTop: 5, marginBottom: 5 },
     startOver: { width: '100%', fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman', textDecorationLine: 'underline', textAlign: 'center', paddingBottom: 10, paddingTop: 20 },

     appointmentImage : { width: 15, height: 25, resizeMode: 'contain' },

});