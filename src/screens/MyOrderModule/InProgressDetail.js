import React, { Component, Fragment } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity, TextInput, ScrollView, FlatList, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import Toasty from '../../elements/Toasty';
import orderStyle from './orderStyle'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import CommonHeader from '../../elements/CommonHeader';
import { or } from 'react-native-reanimated';
import { EventRegister } from 'react-native-event-listeners';
import ApiCaller from '../../constants/ApiCaller';
import NavigationService from '../../routes/NavigationService';



export default class InProgressDetail extends Component {

    constructor() {
        super()
        this.state = {

            sellerFirstName: '',
            sellerLastName: '',
            serviceName: '',
            serviceDes: '',
            servicePrice: '',
            serviceImage: '',
            shippingAddress: '',
            orderDateTime: '',
            orderStatus: 0,
            sellerAddress: '',
            serviceQuantity: 1,
            deliveryCharges: '',
            grandTotal: '',
            subtotal: '',
            trackerID: '',
            sellerID: '',
            sellerImage: '',
            businessName: ''

        }
    }



    componentDidMount() {
        this.props.navigation.addListener(
            'willFocus',
            () => {
                const { navigation } = this.props;
                var orderID = navigation.getParam('orderID');
                this.getOrderDetal(orderID)
                handleAndroidBackButton(() => this.props.navigation.goBack())
            }
        );
    }


