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



    // MyOrderStyle 

    barStyle: { width: '100%', paddingTop: 10, paddingBottom: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    headerText: { flex: 1, color: 'black', fontSize: 20, paddingRight: 5, textAlign: 'center', fontFamily: 'HelveticaNeueLTStd-Roman' },
    myOrderView: { flexDirection: 'row', padding: 5, borderBottomColor: 'grey', borderBottomWidth: 1, paddingTop: 10, paddingBottom: 10 },
    myOrderService: { fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' },
    myOrderDes: { fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey' },
    myOrderStatus: { fontSize: 16, paddingTop: 10, paddingBottom: 10, fontFamily: 'HelveticaNeueLTStd-Md', color: '#32ba7c' },
    myOrderImg: { height: 100, width: 100, borderRadius: 10 },


    // InProgressDetail

    orderService: { fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' },
    orderDes: { fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey' },
    orderPrice: { fontSize: 16, paddingTop: 10, paddingBottom: 10, fontFamily: 'HelveticaNeueLTStd-Md', color: 'black' },
    orderImage: { height: 80, width: 80, borderRadius: 10, marginTop: 10, marginRight: 10 },
    viewSellerAdress: { padding: 10, flexDirection: 'row', paddingTop: 10, paddingBottom: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1, alignItems: 'center' },
    sellerText: { fontSize: 12, color: '#BBBBBB', fontFamily: 'HelveticaNeueLTStd-Md', textTransform: 'uppercase' },
    sellerShop: { fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman', paddingTop: 4 },
    sellerAddress: { fontSize: 14, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman', paddingTop: 5, paddingBottom: 5 },
    serviceText: { fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' },

    grandTotalView: { padding: 10, flexDirection: 'row', paddingTop: 10, paddingBottom: 10 },
    grandTotalText: { flex: 1, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md' },
    grandPrice: { fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md' },


    popText: { fontSize: 20, color: colors.black, fontFamily: 'HelveticaNeueLTStd-Md' },

    pophow: { fontSize: 16, color: colors.black, fontFamily: 'HelveticaNeueLTStd-Roman', marginTop: 5, marginBottom: 5 },

    orderStatusText: { fontSize: 10, color: 'black', fontFamily: 'Montserrat-SemiBold', textAlign: 'center', marginTop: 10 },
    orderNumber: { fontSize: 16, color: 'white', fontFamily: 'HelveticaNeueLTStd-Lt', paddingTop: Platform.OS === 'ios' ? 8 : 0, },
    orderView: { flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: 60, height: 60, borderRadius: 30, backgroundColor: '#dcdcdc' }

});