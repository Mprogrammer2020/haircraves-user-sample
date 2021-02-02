import React, { Component, Fragment } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity, TextInput, ScrollView, FlatList, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import Toasty from '../../elements/Toasty';
import sellerStyle from './sellerStyle'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import CommonHeader from '../../elements/CommonHeader';
import ApiCaller from '../../constants/ApiCaller';
import { EventRegister } from 'react-native-event-listeners';
import moment from 'moment';



export default class PaymentDetailScreen extends Component {

    constructor() {
        super()
        this.state = {
            appointmentDetails: {},
            userDetails: {},
            businessDetails: {},
            serviceList: [],
            subTotal: '',
            grandTotal: '',
            serviceTax: '',
            appointment_id: '',
            providerID: ''
        }
    }



    componentDidMount() {
        const { navigation } = this.props;
        var appointmentID = navigation.getParam('appointmentID');
        this.paymentDetailCall(appointmentID)
        this.props.navigation.addListener(
            'willFocus',
            () => {
                handleAndroidBackButton(() => this.props.navigation.goBack())
            }
        );
    }



    paymentDetailCall(appointmentID) {
        // EventRegister.emit('loader', true)
        ApiCaller.call('appointments/' + appointmentID + '/servicePaymentSummary', "GET", null, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("service response ===>>>>", response)

                    this.setState({
                        appointmentDetails: response.appointmentDetails,
                        userDetails: response.userDetails,
                        businessDetails: response.businessDetails,
                        serviceList: response.services,
                        subTotal: response.subtotal,
                        grandTotal: response.grand_total,
                        serviceTax: response.service_tax,
                        appointment_id: response.appointmentDetails.id,
                        providerID: response.appointmentDetails.provider_id,
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


    callPayment() {
        // this.props.navigation.navigate('PaymentScreen', { grandTotal: 35, appointmentID: 117, providerID: 225 })
        this.props.navigation.navigate('PaymentScreen', { grandTotal: this.state.grandTotal, appointmentID: this.state.appointment_id, providerID: this.state.providerID })
    }


    render() {
        return (
            <Fragment>

                <SafeAreaView style={[sellerStyle.statusColor]} />
                <SafeAreaView style={sellerStyle.bottomColor}>

                    <View>
                        <CommonHeader
                            drawable={require('../../assets/images/back_arrow.png')}
                            action={() => this.props.navigation.goBack()}
                            title='Payment' />

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={[{ flex: 1, padding: 10 }]}>

                                <View style={{ flex: 1, paddingTop: 10, paddingBottom: 10, paddingTop: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1 }}>
                                    <Text style={sellerStyle.sellerText}>Date & Time</Text>
                                    <Text style={sellerStyle.sellerShop}>{moment(this.state.appointmentDetails.date_time).format('dddd, DD/MM/YYYY')}</Text>
                                    <Text style={[sellerStyle.sellerShop, { paddingTop: 0, paddingBottom: 0, fontSize: 12 }]}>{moment(this.state.appointmentDetails.starting_from, 'hh:mm A').format('hh:mm A')} TO {
                                        moment(this.state.appointmentDetails.ending, 'hh:mm A').format('hh:mm A') == moment(this.state.appointmentDetails.starting_from, 'hh:mm A').format('hh:mm A') ?
                                            moment(this.state.appointmentDetails.ending, 'hh:mm A').add(1, 'hour').format('hh:mm A') : moment(this.state.appointmentDetails.ending, 'hh:mm A').format('hh:mm A')
                                    }</Text>
                                </View>

                                <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1, alignItems: 'center' }}>
                                    <View style={{ flex: 1, marginTop: 5, marginBottom: 5 }}>
                                        <Text style={sellerStyle.sellerText}>Stylist</Text>
                                        <Text style={sellerStyle.sellerShop}>{this.state.userDetails.first_name} {this.state.userDetails.last_name}</Text>
                                        <Text numberOfLines={2} style={sellerStyle.sellerAddress}>{this.state.businessDetails.address}</Text>
                                    </View>
                                    {this.state.userDetails.profile_pic_path ? <Image style={{ height: 50, width: 50, borderRadius: 5 }} source={{ uri: this.state.userDetails.profile_pic_path }} />
                                        : <Image style={{ height: 50, width: 50, borderRadius: 5 }} source={require('../../assets/images/ic_placeholder.png')} />}

                                </View>

                                <FlatList
                                    scrollEnabled={false}
                                    contentContainerStyle={{ paddingTop: 10, paddingBottom: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1 }}
                                    data={this.state.serviceList}
                                    refreshing={this.state.refreshing}
                                    renderItem={({ item, index }) =>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                            <View style={{ flex: 1, }}>
                                                <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>{item.serviceName}</Text>
                                                <Text style={{ fontSize: 14, color: 'grey', fontFamily: 'HelveticaNeueLTStd-Roman' }}>{item.time}</Text>
                                            </View>
                                            <Text style={{ paddingTop: 5, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>$ {item.price}</Text>
                                        </View>

                                    }
                                    keyExtractor={item => item.id}
                                />


                                <View style={{ flex: 1, flexDirection: 'row', paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 5 : 10, borderBottomColor: '#d7dada', borderBottomWidth: 1 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Sub Total</Text>
                                        {/* <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Service Tax</Text> */}
                                    </View>

                                    <View>
                                        <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>$ {this.state.subTotal}</Text>
                                        {/* <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>{parseFloat(this.state.serviceTax).toFixed(2)}%</Text> */}
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1 }}>
                                    <Text style={{ flex: 1, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md' }}>Grand Total</Text>
                                    <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md' }}>$ {this.state.grandTotal}</Text>
                                </View>

                                <TouchableOpacity onPress={() => this.callPayment()} activeOpacity={1} style={[sellerStyle.buttonStyle, { marginTop: 50, width: '100%', alignSelf: 'center' }]}>
                                    <Text style={sellerStyle.buttonTextStyle}>Payment</Text>
                                </TouchableOpacity>


                            </View>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }
}

