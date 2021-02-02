import React, { Component, Fragment } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity, TextInput, ScrollView, FlatList, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView, Modal } from 'react-native';
import Toasty from '../../elements/Toasty';
import productsStyles from './productsStyles'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import StarRating from 'react-native-star-rating';
import Swiper from 'react-native-swiper'
import CommonHeader from '../../elements/CommonHeader';
import { EventRegister } from 'react-native-event-listeners';
import ApiCaller from '../../constants/ApiCaller';
import VideoPlayer from 'react-native-video-player';
import { Dimensions } from 'react-native';
import WebView from 'react-native-webview';
import { AsyncStorage } from 'react-native';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default class ProductDetail extends Component {

    constructor() {
        super()
        this.state = {
            email: '',
            productList: [],
            productTitle: '',
            productDes: '',
            productPrice: '',
            priceIncDec: '',
            productQuantity: 1,
            productVideo: '',
            productVideoThumb: '',
            productBusinessID: '',
            productID: '',
            vendorName: '',
            vendorId: '',
            vendorAddress: '',
            vendorImage: '',
            isMyfavorite: false,
            modalVisible: false,
            productRatingCount: 0,
            rating: 0,
            vendorBusiness: '',
            cartItems: []
        }
    }



    getPreOrderApi() {
        AsyncStorage.getItem('CartId').then(res => {
            var data = JSON.stringify({
                'cart_id': res,
            })

            ApiCaller.call('appointments/preOrder', "POST", data, true)
                .then((response) => {
                    console.log("appointments/preOrder", JSON.stringify(response))
                    if (response) {
                        this.setState({
                            cartItems: response.products,
                        })
                    }
                })
                .catch((error) => {
                    console.log("Error preOrder ==>>", error);
                })
        })

    }

    checkIfItemIsInCart(id) {
        console.log(id)
        let result = false
        this.state.cartItems.forEach(element => {
            if (element.id == id) {
                result = true
            }
        });
        return result
    }

    componentDidMount() {
        this.props.navigation.addListener(
            'willFocus',
            () => {
                const { navigation } = this.props;
                var productID = navigation.getParam('productID');
                this.getProductDetailApi(productID);

                handleAndroidBackButton(() => this.props.navigation.goBack())
            }
        );
    }


    getProductDetailApi(productID) {
        EventRegister.emit('loader', true)
        ApiCaller.call('products/' + productID, "GET", null, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("products ===>>>> ", response)

                    this.setState({
                        productTitle: response.productDetails.title,
                        productDes: response.productDetails.description,
                        productPrice: response.productDetails.price,
                        priceIncDec: response.productDetails.price,
                        productVideo: response.productDetails.video_path,
                        productVideoThumb: response.productDetails.video_thumb,
                        productList: response.productImages,
                        productBusinessID: response.productDetails.business_id,
                        productID: response.productDetails.id,
                        vendorName: response.userDetails.first_name + ' ' + response.userDetails.last_name,
                        vendorAddress: response.business.address,
                        vendorId: response.userDetails.id,
                        vendorImage: response.userDetails.profile_pic_path,
                        isMyfavorite: response.isMyfavorite,
                        productRatingCount: response.productRatingCount[0].count,
                        rating: response.rating[0].average_rating,
                        vendorBusiness: response.business.name,



                        // productQuantity: response.productDetails.quantity,

                    })
                    this.getPreOrderApi()
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }




    componentWillUnmount() {
        removeAndroidBackButtonHandler();
    }



    handleTitleInputSubmit = () => {
        this.setState({ focusInput: true });
    }

    addCartCall() {
        var data = JSON.stringify({
            "price": this.state.productPrice,
            "business_id": this.state.productBusinessID,
            "product_id": this.state.productID,
            "quantity": this.state.productQuantity,
        })


        console.log(data)
        EventRegister.emit('loader', true)
        ApiCaller.call('lineItems/cart', "POST", data, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("lineItems ===>>>>", response.cart_id)
                    AsyncStorage.setItem('CartId', String(response.cart_id)).then(() => {
                        this.props.navigation.navigate('CartScreen', { cartID: response.cart_id })
                    })
                }
            })
            .catch((error) => {
                console.log("Error lineItems==>>", error);
            })

    }






    _incrementCount() {
        var countIncrement = this.state.productQuantity
        var productPrice = this.state.priceIncDec * (countIncrement + 1)
        this.setState({ productQuantity: countIncrement + 1, productPrice: productPrice.toFixed(2) })
    }

    _decrementCount() {
        var countDecrement = this.state.productQuantity
        var productPrice = this.state.priceIncDec * (countDecrement != 1 ? countDecrement - 1 : 1)
        this.setState({ productQuantity: countDecrement != 1 ? countDecrement - 1 : 1, productPrice: productPrice.toFixed(2) })
    }


    onPressFav(idddd) {
        ApiCaller.call('products/' + idddd + '/favorite', "GET", null, true)
            .then((response) => {
                if (response) {
                    console.log("portfolio user ===>>>>", response)

                    this.setState({ isMyfavorite: response.isMyfavorite })

                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })

    }

    render() {
        return (
            <Fragment>

                <SafeAreaView style={[productsStyles.statusColor]} />
                <SafeAreaView style={productsStyles.bottomColor}>
                    <View>
                        <CommonHeader
                            drawable={require('../../assets/images/back_arrow.png')}
                            action={() => this.props.navigation.goBack()}
                            title='Details'
                            title1='' />


                        <ScrollView style={{ height: '95%' }} showsVerticalScrollIndicator={false}>

                            <View style={[{ height: '100%' }]}>
                                <View>
                                    <TouchableOpacity style={{ position: 'absolute', top: 10, right: 10, zIndex: 99999 }} activeOpacity={0.9} onPress={() => this.onPressFav(this.state.productID)}>
                                        {this.state.isMyfavorite ? <Image style={{ height: 35, width: 35, borderRadius: 10 }} source={require('../../assets/images/heart_fill.png')} />
                                            : <Image style={{ height: 35, width: 35, borderRadius: 10 }} source={require('../../assets/images/heart_rounded.png')} />}

                                    </TouchableOpacity>
                                    {this.state.productList.length > 0 ? <Swiper
                                        style={{ height: 250, color: "#fff" }} color="#fff"
                                        showsButtons={true}
                                        dotColor="#fff"
                                        activeDotColor='black'
                                        key={this.state.productList.length}
                                        paginationStyle={{ position: 'absolute', bottom: 12 }}>

                                        {this.state.productList.map((dataItem, index) => (
                                            <View>
                                                <View >
                                                    <Image key={index.position} resizeMode='contain' style={{ height: '100%', width: '100%' }} source={{ uri: dataItem.image_path }} />
                                                </View>
                                            </View>
                                        ))}
                                        {this.state.productVideo &&
                                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                <Image resizeMode='contain' style={{ height: '100%', width: '100%' }} source={{ uri: this.state.productVideoThumb }} />
                                                <TouchableOpacity style={{ height: 50, width: 50, position: 'absolute', zIndex: 99999 }} onPress={() => { this.setState({ modalVisible: true }) }}>
                                                    <Image style={{ height: 50, width: 50 }} source={require('../../assets/images/video_icon.png')} />
                                                </TouchableOpacity>
                                            </View>
                                        }
                                    </Swiper> :

                                        <View style={{ height: 250, color: "#fff" }} >
                                            <Image style={{ height: '100%', width: '100%' }} source={require('../../assets/images/ic_placeholder.png')} />
                                        </View>}
                                </View>

                                <FlatList
                                    scrollEnabled={false}
                                    data={this.state.productList}
                                    horizontal={true}
                                    ListFooterComponent={this.state.productVideo ?
                                        <TouchableOpacity style={{ flex: 1, flexDirection: 'column', alignItems: 'center', padding: 5 }}>
                                            <Image style={{ height: 50, width: 50, borderRadius: 5 }} source={{ uri: this.state.productVideoThumb }} />
                                        </TouchableOpacity> : null
                                    }
                                    contentContainerStyle={{ marginTop: 5, paddingLeft: 5 }}
                                    refreshing={this.state.refreshing}
                                    renderItem={({ item, index }) =>
                                        <TouchableOpacity style={{ flex: 1, flexDirection: 'column', alignItems: 'center', padding: 5 }}>
                                            <Image style={{ height: 50, width: 50, borderRadius: 5 }} source={{ uri: item.image_path }} />
                                        </TouchableOpacity>
                                    }
                                    keyExtractor={item => item.id}
                                />



                                <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', borderBottomColor: '#d7dada', borderBottomWidth: 1, paddingBottom: 10 }}>
                                    <View style={{ flex: 1, padding: 10, }}>
                                        <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md' }}>{this.state.productTitle}</Text>
                                        <Text style={{ fontSize: 12, fontFamily: 'HelveticaNeueLTStd-Roman', color: 'grey' }}>Hair Treatment</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <StarRating
                                                disabled={false}
                                                starSize={16}
                                                fullStarColor={'#ED8A19'}
                                                rating={this.state.rating}
                                            />
                                            <Text style={{ paddingLeft: 5, fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey', marginTop: Platform.OS === 'ios' ? 8 : 0 }}>{this.state.productRatingCount}</Text>
                                        </View>
                                    </View>
                                    <Text style={{ fontSize: 20, paddingTop: 10, paddingBottom: 10, fontFamily: 'HelveticaNeueLTStd-Md', color: '#4CC9CA', alignSelf: 'center', paddingRight: 10 }}>${this.state.productPrice}</Text>
                                </TouchableOpacity>

                                <View style={{ flexDirection: 'row', padding: 10, flex: 1, paddingTop: 10, paddingBottom: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1, justifyContent: 'center' }}>
                                    <Text style={{ flex: 1, fontSize: 12, color: 'grey', fontFamily: 'HelveticaNeueLTStd-Roman', textTransform: 'uppercase', alignSelf: 'center' }}>Quanitty</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt', marginRight: 5, marginTop: Platform.OS === 'ios' ? 8 : 0 }}>{this.state.productQuantity}</Text>
                                        <TouchableOpacity onPress={() => this._decrementCount()} activeOpacity={1} style={{ height: 30, width: 30, borderBottomLeftRadius: 50, borderTopLeftRadius: 50, backgroundColor: '#4CC9CA', alignItems: 'center', padding: 5, marginRight: 1 }}>
                                            <Image style={{ height: 20, width: 10, resizeMode: 'contain', marginLeft: 5 }} source={require('../../assets/images/minus.png')} />
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => this._incrementCount()} activeOpacity={1} style={{ height: 30, width: 30, borderTopRightRadius: 50, borderBottomRightRadius: 50, backgroundColor: '#4CC9CA', alignItems: 'center', padding: 5, marginLeft: 1 }}>
                                            <Image style={{ height: 20, width: 10, resizeMode: 'contain', marginRight: 3 }} source={require('../../assets/images/plus.png')} />
                                        </TouchableOpacity>
                                    </View>
                                </View>


                                {/* <View style={{ flexDirection: 'row', padding: 10, flex: 1, paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 5 : 10, borderBottomColor: '#d7dada', borderBottomWidth: 1, justifyContent: 'center' }}>
                                    <Text style={{ flex: 1, fontSize: 12, color: 'grey', fontFamily: 'HelveticaNeueLTStd-Roman', textTransform: 'uppercase', alignSelf: 'center' }}>Shipping Cost</Text>

                                    <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md', marginRight: 3 }}>$10</Text>
                                </View> */}

                                <View style={{ padding: 10, flexDirection: 'row', paddingTop: 10, paddingBottom: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1, alignItems: 'center' }}>
                                    <TouchableOpacity onPress={() => { global.providerID = this.state.vendorId; this.props.navigation.push('SellerProfile') }} style={{ flex: 1, marginTop: 5, marginBottom: 5 }}>
                                        <Text style={{ fontSize: 12, color: 'grey', fontFamily: 'HelveticaNeueLTStd-Roman', textTransform: 'uppercase' }}>Vendor</Text>
                                        {console.log(this.state.vendorBusiness)}
                                        <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman', paddingTop: 4, paddingBottom: 4 }}>{this.state.vendorBusiness ? this.state.vendorBusiness : this.state.vendorName}</Text>
                                        <Text numberOfLines={2} style={{ fontSize: 14, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>{this.state.vendorAddress}</Text>
                                    </TouchableOpacity>

                                    {this.state.vendorImage ? <Image style={{ height: 50, width: 50, borderRadius: 5, marginTop: 10 }} source={{ uri: this.state.vendorImage }} />
                                        : <Image style={{ height: 50, width: 50, borderRadius: 5, marginTop: 10 }} source={require('../../assets/images/ic_placeholder.png')} />}
                                </View>

                                <View style={{ padding: 10, paddingTop: 10, paddingBottom: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1 }}>
                                    <View style={{ flex: 1, marginTop: 5, marginBottom: 5 }}>
                                        <Text style={{ fontSize: 12, color: 'grey', fontFamily: 'HelveticaNeueLTStd-Roman', textTransform: 'uppercase' }}>Description</Text>
                                        <Text style={{ fontSize: 14, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt', paddingTop: 4, paddingBottom: 4 }}>{this.state.productDes}</Text>
                                    </View>
                                </View>
                                {this.checkIfItemIsInCart(this.state.productID) ?
                                    <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate('CartScreen')} style={{ padding: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', width: '95%', backgroundColor: '#4CC9CA', margin: 30 }}>
                                        <Text style={productsStyles.buttonTextStyle}>Go To Cart</Text>
                                    </TouchableOpacity> :
                                    <TouchableOpacity activeOpacity={1} onPress={() => this.addCartCall()} style={{ padding: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', width: '95%', backgroundColor: '#4CC9CA', margin: 30 }}>
                                        <Text style={productsStyles.buttonTextStyle}>Add To Cart</Text>
                                    </TouchableOpacity>
                                }
                            </View>

                            <Modal animationType={"slide"} transparent={false}
                                visible={this.state.modalVisible}
                                onRequestClose={() => { this.setState({ modalVisible: false }) }}>

                                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'black' }}>

                                    <TouchableOpacity activeOpacity={1} onPress={() => this.setState({ modalVisible: false })} style={{ zIndex: 9999, width: 25, height: 25, position: 'absolute', top: 60, right: 20 }}>
                                        <Image style={[{ width: 25, height: 25, resizeMode: 'contain' }]} source={require('../../assets/images/white_cross.png')} />
                                    </TouchableOpacity>

                                    <View>
                                        <VideoPlayer
                                            video={{ uri: this.state.productVideo }}
                                            videoWidth={viewportWidth}
                                            videoHeight={viewportHeight }
                                            thumbnail={{ uri: this.state.productVideoThumb }}

                                        />

                                    </View>
                                </View>
                            </Modal>
                        </ScrollView>
                    </View>

                </SafeAreaView>
            </Fragment>
        )
    }
}

