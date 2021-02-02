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

    buttonTextStyle: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'HelveticaNeueLTStd-Lt'
    },

    barStyle: { width: '100%', paddingTop: 10, paddingBottom: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    headerText: { flex: 1, color: 'black', fontSize: 20, paddingRight: 5, textAlign: 'center', fontFamily: 'HelveticaNeueLTStd-Roman' },



    // Favorite Screen

    mainSrvPro: { height: 45, marginTop: 15, marginBottom: 15, flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
    serviceView: { width: '50%', height: 45, alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 30, borderBottomLeftRadius: 30 },
    productsView: { width: '50%', alignItems: 'center', justifyContent: 'center', height: 45, borderTopRightRadius: 30, borderBottomRightRadius: 30 },

    providerImage: { height: 80, width: 80, borderRadius: 10 },
    providerName: { fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' },
    ProviderReview: { fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt', marginLeft: 5, paddingTop: Platform.OS === 'ios' ? 5 : 0, },
    imageLocation: { height: 20, width: 20 },
    providerAddress: { fontSize: 13, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' },
    isFavImage: { height: 40, width: 40, marginRight: 5 },

    imageView: { height: 150, width: 150 },
    productLikeView: { height: 30, width: 30, borderRadius: 10, position: 'absolute', top: 5, right: 10, zIndex: 99999 },
    productLike: { height: 40, width: 40, borderRadius: 10, },
    productImage: { height: 150, width: 150, borderRadius: 10 },
    productName: { fontSize: 16, width: '95%', color: 'black', fontFamily: 'HelveticaNeueLTStd-Md', marginTop: 5 },
    productReview: { fontSize: 14, width: '95%', marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey', paddingTop: Platform.OS === 'ios' ? 5 : 0, },
    productDescription: { fontSize: 14, width: '95%', fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey' },

    priceBuyView: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: 5, paddingBottom: 5 },
    productPrice: { flex: 1, fontSize: 14, width: '95%', marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Roman', color: 'black' },
    buyButton: { alignItems: 'center', backgroundColor: '#4CC9CA', width: 65, borderRadius: 20, padding: 5 },
    buyText: { textAlign: 'center', fontSize: 14, width: '95%', marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Roman', color: 'white', paddingTop: Platform.OS === 'ios' ? 5 : 0, },


});