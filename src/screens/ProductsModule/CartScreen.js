import React, { Component, Fragment } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity, TextInput, ScrollView, FlatList, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView, Dimensions, ActivityIndicator } from 'react-native';
import Toasty from '../../elements/Toasty';
import productsStyles from './productsStyles'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import CommonHeader from '../../elements/CommonHeader';
import Modal from 'react-native-modal';
import { EventRegister } from 'react-native-event-listeners';
import ApiCaller from '../../constants/ApiCaller';
import moment from 'moment';
import WebView from 'react-native-webview';
import { AsyncStorage } from 'react-native';



const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');


export default class CartScreen extends Component {

    constructor() {
        super()
        this.state = {
            email: '',
            itemCount: 1,
            cartItem: [],
            isChecked: 0,
            subTotal: '',
            serviceTax: '',
            grandTotal: '',
            shippingAddress: '',
            sendCardID: '',
            businessID: '',
            providerID: '',
            lastFourDigits: '',
            cardID: '',
            customerID: '',
            webViewVisible: false,
            webLoader: false,
            sendAppointmentID: ''

        }
    }



    componentDidMount() {
        const { navigation } = this.props;
        // var cartID = navigation.getParam('cartID');
        AsyncStorage.getItem('CartId').then(cartId => {
            this.setState({ sendCardID: cartId })
            this.getPreOrderApi(cartId)
        })
        this.props.navigation.addListener(
            'willFocus',
            () => {
                handleAndroidBackButton(() => this.props.navigation.goBack())
            }
        );
    }