    getOrderDetal(orderID) {
        EventRegister.emit('loader', true)
        ApiCaller.call('appointments/' + orderID + '/orders', "GET", null, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("my order ===>>>> ", response)

                    // console.log("my order ===>>>> ", response.appointmentDetails.shipping_address)

                    this.setState({
                        sellerID: response.userDetails.id,
                        sellerImage: response.userDetails.profile_pic_path,
                        sellerFirstName: response.userDetails.first_name,
                        sellerLastName: response.userDetails.last_name,
                        serviceName: response.products[0].productName,
                        serviceDes: response.products[0].productDescription,
                        servicePrice: response.products[0].price,
                        serviceImage: response.products[0].images[0].image_path,
                        shippingAddress: response.appointmentDetails.Shipping_address,
                        orderDateTime: response.appointmentDetails.date_time,
                        orderStatus: response.appointmentDetails.status,
                        sellerAddress: response.businessDetails.address,
                        serviceQuantity: response.products[0].quantity,
                        deliveryCharges: response.delivery_charges,
                        grandTotal: response.grand_total,
                        subtotal: response.subtotal,
                        trackerID: response.appointmentDetails.id,
                        businessName: response.businessDetails.name,
                    })


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


    startChat() {
        if (this.state.sellerID.length == 0) {
            Toasty.show('Somthing went wrong.')
        }
        else {
            let sellerData = {
                name: this.state.sellerFirstName ? this.state.sellerFirstName + ' ' + this.state.sellerLastName : this.state.businessName,
                id: this.state.sellerID,
                image: this.state.sellerImage,
            }
            // NavigationService.navigate('SingleChat', { providerID: this.state.sellerID})
            this.props.navigation.navigate('SingleChat', { sellerDetail: sellerData, })
        }

    }


    render() {
        return (
            <Fragment>
                {Platform.OS == 'ios' ? <StatusBar barStyle="dark-content" translucent={true} /> : <StatusBar hidden={false} barStyle="dark-content" backgroundColor="white" translucent={false} />}

                <SafeAreaView style={[orderStyle.statusColor]} />
                <SafeAreaView style={orderStyle.bottomColor}>


                    <View style={{ flex: 1 }}>
                        <CommonHeader
                            drawable={require('../../assets/images/back_arrow.png')}
                            action={() => this.props.navigation.goBack()}
                            title='Details'
                            title1='' />
                        <ScrollView showsVerticalScrollIndicator={false}>

                            <View style={{ flex: 1, width: '100%', height: '100%', marginBottom: 20 }}>
                                <Text style={{ width: '100%', backgroundColor: 'black', color: 'white', alignItems: 'center', textAlign: 'center', padding: 10, paddingTop: Platform.OS == 'ios' ? 15 : 10, fontSize: 16, fontFamily: 'HelveticaNeueLTStd-Md' }}>Order ID: #{this.state.trackerID}</Text>
                                <View style={[{ flex: 1 }]}>
                                    <View style={{ padding: 10, flexDirection: 'row', paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#d7dada' }}>
                                        <View style={{ flex: 0.4, height: 2 }}></View>

                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <View style={{}}>
                                                <View style={[orderStyle.orderView, { backgroundColor: this.state.orderStatus == 0 || this.state.orderStatus > 0 ? '#32ba7c' : '#dcdcdc' }]}>
                                                    <Text style={orderStyle.orderNumber}>1</Text>
                                                </View>
                                                <Text style={[orderStyle.orderStatusText, { color: this.state.orderStatus == 0 || this.state.orderStatus > 0 ? '#32ba7c' : 'black' }]}>Packed</Text>
                                            </View>
                                            <View style={{ flex: 1, height: 2, backgroundColor: this.state.orderStatus == 1 ? '#32ba7c' : '#dcdcdc', justifyContent: 'center', marginBottom: 20, width: 20 }}></View>
                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{}}>
                                                <View style={[orderStyle.orderView, { backgroundColor: this.state.orderStatus == 1 || this.state.orderStatus > 1 ? '#32ba7c' : '#dcdcdc' }]}>
                                                    <Text style={orderStyle.orderNumber}>2</Text>
                                                </View>
                                                <Text style={[orderStyle.orderStatusText, { color: this.state.orderStatus == 1 || this.state.orderStatus > 1 ? '#32ba7c' : 'black' }]}>Shipped</Text>
                                            </View>
                                            <View style={{ flex: 1, height: 2, backgroundColor: this.state.orderStatus == 2 ? '#32ba7c' : '#dcdcdc', justifyContent: 'center', marginBottom: 20, width: 20 }}></View>
                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                                <View style={[orderStyle.orderView, { backgroundColor: this.state.orderStatus == 2 || this.state.orderStatus > 2 ? '#32ba7c' : '#dcdcdc' }]}>
                                                    <Text style={orderStyle.orderNumber}>3</Text>
                                                </View>
                                                <Text style={[orderStyle.orderStatusText, { color: this.state.orderStatus == 2 || this.state.orderStatus > 2 ? '#32ba7c' : 'black' }]}>On the way</Text>
                                            </View>
                                            <View style={{ flex: 1, height: 2, backgroundColor: this.state.orderStatus == 3 ? '#32ba7c' : '#dcdcdc', width: 20, justifyContent: 'center', marginBottom: 20 }}></View>
                                        </View>


                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                                <View style={[orderStyle.orderView, { backgroundColor: this.state.orderStatus == 3 ? '#32ba7c' : '#dcdcdc' }]}>
                                                    <Text style={orderStyle.orderNumber}>4</Text>
                                                </View>
                                                <Text style={[orderStyle.orderStatusText, { color: this.state.orderStatus == 3 ? '#32ba7c' : 'black' }]}>Delivered</Text>
                                            </View>
                                        </View>

                                        <View style={{ flex: 0.2, height: 2 }}></View>

                                    </View>

                                    <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', borderBottomColor: '#d7dada', borderBottomWidth: 1, paddingTop: 10, paddingBottom: 10 }}>
                                        <View style={{ flex: 1, padding: 10, }}>
                                            <Text style={orderStyle.orderService}>{this.state.serviceName}</Text>
                                            <Text style={orderStyle.orderDes}>{this.state.serviceDes}</Text>
                                            <Text style={orderStyle.orderPrice}>$ {this.state.servicePrice}</Text>
                                        </View>
                                        {this.state.serviceImage ? <Image style={orderStyle.orderImage} source={{ uri: this.state.serviceImage }} />
                                            : <Image style={orderStyle.orderImage} source={require('../../assets/images/ic_placeholder.png')} />}
                                    </TouchableOpacity>


                                    <View style={orderStyle.viewSellerAdress}>
                                        <View style={{ flex: 0.8, marginTop: 5, marginBottom: 5 }}>
                                            <Text style={orderStyle.sellerText}>Seller</Text>
                                            <Text style={[orderStyle.sellerShop]}>{this.state.sellerFirstName ? this.state.sellerFirstName + " " + this.state.sellerLastName : this.state.businessName}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image style={{ height: 20, width: 20, borderRadius: 5 }} source={require('../../assets/images/location_black.png')} />
                                                <Text numberOfLines={2} style={[orderStyle.sellerAddress, { paddingTop: 0 }]}>{this.state.sellerAddress}</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity activeOpacity={1} style={{ flex: 0.2, alignItems: 'center' }} onPress={() => this.startChat()}>
                                            <Image style={{ height: 50, width: 50 }} source={require('../../assets/images/chat.png')} />
                                            <Text style={orderStyle.sellerAddress}>Chat</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{ flexDirection: 'row', padding: 10, paddingTop: 10, paddingBottom: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1, alignItems: 'center' }}>
                                        <View style={{ flex: 1, marginTop: 5, marginBottom: 5 }}>
                                            <Text style={orderStyle.sellerText}>Shipping Address</Text>
                                            <Text style={orderStyle.sellerAddress}>{this.state.shippingAddress}</Text>
                                        </View>

                                    </View>


                                    <Text style={{ paddingLeft: 10, paddingRight: 10, fontSize: 12, color: '#BBBBBB', fontFamily: 'HelveticaNeueLTStd-Md', paddingTop: 10, textTransform: 'uppercase' }}>Services</Text>

                                    <View style={{ padding: 10, flexDirection: 'row', flex: 1, paddingTop: 10, paddingBottom: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1 }}>
                                        <View style={{ flex: 1, }}>
                                            <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>{this.state.serviceName}</Text>
                                            <Text style={{ fontSize: 12, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman', paddingTop: 5, paddingBottom: 5 }}>Qty: {this.state.serviceQuantity}</Text>
                                        </View>
                                        <Text style={{ paddingTop: 5, fontSize: 14, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>$ {this.state.servicePrice}</Text>
                                    </View>


                                    <View style={{ padding: 10, flex: 1, flexDirection: 'row', paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 5 : 10, borderBottomColor: '#d7dada', borderBottomWidth: 1 }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={orderStyle.serviceText}>Sub Total</Text>
                                            <Text style={[orderStyle.serviceText, { paddingTop: 5, paddingBottom: 5 }]}>Delivery Charges</Text>
                                        </View>

                                        <View>
                                            <Text style={orderStyle.serviceText}>$ {this.state.subtotal}</Text>
                                            <Text style={orderStyle.serviceText}>$ {this.state.deliveryCharges}</Text>
                                        </View>
                                    </View>

                                    <View style={orderStyle.grandTotalView}>
                                        <Text style={orderStyle.grandTotalText}>Grand Total</Text>
                                        <Text style={orderStyle.grandPrice}>$ {this.state.grandTotal}</Text>
                                    </View>

                                </View>

                            </View>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }
}

