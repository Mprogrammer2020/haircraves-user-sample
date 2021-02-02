import React, { Component, Fragment } from 'react';
import { View, Image, Text, FlatList, Alert, SafeAreaView, StatusBar, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import { Base64 } from '../../constants/common';
import homeStyle from './homeStyle';
import CommonHeader from '../../elements/CommonHeader';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import { EventRegister } from 'react-native-event-listeners';
import ApiCaller from '../../constants/ApiCaller';
import moment from 'moment';


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default class NotificationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notificationList: [],
            appointments: null
        }
    }


    componentDidUpdate() {

    }


    componentDidMount() {
        this.props.navigation.addListener(
            'willFocus',
            () => {
                this.notificationApi()
                handleAndroidBackButton(() => this.props.navigation.goBack())
            }
        );
    }


    notificationApi() {
        var data = JSON.stringify({
            "current_date": moment(new Date(), 'hh:mm A').format('YYYY-MM-DD'),
            "start_time": moment(new Date(), 'hh:mm A').format('hh') + ':00:00',
            "end_time": moment(new Date() + 1, 'hh:mm A').format('hh') + ':00:00',
        })

        console.log(data)

        EventRegister.emit('loader', true)
        ApiCaller.call('users/notifications', "POST", data, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("notification ====>>>>", response)
                    this.setState({ notificationList: response.notifications.reverse(), appointments: response.appointments })
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }

    componentWillUnmount() {
        removeAndroidBackButtonHandler();
    }

    componentWillMount() {

    }



    _onPressSingle(item) {
        console.log(item)

        if (item.type == 'order_packed') {
            this.props.navigation.navigate('InProgressDetail', { orderID: item.appointment_id })
        }
        else if (item.type == 'order_on_the_way') {
            this.props.navigation.navigate('InProgressDetail', { orderID: item.appointment_id })
        }
        else if (item.type == 'order_delivered') {
            this.props.navigation.navigate('DeliveredDetail', { orderID: item.appointment_id })
        }
        else if (item.type == 'booking_cancelled') {
            this.props.navigation.navigate('CancelledDetail', { appointmentID: item.appointment_id })
        }
        else if (item.type == 'late') {
            this.props.navigation.navigate('ActiveDetail', { appointmentID: item.appointment_id })
        }
        else if (item.type == 'new_message') {
            let sellerData = {
                name: item.name,
                id: item.sender_id,
                image: item.user_image_path,
            }
            console.log(sellerData)
            this.props.navigation.navigate('SingleChat', { sellerDetail: sellerData })
        }
    }

    lateTimeCall(lateTime, appointmentID, providerId) {
        var data = JSON.stringify({
            "late_time": lateTime,
            "appointment_id": appointmentID,
            "provider_id": providerId
        })

        console.log(data)
        EventRegister.emit('loader', true)
        ApiCaller.call('users/lateNotification', "POST", data, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("notification ====>>>>", response)
                    alert('You have notify the stylish succesfully.')

                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }


    appointmemtCall(id) {
        console.log("hellooo")
        this.props.navigation.navigate('ActiveDetail', { appointmentID: id })
    }


    render() {
        return (
            <Fragment>
                {Platform.OS == 'ios' ? <StatusBar barStyle="dark-content" translucent={true} /> : <StatusBar hidden={false} barStyle="dark-content" backgroundColor="white" translucent={false} />}

                <SafeAreaView style={[homeStyle.statusColor]} />
                <SafeAreaView style={homeStyle.bottomColor}>

                    <View>
                        <CommonHeader
                            drawable={require('../../assets/images/back_arrow.png')}
                            action={() => this.props.navigation.goBack()}
                            title='Notification'
                            title1='' />

                        <ScrollView showsVerticalScrollIndicator={false}>

                            {/* <View style={{ width: '100%', backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 5, paddingTop: 0 }}> */}

                            <View style={{ width: '100%', backgroundColor: 'white', flexDirection: 'column', paddingBottom: 5, paddingTop: 0 }}>


                                {this.state.appointments ?
                                    <View style={{ paddingTop: 10, flex: 1, paddingLeft: 10, paddingRight: 5, flexDirection: 'row', borderBottomColor: '#BBBBBB', borderBottomWidth: 1 }}>



                                        <TouchableOpacity activeOpacity={1} style={{ flex: 1, flexDirection: 'column' }} onPress={() => this.appointmemtCall(this.state.appointments.id)}>
                                            <Text style={homeStyle.notificationTitle}>You have  an appointment in 1 hour. Are you {'\n'} running late ?</Text>
                                            <View style={{ flexDirection: 'row', paddingTop: 8, paddingBottom: 8 }}>
                                                <TouchableOpacity activeOpacity={1} style={homeStyle.timerView} onPress={() => this.lateTimeCall('15 min', this.state.appointments.id, this.state.appointments.provider_id)}>
                                                    <Text style={homeStyle.timerText}>15 min</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity activeOpacity={1} style={[homeStyle.timerView, { marginLeft: 5, marginRight: 5 }]} onPress={() => this.lateTimeCall('30 min', this.state.appointments.id, this.state.appointments.provider_id)}>
                                                    <Text style={homeStyle.timerText}>30 min</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity activeOpacity={1} style={homeStyle.timerView} onPress={() => this.lateTimeCall('45 min', this.state.appointments.id, this.state.appointments.provider_id)}>
                                                    <Text style={homeStyle.timerText}>45 min</Text>
                                                </TouchableOpacity>
                                            </View>
                                            {/* <Text style={homeStyle.notificationTime}>{moment(this.state.appointments.updated_at).fromNow(true)}</Text> */}
                                        </TouchableOpacity>
                                    </View> : null}


                                {this.state.notificationList.length > 0 || this.state.appointments ?

                                    <FlatList
                                        scrollEnabled={false}
                                        data={this.state.notificationList}
                                        refreshing={this.state.refreshing}
                                        style={{ marginBottom: 50 }}
                                        renderItem={({ item, index }) =>
                                            <View style={{ flex: 1, borderBottomColor: '#BBBBBB', borderBottomWidth: 1, paddingTop: 5, paddingBottom: 5, marginLeft: 8, marginRight: 8 }}>
                                                <TouchableOpacity activeOpacity={1} onPress={() => this._onPressSingle(item)} style={{ flex: 1, flexDirection: 'row', paddingTop: 5, paddingBottom: 5, alignItems: 'center' }}>

                                                    <View>
                                                        {item.user_image_path ? <Image style={{ height: 50, width: 50, borderRadius: 5 }} source={{ uri: item.user_image_path }} />
                                                            :
                                                            <Image style={{ height: 50, width: 50, borderRadius: 5 }} source={require('../../assets/images/ic_placeholder.png')} />}
                                                    </View>

                                                    <View style={{ flex: 1, paddingLeft: 10, paddingRight: 5, flexDirection: 'row' }}>
                                                        <View style={{ flex: 1, flexDirection: 'column' }}>
                                                            <Text style={homeStyle.notificationTitle}>{item.title}</Text>
                                                            <Text style={homeStyle.notificationTime}>{moment(item.created_at).fromNow(true)}</Text>
                                                        </View>
                                                    </View>

                                                </TouchableOpacity>

                                            </View>

                                        }
                                        keyExtractor={item => item.id}
                                    />
                                    :
                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: viewportHeight - 90 }}>
                                        <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>No data found</Text>
                                    </View>}


                            </View>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </Fragment>
        );
    }
}