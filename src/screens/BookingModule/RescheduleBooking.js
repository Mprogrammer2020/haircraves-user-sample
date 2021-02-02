import React, { Component, Fragment } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity, TextInput, ScrollView, FlatList, BackHandler, SafeAreaView, Alert, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import Toasty from '../../elements/Toasty';
import CommonHeader from '../../elements/CommonHeader';
import sellerStyle from './bookingStyle'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import { Calendar, CalendarList, Agenda, LocaleConfig } from 'react-native-calendars';
import { EventRegister } from 'react-native-event-listeners';
import ApiCaller from '../../constants/ApiCaller';
import moment from 'moment';




export default class RescheduleBooking extends Component {

    constructor() {
        super()
        this.state = {
            currentDay: new Date(),
            cardList: [{ paymentSelect: require('../../assets/images/unchecked.png'), cardNumber: '9872', cardType: 'Mastercard', expiryDate: '17/23' },
            { paymentSelect: require('../../assets/images/unchecked.png'), cardNumber: '6582', cardType: 'Mastercard', expiryDate: '17/23' },
            { paymentSelect: require('../../assets/images/unchecked.png'), cardNumber: '6582', cardType: 'Mastercard', expiryDate: '17/23' }],

            // timingList: [{ timing: '09', status: 'unselected', id: 1 },
            // { timing: '10', status: 'unselected', id: 2 },
            // { timing: '11', status: 'unselected', id: 3 },
            // { timing: '12', status: 'unselected', id: 4 },
            // { timing: '13', status: 'unselected', id: 5 },
            // { timing: '14', status: 'unselected', id: 6 },
            // { timing: '15', status: 'unselected', id: 7 },
            // { timing: '16', status: 'unselected', id: 8 },
            // { timing: '17', status: 'unselected', id: 9 },
            // { timing: '18', status: 'unselected', id: 10 },],

            // serviceList: [{ serviceName: 'Facial & cleanup', time: '1 hr', price: '60.00', deleteIcon: require('../../assets/images/delete_black.png'), },
            // { serviceName: 'Detanning', time: '1 hr', price: '99.00', deleteIcon: require('../../assets/images/delete_black.png'), }]
            timingList: [],
            serviceList: [],
            sendCardID: '',
            sendBusinessID: '',
            grandTotal: '',
            serviceTax: '',
            subTotal: '',
            showTimingList: [],
            selectedTiming: [],
            selectedTime: [],
            bookedList: [],
            slotSize: 0,


        }
    }




    componentDidMount() {
        const { navigation } = this.props;
        var cardID = navigation.getParam('cardID');
        var appointmentID = navigation.getParam('appointmentID');

        this.setState({ sendCardID: cardID , sendAppointmentID : appointmentID })

        this.getAppointmentCall(cardID, '')
        this.props.navigation.addListener(
            'willFocus',
            () => {
                handleAndroidBackButton(() => this.props.navigation.goBack())
            }
        );
    }



