import React, { Component, Fragment } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity, TextInput, Dimensions, ScrollView, FlatList, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import Toasty from '../../elements/Toasty';
import bookingStyle from './bookingStyle'
import { EventRegister } from 'react-native-event-listeners';
import ApiCaller from '../../constants/ApiCaller';
import moment from 'moment';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default class MyBookingScreen extends Component {

    constructor() {
        super()
        this.state = {
            // upcommingList: [{ image: require('../../assets/images/profile_image.png'), name: 'Bowie Salon and Spa', address: '1919 Peaceful Lane, FRUITLAND PARK, Florida USA', day: 'Saturday, 13/6/2020', time: '10:00 AM To 12:00 PM', status: 'Active' }],
            upcommingList: [],
            cardBacColor: '#4CC9CA',
            cardTextColor: 'white',
            payBacColor: '#DCDADA',
            payTextColor: 'black',
            value1: 'Upcomming',
            completedList: [],

            // completedList: [{ image: require('../../assets/images/provider_image.png'), name: 'Bowie Salon and Spa', address: '1919 Peaceful Lane, FRUITLAND PARK, Florida USA', day: 'Saturday, 13/6/2020', time: '9:00 AM To 11:00 PM', status: 'Completed' },
            // { image: require('../../assets/images/portfolio_2.png'), name: 'Magnifique Hair Salon', address: '269 Crossgate Dr, Elmore, AL, 36025', day: 'Saturday, 13/6/2020', time: '11:00 AM To 3:00 PM', status: 'Cancelled' }],

        }
    }



    componentDidMount() {
        this.props.navigation.addListener(
            'willFocus',
            () => {
                this.state.value1 == 'Upcomming' ? this.getActiveBooking() : this.getAllBooking()
            }
        );
    }


    componentWillUnmount() {

    }



    handleTitleInputSubmit = () => {
        this.setState({ focusInput: true });
    }


    componentWillReceiveProps() {
        StatusBar.setBackgroundColor('#ffffff');
        StatusBar.setBarStyle('dark-content');
    }

    Upcomming() {
        this.setState({
            cardBacColor: '#4CC9CA',
            cardTextColor: 'white',
            payBacColor: '#DCDADA',
            payTextColor: 'black',
            value1: 'Upcomming',
        })
        this.getActiveBooking()
    }

    onClickCompleted() {
        this.setState({
            cardBacColor: '#DCDADA',
            cardTextColor: 'black',
            payBacColor: '#4CC9CA',
            payTextColor: 'white',
            value1: 'Completed',
        })
        this.getAllBooking()
    }


    onClickStatus(item) {
        // if (item.booking.status == 1) {
        this.props.navigation.navigate('ActiveDetail', { appointmentID: item.booking.appointment_id })
        // }
        // else if (item.booking.status == 4) {
        //     this.props.navigation.navigate('CompletedDetail', { appointmentID: item.booking.appointment_id })
        // }
        // else {
        //     this.props.navigation.navigate('CancelledDetail', { appointmentID: item.booking.appointment_id })
        // }

    }


    getActiveBooking() {
        EventRegister.emit('loader', true)

        var data = JSON.stringify({
            "day": moment(new Date()).format('YYYY-MM-DD'),
        })

        ApiCaller.call('appointments/upcomingBookingsCustomer', "POST", data, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log(" booking ====>>>>", response)
                    this.setState({ upcommingList: response.upcoming })
                }
            })
            .catch((error) => {
                console.log("Error Active", error);
            })
    }


    getAllBooking() {
        EventRegister.emit('loader', true)
        var data = JSON.stringify({
            "day": moment(new Date()).format('YYYY-MM-DD'),
        })
        ApiCaller.call('appointments/completedBookingsCustomer', "POST", data, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("Completed ====>>>>", response)
                    this.setState({ completedList: response.upcoming })
                }
            })
            .catch((error) => {
                console.log("Error  Completed", error);
            })
    }


    bookingTab() {
        if (this.state.value1 == 'Upcomming') {
            return <View style={{ flex: 1 }}>

                <View style={{ flexDirection: 'column' }}>

                    {this.state.upcommingList.length > 0 ?
                        <FlatList
                            scrollEnabled={false}
                            contentContainerStyle={{ padding: 10, }}
                            data={this.state.upcommingList}
                            refreshing={this.state.refreshing}
                            renderItem={({ item, index }) =>

                                <TouchableOpacity onPress={() => this.onClickStatus(item)} activeOpacity={1} style={{ borderBottomColor: '#d7dada', borderBottomWidth: 1, paddingBottom: 5, paddingTop: 5 }}>

                                    <Text style={bookingStyle.stylishText}>Stylist</Text>

                                    <View style={{ paddingTop: 5, flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                        {item.booking.userDetails.profile_pic_path ? <Image style={bookingStyle.stylishImages} source={{ uri: item.booking.userDetails.profile_pic_path }} />
                                            : <Image style={bookingStyle.stylishImages} source={require('../../assets/images/ic_placeholder.png')} />}
                                        <View style={{ flex: 1, padding: 5 }}>
                                            <Text style={bookingStyle.stylishSalon}>{item.booking.userDetails.first_name ? item.booking.userDetails.first_name + " " + item.booking.userDetails.last_name : item.booking.businessDetails.name}</Text>
                                            <Text numberOfLines={2} style={bookingStyle.stylishAddress}>{item.booking.businessDetails.address}</Text>
                                        </View>
                                        <Image style={bookingStyle.rightArrow} source={require('../../assets/images/right_arrow.png')} />
                                    </View>

                                    <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5 }}>
                                        <View style={{ flex: 0.9 }}>
                                            <Text style={bookingStyle.stylishDateBooking}>Date & Time</Text>
                                            <Text style={bookingStyle.bookingDay}>{moment(item.booking.date_time).format('dddd, DD/MM/YYYY')}</Text>
                                            <Text style={bookingStyle.bookingTime}>{moment(item.booking.starting_from, 'hh:mm A').format('hh:mm A')} To {
                                                moment(item.booking.ending, 'hh:mm A').format('hh:mm A') == moment(item.booking.starting_from, 'hh:mm A').format('hh:mm A') ?
                                                    moment(item.booking.ending, 'hh:mm A').add(1, 'hour').format('hh:mm A') : moment(item.booking.ending, 'hh:mm A').format('hh:mm A')
                                            }</Text>
                                        </View>

                                        <View>
                                            <Text style={bookingStyle.stylishDateBooking}>Booking Status</Text>
                                            <Text style={bookingStyle.bookingStatus}>{item.booking.status == 1 ? 'Active' : null}</Text>
                                        </View>

                                    </View>
                                </TouchableOpacity>
                            }
                            keyExtractor={item => item.id}
                        />

                        :
                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: viewportHeight - 200 }}>
                            <Text style={bookingStyle.stylishSalon}>No data found </Text>
                        </View>
                    }



                </View>
            </View>
        } else {
            return <View style={{ flex: 1 }}>

                <View style={{ flexDirection: 'column' }}>

                    {this.state.completedList.length > 0 ?
                        <FlatList
                            scrollEnabled={false}
                            contentContainerStyle={{ padding: 10, }}
                            data={this.state.completedList}
                            refreshing={this.state.refreshing}
                            renderItem={({ item, index }) =>

                                <TouchableOpacity activeOpacity={1} onPress={() => this.onClickStatus(item)} style={{ borderBottomColor: '#d7dada', borderBottomWidth: 1, paddingBottom: 5, paddingTop: 5 }}>

                                    <Text style={bookingStyle.stylishText}>Stylist</Text>

                                    <View style={{ paddingTop: 5, flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                        {item.booking.userDetails.profile_pic_path ? <Image style={bookingStyle.stylishImages} source={{ uri: item.booking.userDetails.profile_pic_path }} />
                                            : <Image style={bookingStyle.stylishImages} source={require('../../assets/images/ic_placeholder.png')} />}
                                        <View style={{ flex: 1, padding: 5 }}>
                                            <Text style={bookingStyle.stylishSalon}>{item.booking.userDetails.first_name ? item.booking.userDetails.first_name + " " + item.booking.userDetails.last_name : item.booking.businessDetails.name}</Text>
                                            <Text numberOfLines={2} style={bookingStyle.stylishAddress}>{item.booking.businessDetails.address}</Text>
                                        </View>
                                        <Image style={bookingStyle.rightArrow} source={require('../../assets/images/right_arrow.png')} />
                                    </View>

                                    <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5 }}>
                                        <View style={{ flex: 0.9 }}>
                                            <Text style={bookingStyle.stylishDateBooking}>Date & Time</Text>
                                            <Text style={bookingStyle.bookingDay}>{moment(item.booking.date_time).format('dddd, DD/MM/YYYY')}</Text>
                                            <Text style={bookingStyle.bookingTime}>{moment(item.booking.starting_from, 'hh:mm A').format('hh:mm A')} To {
                                                moment(item.booking.ending, 'hh:mm A').format('hh:mm A') == moment(item.booking.starting_from, 'hh:mm A').format('hh:mm A') ?
                                                    moment(item.booking.ending, 'hh:mm A').add(1, 'hour').format('hh:mm A') : moment(item.booking.ending, 'hh:mm A').format('hh:mm A')
                                            }</Text>
                                        </View>

                                        <View>
                                            <Text style={bookingStyle.stylishDateBooking}>Booking Status</Text>
                                            <Text style={{ fontSize: 16, color: item.booking.status == 4 ? '#32ba7c' : 'red', fontFamily: 'HelveticaNeueLTStd-Roman', marginTop: 5, marginBottom: 5 }}>{item.booking.status == 4 ? 'Completed' : 'Cancelled'}</Text>
                                        </View>

                                    </View>
                                </TouchableOpacity>
                            }
                            keyExtractor={item => item.id}
                        />

                        :
                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: viewportHeight - 200 }}>
                            <Text style={bookingStyle.stylishSalon}>No data found </Text>
                        </View>}

                </View>
            </View>
        }


    }


    render() {
        return (
            <Fragment>
                {Platform.OS == 'ios' ? <StatusBar barStyle="dark-content" translucent={true} /> : <StatusBar hidden={false} barStyle="dark-content" backgroundColor="white" translucent={false} />}

                <SafeAreaView style={[bookingStyle.statusColor]} />
                <SafeAreaView style={bookingStyle.bottomColor}>

                    <View style={{ flex: 1 }}>
                        <View style={{ width: '100%', paddingTop: 10, paddingBottom: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ flex: 1, color: 'black', fontSize: 20, textAlign: 'center', fontFamily: 'HelveticaNeueLTStd-Roman', paddingTop: Platform.OS === 'ios' ? 8 : 0, marginRight: 15 }}>My Bookings</Text>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={[{ flex: 1 }]}>
                                <View style={bookingStyle.mainUpCmplt}>
                                    <TouchableOpacity activeOpacity={1} style={[bookingStyle.viewUpcomming, { backgroundColor: this.state.cardBacColor }]} onPress={this.Upcomming.bind(this)}>
                                        <View style={[{ alignItems: 'center' }]}>
                                            <Text style={[{ fontFamily: 'HelveticaNeueLTStd-Roman', color: this.state.cardTextColor, fontSize: 16, paddingTop: Platform.OS === 'ios' ? 8 : 0, }]}>Upcoming</Text>
                                        </View>
                                    </TouchableOpacity>


                                    <TouchableOpacity activeOpacity={1} style={[bookingStyle.viewCompleted, { backgroundColor: this.state.payBacColor }]} onPress={this.onClickCompleted.bind(this)}>
                                        <View style={[{ alignItems: 'center' }]} >
                                            <Text style={[{ fontFamily: 'HelveticaNeueLTStd-Roman', color: this.state.payTextColor, fontSize: 16, paddingTop: Platform.OS === 'ios' ? 8 : 0, }]}>Completed</Text>
                                        </View>
                                    </TouchableOpacity>

                                </View>

                                <View style={{ width: '100%', height: '100%' }}>
                                    {this.bookingTab()}
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }
}

