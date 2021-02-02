import React, { Component, Fragment } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity, TextInput, ScrollView, FlatList, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import Toasty from '../../elements/Toasty';
import orderStyle from './orderStyle'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import CommonHeader from '../../elements/CommonHeader';
import Modal from 'react-native-modal';
import StarRating from 'react-native-star-rating';
import { EventRegister } from 'react-native-event-listeners';
import ApiCaller from '../../constants/ApiCaller';
import { Themed } from 'react-navigation';
import moment from 'moment';




export default class DeliveredDetail extends Component {

    constructor() {
        super()
        this.state = {
            email: '',
            modalVisible: false,
            reviewRating: 0,
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
            businessID: '',
            showAddReview: true,
            businessName: '',

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
                    console.log("response", JSON.stringify(response))
                    this.setState({
                        sellerFirstName: response.userDetails.first_name,
                        sellerLastName: response.userDetails.last_name,
                        serviceName: response.products[0].productName,
                        serviceDes: response.products[0].productDescription,
                        servicePrice: response.products[0].price,
                        serviceImage: response.products[0].images[0].image_path,
                        shippingAddress: response.appointmentDetails.Shipping_address,
                        orderDateTime: response.appointmentDetails.updated_at,
                        sellerAddress: response.businessDetails.address,
                        serviceQuantity: response.products[0].quantity,
                        deliveryCharges: response.delivery_charges,
                        grandTotal: response.grand_total,
                        subtotal: response.subtotal,
                        serviceTax: response.service_tax,
                        trackerID: response.appointmentDetails.id,
                        businessID: response.appointmentDetails.business_id,
                        businessName: response.businessDetails.name,
                        orderStatus: response.appointmentDetails.status,
                        showAddReview: response.appointmentDetails.status == 3 && response.rating == null
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

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    giveRating() {
        this.setState({ modalVisible: 'slow' });
    }

    closeModal() {
        this.setState({ modalVisible: false });
    }

    verifySubmit() {
        if (this.state.reviewRating == 0) {
            Toasty.show('Please add rating')
        } else {
            var data = JSON.stringify({
                'appointment_id': this.state.trackerID,
                'business_id': this.state.businessID,
                'star': this.state.reviewRating,
            })

            console.log(data)
            ApiCaller.call('appointments/addReview', "POST", data, true)
                .then((response) => {
                    console.log(response)
                    if (response) {
                        this.setState({ modalVisible: false, showAddReview: false });
                    }
                })
                .catch((error) => {
                    console.log("Error Appointment ==>>", error);
                })
        }
    }

    onReviewRating(rating) {
        this.setState({
            reviewRating: rating
        });
    }


    render() {
        return (
            <Fragment>
                {Platform.OS == 'ios' ? <StatusBar barStyle="dark-content" translucent={true} /> : <StatusBar hidden={false} barStyle="dark-content" backgroundColor="white" translucent={false} />}

                <SafeAreaView style={[orderStyle.statusColor]} />
                <SafeAreaView style={orderStyle.bottomColor}>


                    <View>
                        <CommonHeader
                            drawable={require('../../assets/images/back_arrow.png')}
                            action={() => this.props.navigation.goBack()}
                            title='Details'
                            title1='' />
                        <ScrollView showsVerticalScrollIndicator={false}>

                            <View style={{ marginBottom: 30 }}>
                                <Text style={{ width: '100%', backgroundColor: 'black', height: 'auto', color: 'white', alignItems: 'center', textAlign: 'center', padding: 10, fontSize: 16, fontFamily: 'HelveticaNeueLTStd-Md', paddingTop: Platform.OS == 'ios' ? 15 : 10 }}>Order ID: #{this.state.trackerID}</Text>
                                <View style={[{ flex: 1 }]}>
                                    <View style={{ padding: 10, flexDirection: 'row', paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#d7dada' }}>
                                        <View style={{ flex: 0.2, height: 2 }}></View>

                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <View style={{}}>
                                                <View style={[orderStyle.orderView, { backgroundColor: this.state.orderStatus == 0 || this.state.orderStatus > 0 ? '#32ba7c' : '#dcdcdc' }]}>
                                                    <Text style={orderStyle.orderNumber}>1</Text>
                                                </View>
                                                <Text style={[orderStyle.orderStatusText, { color: this.state.orderStatus == 0 || this.state.orderStatus > 0 ? '#32ba7c' : 'black' }]}>Packed</Text>
                                            </View>
                                            <View style={{ flex: 1, height: 2, backgroundColor: this.state.orderStatus >= 1 ? '#32ba7c' : '#dcdcdc', justifyContent: 'center', marginBottom: 20, width: 20 }}></View>
                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{}}>
                                                <View style={[orderStyle.orderView, { backgroundColor: this.state.orderStatus == 1 || this.state.orderStatus > 1 ? '#32ba7c' : '#dcdcdc' }]}>
                                                    <Text style={orderStyle.orderNumber}>2</Text>
                                                </View>
                                                <Text style={[orderStyle.orderStatusText, { color: this.state.orderStatus == 1 || this.state.orderStatus > 1 ? '#32ba7c' : 'black' }]}>Shipped</Text>
                                            </View>
                                            <View style={{ flex: 1, height: 2, backgroundColor: this.state.orderStatus >= 2 ? '#32ba7c' : '#dcdcdc', justifyContent: 'center', marginBottom: 20, width: 20 }}></View>
                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                                <View style={[orderStyle.orderView, { backgroundColor: this.state.orderStatus == 2 || this.state.orderStatus > 2 ? '#32ba7c' : '#dcdcdc' }]}>
                                                    <Text style={orderStyle.orderNumber}>3</Text>
                                                </View>
                                                <Text style={[orderStyle.orderStatusText, { color: this.state.orderStatus == 2 || this.state.orderStatus > 2 ? '#32ba7c' : 'black' }]}>On the way</Text>
                                            </View>
                                            <View style={{ flex: 1, height: 2, backgroundColor: this.state.orderStatus >= 3 ? '#32ba7c' : '#dcdcdc', width: 20, justifyContent: 'center', marginBottom: 20 }}></View>
                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ alignItems: 'center', justifyContent: "center" }}>
                                                <View style={[orderStyle.orderView, { backgroundColor: this.state.orderStatus == 3 ? '#32ba7c' : '#dcdcdc' }]}>
                                                    <Text style={orderStyle.orderNumber}>4</Text>
                                                </View>
                                                <Text style={[orderStyle.orderStatusText, { color: this.state.orderStatus == 3 ? '#32ba7c' : 'black' }]}>Delivered</Text>
                                            </View>
                                        </View>

                                        <View style={{ flex: 0.1, height: 2 }}></View>

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

                                    <View style={{ padding: 10, flex: 1, paddingTop: 10, paddingBottom: 10, paddingTop: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1 }}>
                                        <Text style={orderStyle.sellerText}>Delivery Date & Time</Text>
                                        <Text style={orderStyle.sellerShop}>{moment(this.state.orderDateTime).format('dddd, DD/MM/YYYY')}</Text>
                                        <Text style={[orderStyle.sellerShop, { paddingTop: 0, paddingBottom: 0, fontSize: 14 }]}>{moment(this.state.orderDateTime).format('hh:mm A')}</Text>
                                    </View>

                                    <View style={orderStyle.viewSellerAdress}>
                                        <View style={{ flex: 1, marginTop: 5, marginBottom: 5 }}>
                                            <Text style={orderStyle.sellerText}>Seller</Text>
                                            <Text style={[orderStyle.sellerShop]}>{this.state.sellerFirstName ? this.state.sellerFirstName + " " + this.state.sellerLastName : this.state.businessName}</Text>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Image style={{ height: 20, width: 20, borderRadius: 5 }} source={require('../../assets/images/location_black.png')} />
                                                <Text numberOfLines={2} style={orderStyle.sellerAddress}>{this.state.sellerAddress}</Text>
                                            </View>
                                        </View>
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
                                            {/* <Text style={[orderStyle.serviceText]}>Service Tax</Text> */}
                                            <Text style={[orderStyle.serviceText, { paddingBottom: 5 }]}>Delivery Charges</Text>
                                        </View>

                                        <View style={{ alignItems: 'flex-end' }}>
                                            <Text style={orderStyle.serviceText}>$ {parseFloat(this.state.subtotal).toFixed(2)}</Text>
                                            {/* <Text style={orderStyle.serviceText}>  {this.state.serviceTax}%</Text> */}
                                            <Text style={orderStyle.serviceText}>$ {this.state.deliveryCharges}</Text>
                                        </View>
                                    </View>

                                    <View style={[orderStyle.grandTotalView, { marginBottom: this.state.showAddReview ? 10 : 30 }]}>
                                        <Text style={orderStyle.grandTotalText}>Grand Total</Text>
                                        <Text style={orderStyle.grandPrice}>$ {parseFloat(this.state.grandTotal).toFixed(2)}</Text>
                                    </View>

                                    {this.state.showAddReview ? <TouchableOpacity activeOpacity={1} onPress={() => this.giveRating()} style={{ padding: 15, marginLeft: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', width: '90%', borderRadius: 50, backgroundColor: '#4CC9CA', marginTop: 30, marginBottom: 30 }}>
                                        <Text style={orderStyle.buttonTextStyle}>Give Rating</Text>
                                    </TouchableOpacity> : null}


                                </View>

                            </View>
                        </ScrollView>
                        <Modal
                            isVisible={this.state.modalVisible === 'slow'}
                            animationInTiming={1000}
                            animationOutTiming={1000}
                            backdropTransitionInTiming={800}
                            backdropTransitionOutTiming={800}>

                            <View style={{ height: 'auto', borderRadius: 20, backgroundColor: 'white', alignItems: 'center', marginLeft: 10, marginRight: 10 }}>

                                <TouchableOpacity activeOpacity={1} onPress={() => this.closeModal()}
                                    style={{ position: 'absolute', right: 15, top: 15 }}>
                                    <Image style={{ height: 18, width: 18, resizeMode: 'contain' }} source={require('../../assets/images/cross.png')} />
                                </TouchableOpacity>


                                <Text style={[orderStyle.popText, { marginTop: 50 }]} >{this.state.sellerFirstName ? this.state.sellerFirstName + " " + this.state.sellerLastName : this.state.businessName}</Text>
                                <Text style={orderStyle.pophow}>How was everything?</Text>



                                <StarRating
                                    containerStyle={{ width: 50, paddingTop: 10, justifyContent: 'center' }}
                                    starStyle={{ paddingRight: 5 }}
                                    disabled={false}
                                    starSize={30}
                                    emptyStarColor={'#ED8A19'}
                                    fullStarColor={'#ED8A19'}
                                    rating={this.state.reviewRating}
                                    selectedStar={(reviewRating) => this.onReviewRating(reviewRating)}
                                />

                                <TouchableOpacity activeOpacity={1} style={[orderStyle.buttonStyle, { width: 250, marginTop: 10, marginBottom: 25 }]}
                                    onPress={() => this.verifySubmit()}>
                                    <Text style={orderStyle.buttonTextStyle}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }
}