    getAppointmentCall(cardID, date) {
        var data = JSON.stringify({
            'cart_id': cardID,
            'date': date ? date : moment(new Date(), 'hh:mm A').format('YYYY-MM-DD'),
            'current_day': date ? moment(date).format('dddd') : moment(new Date(), 'hh:mm A').format('dddd'),
        })
        EventRegister.emit('loader', true)
        ApiCaller.call('appointments/preBooking', "POST", data, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("getAppointment ===>>>>", JSON.stringify(response))
                    this.setState({ slotSize: 0 })
                    response.items.forEach(item => {
                        this.setState({
                            slotSize: this.state.slotSize + parseInt(moment(item.lineItem.time_takes, 'HH:mm:ss').format('HH'))
                        })
                    });

                    let localTimingList = []
                    for (let i = 9; i <= 18; i = i + this.state.slotSize) {
                        if (i <= 18 - this.state.slotSize) {
                            localTimingList.push({ timing: i, status: 'unselected', id: i })
                            console.log(i)
                        }
                    }
                    this.setState({ timingList: localTimingList })
                    console.log(this.state.timingList)
                    let list = []
                    let min = 100, max = 0
                    response.allAppointment.forEach(element => {
                        min = moment(element.starting_from, 'HH:mm:ss').format('HH')
                        max = moment(element.ending, 'HH:mm:ss').format('HH')
                        // if (min != max) {
                        //     max--
                        // }
                        console.log(min, ">>>>>>>>>>>>", max)
                        for (let i = parseInt(min); i < max; i++) {
                            list.push(i)
                        }
                    });

                    console.log(list)
                    this.setState({
                        bookedList: list,
                        serviceList: response.items,
                        showTimingList: [],
                        // timingList: [],
                        grandTotal: response.grand_total,
                        serviceTax: response.service_tax, subTotal: response.subtotal, sendBusinessID: response.cart.business_id
                    })
                }
            })
            .catch((error) => {
                console.log("Error Appointment ==>>", error);
            })
    }


    componentWillUnmount() {
        removeAndroidBackButtonHandler();
    }

    handleTitleInputSubmit = () => {
        this.setState({ focusInput: true });
    }

    onDayPress(day) {
        console.log('selected day', day, day.dateString)
        this.setState({ selected: day.dateString, currentDay: day.dateString });

        this.getAppointmentCall(this.state.sendCardID, day.dateString)
    }

    requestBooking() {
        // this.props.navigation.navigate('PaymentDetailScreen', { appointmentID: 117 })

        if (this.state.showTimingList.length == 0) {
            Toasty.show('Please select appointment time')
        } else {
            console.log(this.state.showTimingList)
            var _array = this.state.showTimingList;
            Math.max.apply(Math, _array); // 3
            Math.min.apply(Math, _array); // 1

            var endTime = Math.max.apply(Math, _array)
            var startTime = Math.min.apply(Math, _array)

            console.log('Math.max.apply(Math,_array)', endTime)
            console.log('Math.min.apply(Math,_array)', startTime)
            // if (startTime == endTime) {
            endTime = endTime + this.state.slotSize
            // }
            var data = JSON.stringify({
                "cart_id": this.state.sendCardID,
                "business_id": this.state.sendBusinessID,
                "date_time": this.state.selected != undefined ? this.state.selected : moment(this.state.currentDay, 'hh:mm A').format('YYYY-MM-DD'),
                "starting_from": startTime + ':00',
                "ending": endTime + ":00",
                "provider_id": global.providerID
            })

            console.log(data)

            EventRegister.emit('loader', true)
            ApiCaller.call('appointments/' + this.state.sendAppointmentID + '/reschedule', "POST", data, true)
                .then((response) => {
                    EventRegister.emit('loader', false)
                    if (response) {
                        console.log("reschedule==>>> ", response)

                        global.myvar = 'MyBookings';
                        this.props.navigation.navigate("MyBookingScreen");

                    }

                })
                .catch((error) => {
                    console.log("ErrorLogin", error);
                })

        }
    }


    onPressDelete(itemmm) {
        Alert.alert(
            '',
            'Are you sure you want to delete service?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.deleteServiceApi(itemmm) },
            ],
            { cancelable: false }
        );
    }


    deleteServiceApi() {
        console.log('Delete api pending')
    }


    onSelectTime(item) {
        // console.log(item)

        let timingList = [...this.state.timingList];

        var showTimingList = [];
        var selectedTiming = [];

        for (let data of timingList) {
            if (data.id == item.id) {
                data.selected = (data.selected == null) ? true : !data.selected;

                if (data.selected == true) {
                    if (this.state.showTimingList.includes(data.id) == false) {
                        this.state.selectedTiming.push(data)
                        console.log("show data===>>>", this.state.selectedTiming)
                        this.setState({ selectedTiming: this.state.selectedTiming })
                        this.state.showTimingList.push(data.timing)
                        this.state.selectedTime = this.state.showTimingList.join()
                        console.log("helloo===>>> ", this.state.selectedTime)
                    }

                }
                if (data.selected == false) {
                    let sd = this.state.selectedTiming
                    let si = this.state.showTimingList
                    sd.splice(sd.indexOf(data), 1)
                    si.splice(si.indexOf(data.id), 1)
                    this.setState({
                        selectedTiming: sd,
                        showTimingList: si,
                        selectedTime: si.join(),
                    })

                    console.log('aayaaa', this.state.selectedTiming, this.state.showTimingList)

                }
                console.log("helloooo", data.selected)
                break;
            }
        }

        this.setState({ timingList });


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
                            title='Reschedule Appointment' />

                        <ScrollView style={{ height: '95%' }} showsVerticalScrollIndicator={false}>
                            <View style={[{ flex: 1 }]}>

                                <Calendar
                                    theme={{
                                        backgroundColor: '#ffffff',
                                        calendarBackground: '#ffffff',
                                        textSectionTitleColor: 'white',
                                        selectedDayBackgroundColor: '#00adf5',
                                        selectedDayTextColor: '#ffffff',
                                        todayTextColor: '#4CC9CA',
                                        dayTextColor: 'black',
                                        textDisabledColor: 'grey',
                                        dotColor: '#00adf5',
                                        arrowColor: 'white',
                                        monthTextColor: 'white',
                                        textDayFontSize: 16,
                                        textMonthFontSize: 22,
                                        textMonthFontFamily: 'HelveticaNeueLTStd-Lt',
                                        textDayFontFamily: 'HelveticaNeueLTStd-Roman',

                                    }}

                                    // Initially visible month. Default = Date()
                                    current={this.state.currentDay}
                                    // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                                    minDate={Date.now()}
                                    // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                                    // maxDate={'2020-05-30'}
                                    // Handler which gets executed on day press. Default = undefined
                                    onDayPress={(day) => { this.onDayPress(day) }}
                                    // Handler which gets executed on day long press. Default = undefined
                                    onDayLongPress={(day) => { console.log('selected day', day) }}
                                    // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                                    monthFormat={'MMMM yyyy'}
                                    // Handler which gets executed when visible month changes in calendar. Default = undefined
                                    onMonthChange={(month) => { console.log('month changed', month) }}
                                    // Hide month navigation arrows. Default = false
                                    hideArrows={false}
                                    // Replace default arrows with custom ones (direction can be 'left' or 'right')
                                    // renderArrow={(direction) => (<Arrow />)}
                                    // Do not show days of other months in month page. Default = false
                                    hideExtraDays={false}
                                    // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                                    // day from another month that is visible in calendar page. Default = false
                                    disableMonthChange={false}
                                    // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                                    firstDay={1}
                                    // Hide day names. Default = false
                                    hideDayNames={false}
                                    // Show week numbers to the left. Default = false
                                    showWeekNumbers={false}
                                    // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                                    onPressArrowLeft={substractMonth => substractMonth()}
                                    // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                                    onPressArrowRight={addMonth => addMonth()}
                                    // Disable left arrow. Default = false
                                    disableArrowLeft={false}
                                    // Disable right arrow. Default = false
                                    disableArrowRight={false}

                                    markedDates={{ [this.state.selected]: { selected: true, disableTouchEvent: true, selectedColor: '#4CC9CA' } }}

                                />

                                <View style={{ height: 'auto', paddingTop: 10, paddingBottom: 10, borderTopColor: 'grey', borderTopWidth: 1, borderBottomWidth: 1, borderBottomColor: 'grey' }}>
                                    <Text numberOfLines={1} style={{ paddingLeft: 10, fontSize: 13, fontFamily: 'HelveticaNeueLTStd-Md', color: '#BBBBBB', textTransform: 'uppercase' }}>Time</Text>

                                    <FlatList
                                        scrollEnabled={true}
                                        data={this.state.timingList}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        refreshing={this.state.refreshing}
                                        renderItem={({ item, index }) => {
                                            if (this.state.bookedList.includes(parseInt(item.timing))) {
                                                return (
                                                    <View style={{ flex: 1, padding: 8, alignItems: 'center' }}>
                                                        <View style={{ backgroundColor: 'lightgray', padding: 5, width: '100%', alignItems: 'center', borderColor: 'gray', borderWidth: 2, borderRadius: 20 }}>
                                                            <Text numberOfLines={1} style={{ fontSize: 14, width: 70, color: item.selected == true ? 'white' : 'black', fontFamily: 'HelveticaNeueLTStd-Lt', textAlign: 'center', paddingTop: Platform.OS === 'ios' ? 6 : 0, }}>{item.timing + ':00'}</Text>
                                                        </View>
                                                    </View>
                                                )
                                            } else {
                                                return (
                                                    <TouchableOpacity activeOpacity={1} style={{ flex: 1, padding: 8, alignItems: 'center' }} onPress={() => this.onSelectTime(item)}>
                                                        <View style={{ backgroundColor: item.selected == true ? '#4CC9CA' : 'white', padding: 5, width: '100%', alignItems: 'center', borderColor: item.status == 'booked' ? '#dcdcdc' : '#4CC9CA', borderWidth: 2, borderRadius: 20 }}>
                                                            <Text numberOfLines={1} style={{ fontSize: 14, width: 70, color: item.selected == true ? 'white' : 'black', fontFamily: 'HelveticaNeueLTStd-Lt', textAlign: 'center', paddingTop: Platform.OS === 'ios' ? 6 : 0, }}>{item.timing + ':00'}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            }
                                        }}
                                        keyExtractor={item => item.id}
                                    />

                                    <View style={{ flexDirection: 'row', padding: 10 }}>
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <Image style={sellerStyle.appointmentImage} source={require('../../assets/images/current.png')} />
                                            <Text numberOfLines={1} style={{ paddingLeft: 4, fontSize: 12, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'black', paddingTop: Platform.OS === 'ios' ? 5 : 0, }}>Current Selection</Text>
                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <Image style={sellerStyle.appointmentImage} source={require('../../assets/images/booked.png')} />
                                            <Text numberOfLines={1} style={{ paddingLeft: 4, fontSize: 12, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'black', paddingTop: Platform.OS === 'ios' ? 5 : 0, }}>Already Booked</Text>
                                        </View>

                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <Image style={sellerStyle.appointmentImage} source={require('../../assets/images/avialible.png')} />
                                            <Text numberOfLines={1} style={{ paddingLeft: 4, fontSize: 12, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'black', paddingTop: Platform.OS === 'ios' ? 5 : 0, }}>Available</Text>
                                        </View>

                                    </View>
                                </View>

                                <View style={{ padding: 10 }}>

                                    <Text style={[sellerStyle.statusText, { paddingTop: 10 }]}>Services</Text>


                                    <FlatList
                                        scrollEnabled={false}
                                        contentContainerStyle={{ paddingTop: 10, paddingBottom: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1 }}
                                        data={this.state.serviceList}
                                        refreshing={this.state.refreshing}
                                        renderItem={({ item, index }) =>
                                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                                                <TouchableOpacity activeOpacity={0.9} onPress={() => this.onPressDelete(item)}>
                                                    <Image style={{ height: 25, width: 25, marginTop: -10 }} source={require('../../assets/images/delete_black.png')} />
                                                </TouchableOpacity>
                                                <View style={{ flex: 1, paddingLeft: 5 }}>
                                                    <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>{item.lineItem.name}</Text>
                                                    <Text style={{ fontSize: 14, color: 'grey', fontFamily: 'HelveticaNeueLTStd-Roman' }}>{item.time}</Text>
                                                </View>
                                                <Text style={{ paddingTop: 5, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>$ {item.lineItem.price}</Text>
                                            </View>

                                        }
                                        keyExtractor={item => item.id}
                                    />

                                    <View style={{ flex: 1, flexDirection: 'row', paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 5 : 10, borderBottomColor: '#d7dada', borderBottomWidth: 1 }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Sub Total</Text>
                                            <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Service Tax</Text>
                                        </View>

                                        <View>
                                            <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>$ {this.state.subTotal}</Text>
                                            <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>  {parseFloat(this.state.serviceTax).toFixed(2)}%</Text>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row', paddingTop: Platform.OS === 'ios' ? 15 : 10, paddingBottom: Platform.OS === 'ios' ? 10 : 10, borderBottomColor: '#d7dada', borderBottomWidth: 1 }}>
                                        <Text style={{ flex: 1, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md' }}>Grand Total</Text>
                                        <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md' }}>$ {this.state.grandTotal}</Text>
                                    </View>

                                    <TouchableOpacity activeOpacity={1} onPress={() => this.requestBooking()} style={[sellerStyle.buttonStyle, { width: '90%', marginTop: 20, marginBottom: 20, alignSelf: 'center' }]}>
                                        <Text style={sellerStyle.buttonTextStyle}>Reschedule Booking</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }
}