    onDeleteService(item, index) {
        var cartItem = this.state.cartItem;
        let data = {
            "quantity": cartItem[index].quantity,
            "cart_price": this.state.grandTotal - item.price,
            "line_item_price": item.price * cartItem[index].quantity,
        }

        ApiCaller.call('lineItems/' + item.lineItemId, "DELETE", JSON.stringify(data), true)
            .then((response) => {
                if (response) {
                    this.getPreOrderApi(this.state.sendCardID)
                    console.log("payment_response", response)
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }

    increaseQuantitiy(item, index) {
        var cartItem = this.state.cartItem;
        // cartItem[index].quantity = cartItem[index].quantity + 1;
        // cartItem[index].price = cartItem[index].price *  cartItem[index].quantity
        // this.setState({ cartItem: cartItem });
        console.log(item)
        let listItemPrice = (cartItem[index].quantity + 1)

        let data = {
            "quantity": cartItem[index].quantity + 1,
            "cart_price": this.state.grandTotal + item.price,
            "line_item_price": item.price * listItemPrice,
        }

        console.log(JSON.stringify(data))
        ApiCaller.call('lineItems/' + item.lineItemId + '/increase', "POST", JSON.stringify(data), true)
            .then((response) => {
                if (response) {
                    this.getPreOrderApi(this.state.sendCardID)
                    console.log("payment_response", response)
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }

    decreaseQuantitiy(item, index) {
        var cartItem = this.state.cartItem;
        if (cartItem[index].quantity > 1) {
            // cartItem[index].quantity = cartItem[index].quantity + 1;
            // cartItem[index].price = cartItem[index].price *  cartItem[index].quantity
            // this.setState({ cartItem: cartItem });
            console.log(item)
            let listItemPrice = (cartItem[index].quantity - 1)
            let data = {
                "quantity": cartItem[index].quantity - 1,
                "cart_price": this.state.grandTotal - item.price,
                "line_item_price": item.price * listItemPrice,
            }

            console.log(JSON.stringify(data))
            ApiCaller.call('lineItems/' + item.lineItemId + '/increase', "POST", JSON.stringify(data), true)
                .then((response) => {
                    if (response) {
                        this.getPreOrderApi(this.state.sendCardID)
                        console.log("payment_response", response)
                    }
                })
                .catch((error) => {
                    console.log("ErrorLogin", error);
                })
        }
    }

    getPreOrderApi(cardID) {
        var data = JSON.stringify({
            'cart_id': cardID,
        })
        EventRegister.emit('loader', true)
        ApiCaller.call('appointments/preOrder', "POST", data, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("preOrder ===>>>>", JSON.stringify(response))

                    this.setState({
                        cartItem: response.products,
                        subTotal: response.subtotal,
                        serviceTax: response.service_tax,
                        grandTotal: response.grand_total,
                        businessID: response.business_id,
                        providerID: response.provider_id,
                        lastFourDigits: response.cards.data[0] ? response.cards.data[0].last4 : '',
                        cardID: response.cards.data[0] ? response.cards.data[0].id : '',
                        customerID: response.cards.data[0] ? response.cards.data[0].customer : '',

                    })
                }
            })
            .catch((error) => {
                console.log("Error preOrder ==>>", error);
            })
    }


    componentWillUnmount() {
        removeAndroidBackButtonHandler();
    }



    handleTitleInputSubmit = () => {
        this.setState({ focusInput: true });
    }


    onPressPament = (screen) => {
        this.props.navigation.navigate(screen, {
            onGoBack: this.getCardData,
        });

    }

    getCardData = (last_four, card_id, card_customer) => {
        console.log("getCardData", last_four, card_id, card_customer)
        this.setState({ lastFourDigits: last_four, cardID: card_id, customerID: card_customer })
    }


    onPressAddress = (screen) => {
        this.props.navigation.navigate(screen, {
            onGoBack: this.getAddressData,
        });

    }

    getAddressData = (data) => {
        console.log("getAddressData", data)
        this.setState({ shippingAddress: data })
    }

    // _onPress(screen) {
    //     this.props.navigation.navigate(screen)     
    // }


    placeOrderCall() {
        if (this.state.isChecked == 1) {
            this.hitFromPayPal()
        }
        else {
            this.hitFromCard();
        }

    }

    hitFromCard() {

        console.log(this.state.cardID)

        if (this.state.cardID.length == 0) {
            Toasty.show('Please add card')
        }

        else if (this.state.shippingAddress.length == 0) {
            Toasty.show('Please add shipping address')

        } else {

            var data = JSON.stringify({
                "cart_id": this.state.sendCardID,
                "business_id": this.state.businessID,
                "provider_id": this.state.providerID,
                "amount": parseInt(this.state.grandTotal * 100),
                "card_id": this.state.cardID,
                "customer": this.state.customerID,
                "shipping_address": this.state.shippingAddress,
                "product": true

            })

            console.log(data)

            EventRegister.emit('loader', true)
            ApiCaller.call('appointments', "POST", data, true)
                .then((response) => {
                    EventRegister.emit('loader', false)
                    if (response) {
                        console.log("appointments", response)
                        this.setState({ modalVisible: 'slow' });
                        AsyncStorage.removeItem('CartId')
                    }
                })
                .catch((error) => {
                    console.log("ErrorLogin", error);
                })
        }
    }




    hitFromPayPal() {

        if (this.state.shippingAddress.length == 0) {
            Toasty.show('Please add shipping address')

        }
        else {

            var data = JSON.stringify({
                "cart_id": this.state.sendCardID,
                "business_id": this.state.businessID,
                "provider_id": this.state.providerID,
                "amount": '',
                "card_id": '',
                "customer": '',
                "shipping_address": this.state.shippingAddress,
                "product": true,
                'paypal': true,

            })

            console.log(data)

            EventRegister.emit('loader', true)
            ApiCaller.call('appointments', "POST", data, true)
                .then((response) => {
                    EventRegister.emit('loader', false)
                    if (response) {
                        AsyncStorage.removeItem('CartId')
                        console.log("appointments", response)
                        this.setState({ webViewVisible: 'slow', sendAppointmentID: response.order_id });
                    }

                })
                .catch((error) => {
                    console.log("ErrorLogin", error);
                })
        }

    }


    _onNavigationStateChange(webViewState) {
        console.log("======>>>>>", webViewState.url)
        if (webViewState.url.includes('success') == true) {

            this.payNowClick()
            this.setState({ webViewVisible: false, modalVisible: 'slow' });
            /* var splittedurl = webViewState.url.split('/');
             var code = splittedurl[splittedurl.length - 1];               
             console.log("codee===>>>", code) */
        }
    }

    payNowClick() {
        var data = JSON.stringify({
            "amount": parseInt(this.state.grandTotal),
            "customer": '',
            'card_id': '',
            'provider_id': this.state.providerID,
            'paypal': true,
            "product": true

        })
        console.log(data)
        console.log(this.state.sendAppointmentID)
        ApiCaller.call('appointments/' + this.state.sendAppointmentID + '/makePayment', "POST", data, true)
            .then((response) => {
                if (response) {

                    console.log("payment_response", response)
                    AsyncStorage.removeItem('CartId')
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }



    closeWebModal() {
        this.setState({ webViewVisible: false });
    }


    verifyOK(type) {
        this.setState({ modalVisible: false });
        global.myvar = 'Home'
        global.prevScreenOrder = ''
        if (type == 'C') {
            this.props.navigation.navigate('SellerProfile')
        }
        else {
            this.props.navigation.navigate("MyOrder");
        }
    }

    onClickCard() {
        this.setState({ isChecked: 0 })
    }

    onClickPaypal() {
        this.setState({ isChecked: 1 })
    }

    _incrementCount() {
        var countIncrement = this.state.itemCount
        this.setState({ itemCount: countIncrement + 1 })
    }

    _decrementCount() {
        var countDecrement = this.state.itemCount
        this.setState({ itemCount: countDecrement != 1 ? countDecrement - 1 : 1 })
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
                            title='Cart' />

                        {this.state.sendCardID ? <ScrollView style={{ height: '95%' }} showsVerticalScrollIndicator={false}>

                            <View>
                                <View style={[{ flex: 1 }]}>
                                    <FlatList
                                        scrollEnabled={false}
                                        data={this.state.cartItem}
                                        contentContainerStyle={{ marginTop: 20 }}
                                        refreshing={this.state.refreshing}
                                        renderItem={({ item, index }) =>
                                            <View style={{ flexDirection: 'row', padding: 10, flex: 1, paddingTop: 10, paddingBottom: 10, paddingTop: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1 }}>
                                                <TouchableOpacity activeOpacity={1} style={{ height: 30, width: 30 }} onPress={() => this.onDeleteService(item, index)}>
                                                    <Image style={{ height: 30, width: 30 }} source={require('../../assets/images/delete_black.png')} />
                                                </TouchableOpacity>
                                                <View style={{ flex: 1, paddingLeft: 10 }}>
                                                    <Text style={{ flex: 1, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md', justifyContent: 'center' }}>{item.productName}</Text>
                                                    <Text style={{ flex: 1, fontSize: 14, color: 'grey', fontFamily: 'HelveticaNeueLTStd-Roman', justifyContent: 'center' }}>${item.price}</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman', marginRight: 5, marginTop: Platform.OS === 'ios' ? 5 : 0 }}>{item.quantity}</Text>

                                                    <TouchableOpacity onPress={() => this.decreaseQuantitiy(item, index)} activeOpacity={1} style={{ height: 30, width: 30, borderBottomLeftRadius: 50, borderTopLeftRadius: 50, backgroundColor: '#4CC9CA', alignItems: 'center', padding: 5, marginRight: 1 }}>
                                                        <Image style={{ height: 20, width: 10, resizeMode: 'contain', marginLeft: 5 }} source={require('../../assets/images/minus.png')} />
                                                    </TouchableOpacity>

                                                    <TouchableOpacity onPress={() => this.increaseQuantitiy(item, index)} activeOpacity={1} style={{ height: 30, width: 30, borderTopRightRadius: 50, borderBottomRightRadius: 50, backgroundColor: '#4CC9CA', alignItems: 'center', padding: 5, marginLeft: 1 }}>
                                                        <Image style={{ height: 20, width: 10, resizeMode: 'contain', marginRight: 3 }} source={require('../../assets/images/plus.png')} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                        }
                                        keyExtractor={item => item.id}
                                    />


                                    <View style={{ padding: 10, paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 5 : 10, borderBottomColor: '#d7dada', borderBottomWidth: 1, alignItems: 'center' }}>

                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ flex: 1, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Sub Total</Text>
                                            <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman', paddingBottom: 4 }}>$ {this.state.subTotal}</Text>
                                        </View>

                                        {/* <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ flex: 1, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Service Tax</Text>
                                            <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman', paddingBottom: 4 }}>$ {parseFloat(this.state.serviceTax).toFixed(2)}%</Text>
                                        </View> */}

                                    </View>

                                    <View style={{ padding: 10, paddingTop: 10, paddingBottom: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1, alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5, alignItems: 'center' }}>
                                            <Text style={{ flex: 1, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md', textTransform: 'uppercase', marginTop: Platform.OS === 'ios' ? 8 : 0, }}>Grand Total</Text>
                                            <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md', paddingTop: 4, paddingBottom: 4 }}>$ {this.state.grandTotal}</Text>
                                        </View>
                                    </View>


                                    <View style={{ padding: 10 }}>
                                        <Text style={{ flex: 1, fontSize: 12, color: '#BBBBBB', fontFamily: 'HelveticaNeueLTStd-Md', textTransform: 'uppercase' }}>Payment</Text>

                                        <View style={{ paddingTop: 10, alignItems: 'center', flexDirection: 'row' }}>

                                            <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'column' }} onPress={() => this.onClickCard()}>
                                                <View style={{ width: 100, height: 100, backgroundColor: '#dcdcdc', borderWidth: 2, borderColor: this.state.isChecked == 0 ? '#4CC9CA' : '#dcdcdc', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image style={{ height: 70, width: 70, resizeMode: 'contain' }} source={require('../../assets/images/card_ui.png')} />
                                                </View>
                                                <Text style={{ flex: 1, marginTop: 5, textAlign: 'center', fontSize: 14, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt' }}>Card</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'column', paddingLeft: 10 }} onPress={() => this.onClickPaypal()}>
                                                <View style={{ width: 100, height: 100, backgroundColor: '#dcdcdc', borderWidth: 2, borderColor: this.state.isChecked == 1 ? '#4CC9CA' : '#dcdcdc', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image style={{ height: 70, width: 70, resizeMode: 'contain' }} source={require('../../assets/images/paypal.png')} />
                                                </View>
                                                <Text style={{ flex: 1, marginTop: 5, textAlign: 'center', fontSize: 14, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt' }}>PayPal</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{ paddingTop: 10, paddingBottom: 10, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: 'grey' }}>
                                            <Text style={{ flex: 1, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md' }}>Selected Payment Method</Text>

                                            {this.state.isChecked == 0 ?
                                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                                                        <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../assets/images/card_ui.png')} />
                                                        {this.state.lastFourDigits ? <Text style={{ marginLeft: 5, marginTop: 2, textAlign: 'center', fontSize: 12, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt' }}>{'\u2B24'}{'\u2B24'}{'\u2B24'}{'\u2B24'}  {'\u2B24'}{'\u2B24'}{'\u2B24'}{'\u2B24'}  {'\u2B24'}{'\u2B24'}{'\u2B24'}{'\u2B24'}  {this.state.lastFourDigits}</Text> : null}
                                                    </View>
                                                    <Text onPress={() => this.onPressPament('ProductPayment')} style={{ alignSelf: 'center', marginTop: 5, textAlign: 'center', fontSize: 14, color: '#4CC9CA', fontFamily: 'HelveticaNeueLTStd-Roman' }}>{this.state.lastFourDigits ? 'Change Card' : 'Add Card'}</Text>
                                                </View>
                                                :
                                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                                                        <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../assets/images/card_ui.png')} />
                                                        <Text style={{ marginLeft: 5, marginTop: 2, textAlign: 'center', fontSize: 14, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md' }}>PayPal</Text>
                                                    </View>
                                                </View>}

                                        </View>


                                        <View style={{ paddingTop: 10, paddingBottom: 10, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: 'grey' }}>
                                            <Text style={{ flex: 1, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Delivery Address</Text>

                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                <View style={{ flex: 1, flexDirection: 'row', marginTop: 5, paddingRight: 5, alignItems: 'center' }}>
                                                    <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../assets/images/address.png')} />
                                                    <Text numberOfLines={1} style={{ flex: 1, marginTop: 2, fontSize: 12, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt' }}>{this.state.shippingAddress}</Text>
                                                </View>
                                                <Text onPress={() => this.onPressAddress('AddressScreen')} style={{ marginTop: 5, alignSelf: 'center', fontSize: 14, color: '#4CC9CA', fontFamily: 'HelveticaNeueLTStd-Roman' }}>{this.state.shippingAddress ? 'Change Address' : 'Add Address'}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <TouchableOpacity activeOpacity={1} onPress={() => this.placeOrderCall()} style={{ padding: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', width: '95%', backgroundColor: '#4CC9CA', marginHorizontal: 30 }}>
                                        <Text style={productsStyles.buttonTextStyle}>Place Order</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.pop(2)} style={{ padding: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', width: '95%', backgroundColor: '#4CC9CA', margin: 30, marginTop: 15 }}>
                                        <Text style={productsStyles.buttonTextStyle}>Keep Shopping</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </ScrollView> :

                            <View style={{ width: '100%', height: '92%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md' }}>Your cart is empty</Text>
                            </View>}

                        <Modal
                            isVisible={this.state.modalVisible === 'slow'}
                            animationInTiming={1000}
                            animationOutTiming={1000}
                            backdropTransitionInTiming={800}
                            backdropTransitionOutTiming={800}>

                            <View style={{ height: 'auto', borderRadius: 20, backgroundColor: 'white', alignItems: 'center', marginLeft: 25, marginRight: 25 }}>

                                <Image style={[productsStyles.appIcon, { marginTop: 20, height: 80 }]} source={require('../../assets/images/rounded_checked.png')} />

                                <Text style={[productsStyles.popText, { marginTop: 10 }]} >Congratulations</Text>
                                <Text style={[productsStyles.popText, { fontFamily: 'HelveticaNeueLTStd-Lt', fontSize: 16, textAlign: 'center', marginTop: 5 }]}>Your order has been placed {'\n'} successfully</Text>
                                {global.prevScreenOrder == 'profilescreen' ?
                                    <TouchableOpacity activeOpacity={1} style={[productsStyles.buttonStyle, { width: 250, marginTop: 20, marginBottom: 20 }]}
                                        onPress={() => this.verifyOK('C')}>
                                        <Text style={productsStyles.buttonTextStyle}>Continue to order</Text>
                                    </TouchableOpacity>
                                    : null}
                                <TouchableOpacity activeOpacity={1} style={[productsStyles.buttonStyle, { width: 250, marginBottom: 25, }]}
                                    onPress={() => this.verifyOK('V')}>
                                    <Text style={productsStyles.buttonTextStyle}>View Order</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>


                        <Modal
                            isVisible={this.state.webViewVisible === 'slow'}
                            animationInTiming={1000}
                            animationOutTiming={1000}
                            backdropTransitionInTiming={800}
                            backdropTransitionOutTiming={800}
                            style={{ margin: 0 }}
                            onRequestClose={() => { this.setState({ webViewVisible: false }) }}>

                            <View style={{ height: viewportHeight - 50 }}>

                                <TouchableOpacity activeOpacity={1} onPress={() => this.closeWebModal()}
                                    style={{ position: 'absolute', right: 10, top: 10, zIndex: 99999 }}>
                                    <Image style={{ height: 30, width: 30, borderRadius: 15, backgroundColor: 'white' }} source={require('../../assets/images/cross.png')} />
                                </TouchableOpacity>


                                <View style={{ height: viewportHeight - 50, backgroundColor: 'white' }}>


                                    {this.state.webLoader ?
                                        <View style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                            <ActivityIndicator size="large" color={'#4CC9CA'} />
                                        </View>
                                        :
                                        null
                                    }

                                    <WebView style={{ width: '100%', height: '100%', }}
                                        source={{ uri: 'http://198.211.110.165:3000/paypal?price=' + this.state.grandTotal }}
                                        onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                                        onLoadStart={() => this.setState({ webLoader: true })}
                                        onLoadEnd={() => this.setState({ webLoader: false })}
                                    />

                                </View>
                            </View>
                        </Modal>

                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }
}

