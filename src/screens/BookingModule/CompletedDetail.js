import React, { Component, Fragment } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity, TextInput, ScrollView, FlatList, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView, Keyboard } from 'react-native';
import Toasty from '../../elements/Toasty';
import bookingStyle from './bookingStyle'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import CommonHeader from '../../elements/CommonHeader';
import Modal from 'react-native-modal';
import StarRating from 'react-native-star-rating';
import { EventRegister } from 'react-native-event-listeners';
import ApiCaller from '../../constants/ApiCaller';
import moment from 'moment';


export default class CompletedDetail extends Component {

    constructor() {
        super()
        this.state = {
            email: '',
            modalVisible: false,
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
            businessID: '',
            reviewRating: 0,
            ratingMessage: '',
            sendAppointmentID: '',
            ratingData: {}
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
                    console.log("Completed ====>>>>", response)

                    this.setState({
                        sendAppointmentID: response.appointmentDetails.id,
                        businessID: response.appointmentDetails.business_id,
                        serviceList: response.services,
                        stylistName: response.businessDetails.name,
                        stylistAddress: response.businessDetails.address,
                        bookingDate: response.businessDetails.date_time,
                        startingTime: response.appointmentDetails.starting_from,
                        endingTime: response.appointmentDetails.ending,
                        subtotal: response.subtotal,
                        serviceTax: response.service_tax,
                        grandTotal: response.grand_total,
                        stylistPic: response.userDetails.profile_pic_path,
                        ratingData: response.rating
                    })
                }
            })
            .catch((error) => {
                EventRegister.emit('loader', false)
                console.log("Error  Completed", error);
            })
    }


    giveRating() {
        this.setState({ modalVisible: 'slow' });
    }

    closeModal() {
        this.setState({ modalVisible: false });
    }


    verifySubmit() {
        Keyboard.dismiss()
        if (this.state.reviewRating == 0) {
            Toasty.show('Please add rating')
        } else if (this.state.ratingMessage == '' || this.state.ratingMessage.length == 0) {
            Toasty.show('Please add a review')
        }
        else {
            var data = JSON.stringify({
                'business_id': this.state.businessID,
                'appointment_id': this.state.sendAppointmentID,
                'star': this.state.reviewRating,
                'review': this.state.ratingMessage,
            })

            console.log(data)
            ApiCaller.call('appointments/addReview', "POST", data, true)
                .then((response) => {
                    console.log(response)

                    if (response) {
                        this.setState({ modalVisible: false, showAddReview: false, ratingData: response.review });

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
                                        <Text style={[bookingStyle.detailStatus, { color: '#32ba7c' }]}>Completed</Text>
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

                                <View style={{ flex: 1, flexDirection: 'row', paddingBottom: Platform.OS === 'ios' ? 0 : 10, paddingTop: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1 }}>
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

                                {this.state.ratingData || this.state.ratingData != null ?

                                    <View style={{ flexDirection: 'column', marginTop: 30, paddingBottom: 10 }}>
                                        {this.state.ratingData.star ? <Text style={[bookingStyle.statusText, { flex: 1 }]}>Rating</Text> : null}

                                        {this.state.ratingData.star ? <StarRating
                                            containerStyle={{ paddingTop: 5, paddingBottom: 5, justifyContent: 'flex-start' }}
                                            disabled={false}
                                            starSize={20}
                                            activeOpacity={1}
                                            emptyStarColor={'#ED8A19'}
                                            fullStarColor={'#ED8A19'}
                                            rating={this.state.ratingData.star}
                                        /> : null}

                                        <Text style={bookingStyle.detaiGrand}>{this.state.ratingData.review}</Text>
                                    </View>

                                    :

                                    <TouchableOpacity activeOpacity={1} style={[bookingStyle.buttonView, { marginTop: 50 }]} onPress={() => this.giveRating()} >
                                        <Text style={bookingStyle.buttonTextStyle}>Give Rating</Text>
                                    </TouchableOpacity>
                                }



                            </View>
                        </ScrollView>
                    </View>
                    <Modal
                        isVisible={this.state.modalVisible === 'slow'}
                        animationInTiming={1000}
                        animationOutTiming={1000}
                        backdropTransitionInTiming={800}
                        backdropTransitionOutTiming={800}>

                        <View style={{ height: 'auto', borderRadius: 20, backgroundColor: 'white', alignItems: 'center', marginLeft: 10, marginRight: 10 }}>

                            <TouchableOpacity activeOpacity={1} onPress={() => this.closeModal()}
                                style={{ position: 'absolute', right: 15, top: 15 }}>
                                <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={require('../../assets/images/cross.png')} />
                            </TouchableOpacity>


                            <Text style={[bookingStyle.popText, { marginTop: 40, fontFamily: 'HelveticaNeueLTStd-Md', }]} >Classic Gentle Barbershop</Text>
                            <Text style={[bookingStyle.everything]}>How was everything ?</Text>

                            <StarRating
                                containerStyle={{ width: 50, paddingTop: 5, justifyContent: 'center' }}
                                starStyle={{ paddingRight: 5 }}
                                disabled={false}
                                starSize={30}
                                emptyStarColor={'#ED8A19'}
                                fullStarColor={'#ED8A19'}
                                rating={this.state.reviewRating}
                                selectedStar={(reviewRating) => this.onReviewRating(reviewRating)}
                            />


                            <View style={[bookingStyle.editView, { marginTop: 10, paddingLeft: 20, paddingRight: 20 }]}>
                                <Text style={{ fontSize: 12, color: 'grey', fontFamily: 'HelveticaNeueLTStd-Md', textTransform: 'uppercase' }}>Message</Text>
                                <TextInput
                                    style={[bookingStyle.inputStyle, { height: 110, textAlignVertical: 'top', borderBottomColor: '#d9d9d9', borderBottomWidth: 1, }]}
                                    placeholder="Enter Message"
                                    keyboardType="default"
                                    fontSize={18}
                                    maxLength={150}
                                    multiline={true}
                                    blurOnSubmit={true}
                                    placeholderTextColor='black'
                                    onChangeText={(ratingMessage) => this.setState({ ratingMessage: !this.state.ratingMessage ? ratingMessage.replace(/\s/g, '') : ratingMessage })}
                                    returnKeyType='done'
                                    // onSubmitEditing={() => this.service.focus()}
                                    value={this.state.ratingMessage} />
                            </View>

                            <TouchableOpacity activeOpacity={1} style={[bookingStyle.buttonStyle, { width: 250, marginTop: 15, marginBottom: 25 }]}
                                onPress={() => this.verifySubmit()}>
                                <Text style={bookingStyle.buttonTextStyle}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </SafeAreaView>
            </Fragment>
        )
    }
}

