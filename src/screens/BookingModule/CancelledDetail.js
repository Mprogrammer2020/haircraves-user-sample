import React, { Component, Fragment } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity, TextInput, ScrollView, FlatList, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import Toasty from '../../elements/Toasty';
import bookingStyle from './bookingStyle'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import CommonHeader from '../../elements/CommonHeader';
import { EventRegister } from 'react-native-event-listeners';
import ApiCaller from '../../constants/ApiCaller';
import moment from 'moment';


export default class CancelledDetail extends Component {

    constructor() {
        super()
        this.state = {
            email: '',
            serviceList: [],
            stylistName: '',
            stylistAddress: '',
            bookingDate: '',
            startingTime: '',
            endingTime: '',
            subtotal: '',
            serviceTax: '',
            grandTotal: '',
            stylistPic: '',
            sendAppointmentID: '',
            sendCartID: ''
        }
    }



    componentDidMount() {
        const { navigation } = this.props;
        var appointmentID = navigation.getParam('appointmentID');
        this.getBookingDetail(appointmentID)
        this.props.navigation.addListener(
            'willFocus',
            () => {
                handleAndroidBackButton(() => this.props.navigation.goBack())
            }
        );
    }


    componentWillUnmount() {
        removeAndroidBackButtonHandler();
    }



    handleTitleInputSubmit = () => {
        this.setState({ focusInput: true });
    }


    getBookingDetail(appointmentID) {
        EventRegister.emit('loader', true)
        ApiCaller.call('appointments/' + appointmentID + '/getServiceAppointmentDetails', "GET", null, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("cancelled ====>>>>", response)

                    this.setState({
                        sendCartID: response.appointmentDetails.cart_id,
                        sendAppointmentID: response.appointmentDetails.id,
                        serviceList: response.services,
                        stylistName: response.businessDetails.name,
                        stylistAddress: response.businessDetails.address,
                        bookingDate: response.businessDetails.date_time,
                        startingTime: response.appointmentDetails.starting_from,
                        endingTime: response.appointmentDetails.ending,
                        subtotal: response.subtotal,
                        serviceTax: response.service_tax,
                        grandTotal: response.grand_total,
                        stylistPic: response.userDetails.profile_pic_path
                    })
                }
            })
            .catch((error) => {
                console.log("Error  Completed", error);
            })
    }


    startOver() {
        console.log(this.state.sendAppointmentID)
        console.log(this.state.sendCartID)
        this.props.navigation.navigate('ServiceScreen')
        // this.props.navigation.navigate('RescheduleBooking', { cardID: this.state.sendCartID , appointmentID : this.state.sendAppointmentID})
    }


    render() {
        return (
            <Fragment>

                <SafeAreaView style={[bookingStyle.statusColor]} />
                <SafeAreaView style={bookingStyle.bottomColor}>

                    <View style={{ flex: 1 }}>
                        <CommonHeader
                            drawable={require('../../assets/images/back_arrow.png')}
                            action={() => this.props.navigation.goBack()}
                            title='Details'
                            title1='' />
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={[{ flex: 1, padding: 10 }]}>

                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 1, paddingTop: 10, paddingBottom: 10, paddingTop: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1 }}>
                                        <Text style={bookingStyle.statusText}>Booking ID</Text>
                                        <Text style={bookingStyle.bookingID}>{this.state.sendAppointmentID}</Text>
                                    </View>

                                    <View style={{ paddingRight: 10, paddingBottom: 10, paddingTop: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1 }}>
                                        <Text style={bookingStyle.statusText}>Booking Status</Text>
                                        <Text style={[bookingStyle.detailStatus, { color: 'red' }]}>Cancelled</Text>
                                    </View>

                                </View>

                                <View style={{ flex: 1, paddingTop: 10, paddingBottom: 10, paddingTop: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1 }}>
                                    <Text style={bookingStyle.statusText}>Date & Time</Text>
                                    <Text style={bookingStyle.detailDay}>{moment(this.state.bookingDate).format('dddd, DD/MM/YYYY')}</Text>
                                    {this.state.startingTime ? <Text style={bookingStyle.detailTime}>{moment(this.state.startingTime, 'hh:mm A').format('hh:mm A')} TO {
                                        moment(this.state.endingTime, 'hh:mm A').format('hh:mm A') == moment(this.state.startingTime, 'hh:mm A').format('hh:mm A') ?
                                            moment(this.state.endingTime, 'hh:mm A').add(1, 'hour').format('hh:mm A') : moment(this.state.endingTime, 'hh:mm A').format('hh:mm A')
                                    }</Text> : null}
                                </View>

                                <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1, alignItems: 'center' }}>
                                    <View style={{ flex: 1, marginTop: 5, marginBottom: 5 }}>
                                        <Text style={bookingStyle.statusText}>Stylist</Text>
                                        <Text style={bookingStyle.detailSalonName}>{this.state.stylistName}</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Image style={bookingStyle.locationImages} source={require('../../assets/images/location_black.png')} />
                                            <Text numberOfLines={2} style={bookingStyle.detailSalonAddress}>{this.state.stylistAddress}</Text>
                                        </View>
                                    </View>
                                    {this.state.stylistPic ? <Image style={bookingStyle.detailSellerImages} source={{ uri: this.state.stylistPic }} />
                                        : <Image style={bookingStyle.detailSellerImages} source={require('../../assets/images/ic_placeholder.png')} />}
                                </View>


                                <Text style={[bookingStyle.statusText, { paddingTop: 10 }]}>Services</Text>

                                <FlatList
                                    scrollEnabled={false}
                                    contentContainerStyle={{ paddingTop: 10, paddingBottom: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1 }}
                                    data={this.state.serviceList}
                                    refreshing={this.state.refreshing}
                                    renderItem={({ item, index }) =>
                                        <View style={{ flexDirection: 'row', flex: 1 }}>
                                            <View style={{ flex: 1, }}>
                                                <Text style={bookingStyle.detailService}>{item.serviceName}</Text>
                                                <Text style={bookingStyle.detailServiceTime}>{item.time}</Text>
                                            </View>
                                            <Text style={bookingStyle.detailServicePrice}>$ {item.price}</Text>
                                        </View>

                                    }
                                    keyExtractor={item => item.id}
                                />

                                <View style={{ flex: 1, flexDirection: 'row', paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 0 : 10, borderBottomColor: '#d7dada', borderBottomWidth: 1 }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={bookingStyle.detailServiceTax}>Sub Total</Text>
                                        <Text style={bookingStyle.detailServiceTax}>Service Tax</Text>
                                    </View>

                                    <View>
                                        <Text style={bookingStyle.detailServiceTax}>$ {this.state.subtotal}</Text>
                                        <Text style={bookingStyle.detailServiceTax}>  {parseFloat(this.state.serviceTax).toFixed(2)}%</Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', paddingTop: Platform.OS === 'ios' ? 15 : 10, paddingBottom: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1 }}>
                                    <Text style={[bookingStyle.detaiGrand, { flex: 1 }]}>Grand Total</Text>
                                    <Text style={bookingStyle.detaiGrand}>$ {this.state.grandTotal}</Text>
                                </View>


                                {/* 
                                <View style={{ flex: 1,  paddingBottom: 10, paddingTop: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1 }}>
                                    <Text style={[bookingStyle.statusText, { fontSize: 11, }]}>Cancellation Reason</Text>
                                    <Text style={bookingStyle.reasonText}>Got some urgent work</Text>
                                </View> */}

                                {/* <TouchableOpacity activeOpacity={1} style={[bookingStyle.buttonView, { marginTop: 30, }]} onPress={() => this.rescheduleCall()}>
                                    <Text style={bookingStyle.buttonTextStyle}>Reschedule Booking</Text>
                                </TouchableOpacity> */}

                                <Text style={[bookingStyle.startOver, { marginTop: 30, }]} onPress={() => this.startOver()}>Start Over</Text>


                            </View>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }
}

