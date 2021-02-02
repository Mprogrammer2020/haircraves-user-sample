import React, { Component } from 'react';
import { StatusBar, View, Image, AsyncStorage } from 'react-native';
import styles from './styles';
import SplashScreen from 'react-native-splash-screen'
import firebase from 'react-native-firebase';
import Storage from '../../constants/Storage';

export default class App extends Component {
    constructor() {
        super()
    }

    async componentDidMount() {

        console.log("SPlasehh")
        this.checkPermission();
        this.didmountData();

        setTimeout(() => {
            SplashScreen.hide();
            Storage.get('loginData').then(loginData => {
                var userData = JSON.parse(loginData)

                if (userData != null) {

                    console.log(" HELLOOOOOOOOOO", userData.user.access_token)

                    if (userData.user.access_token && userData.user.profile_completed == "true") {
                        global.token = userData.user.access_token
                        global.myvar = 'Home'
                        this.props.navigation.navigate('DrawerNavigator')
                    }
                    else {
                        this.props.navigation.navigate('Login')
                    }
                }
                else {
                    this.props.navigation.navigate('Login')
                    console.log("Splash firstTime ===>>", loginData)
                }

            })


        }, 2000)
    }

    componentWillUnmount() {
        console.log("componentWillUnmount")
        this.notificationListener();
        this.notificationOpenedListener();
        // this.onTokenRefreshListener();
    }


    //1
    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    //3
    async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        // if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);

            AsyncStorage.getItem("fcmToken").then((fcmToken) => {

                global.fcmTokennnn = fcmToken;

                console.log("splash", global.fcmTokennnn)

            })
                .then(res => {
                    //do something else

                    console.log("fcmTokennnn Else", res)

                });
        }
        // }
    }

    //2
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
        }
    }


    componentWillMount() {

        const channel = new firebase.notifications.Android.Channel('channelId', 'Channel Name', firebase.notifications.Android.Importance.Max)
            .setDescription('A natural description of the channel');
        firebase.notifications().android.createChannel(channel);

        console.log("elseeeeee calllllleddddddddddddddddd")

        this.notificationListener = firebase.notifications().onNotification((notification) => {
            this.showNotification(notification)
        })

    }

    showNotification(notification) {
        console.log("elseeeeee calllllleddddddddddddddddd", notification)
        const localNotification = new firebase.notifications.Notification({
            sound: 'default', show_in_foreground: true,
        })
            .setNotificationId(notification.notificationId)
            .setTitle(notification.title)
            // .setSubtitle('Uja')
            .setBody(notification.body)
            .setData(notification.data)
            .android.setAutoCancel(true)
            .android.setChannelId('channelId') // e.g. the id you chose above 
            .android.setSmallIcon('ic_notification') // create this icon in Android Studio 
            .android.setColor('#4CC9CA') // you can set a color here 
            .android.setPriority(firebase.notifications.Android.Priority.High);


        firebase.notifications().displayNotification(localNotification)
            .catch(err => console.error("errrrrrrrrrrrrrrr ", err));
    }


    didmountData() {


        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const action = notificationOpen.action;
            const notification = notificationOpen.notification;

            console.log("onNotificationOpened", notification._data)

            // if (notification._data.type == 'order_packed') {
            //     this.props.navigation.navigate('InProgressDetail', { orderID: notification.data.appointment_id })
            // }

            // else if (notification._data.type == 'order_on_the_way') {
            //     this.props.navigation.navigate('InProgressDetail', { orderID: notification.data.appointment_id })
            // }

            if (
                notification._data.type == 'order_delivered' ||
                notification._data.type == 'order_on_the_way' ||
                notification._data.type == 'order_packed'
            ) {
                this.props.navigation.navigate('DeliveredDetail', { orderID: notification.data.appointment_id, refresh: "refresh" })
            }
            else if (notification._data.type == 'booking_cancelled' || notification._data.type == 'late') {
                this.props.navigation.navigate('ActiveDetail', { appointmentID: notification.data.appointment_id, refresh: "refresh" })
            }
            // else if (notification._data.type == 'late') {
            //     this.props.navigation.navigate('ActiveDetail', { appointmentID: notification.data.appointment_id, refresh: "refresh" })
            // }
            else if (notification._data.type == 'new_message') {
                let sellerData = {
                    name: notification.data.other_user_name,
                    id: notification.data.other_user_id,
                    image: notification.data.other_user_image,
                }
                console.log(sellerData)
                this.props.navigation.navigate('SingleChat', { sellerDetail: sellerData, })
            }
            else { }
            firebase.notifications().removeDeliveredNotification(notification.notificationId);

        });


        firebase.notifications().getInitialNotification()
            .then((notificationOpen) => {
                if (notificationOpen) {
                    this.setState({ getInitial: true })
                }

                if (notificationOpen) {
                    const action = notificationOpen.action;
                    const notification = notificationOpen.notification;
                    console.log("when app killed ", notification)

                    if (
                        notification._data.type == 'order_delivered' ||
                        notification._data.type == 'order_on_the_way' ||
                        notification._data.type == 'order_packed'
                    ) {
                        this.props.navigation.navigate('DeliveredDetail', { orderID: notification.data.appointment_id, refresh: "refresh" })
                    }
                    else if (notification._data.type == 'booking_cancelled' || notification._data.type == 'late') {
                        this.props.navigation.navigate('ActiveDetail', { appointmentID: notification.data.appointment_id, refresh: "refresh" })
                    }
                    else if (notification._data.type == 'new_message') {
                        setTimeout(() => {
                            let sellerData = {
                                name: notification.data.other_user_name,
                                id: notification.data.other_user_id,
                                image: notification.data.other_user_image,
                            }
                            console.log(sellerData)
                            this.props.navigation.navigate('SingleChat', { sellerDetail: sellerData, })
                        }, 2800);
                    }


                    else {

                    }


                    // if (notification._data.type == 'order_packed') {
                    //     setTimeout(() => {
                    //         this.props.navigation.navigate('InProgressDetail', { orderID: notification.data.appointment_id })
                    //     }, 2800);
                    // }

                    // else if (notification._data.type == 'order_on_the_way') {
                    //     setTimeout(() => {
                    //         this.props.navigation.navigate('InProgressDetail', { orderID: notification.data.appointment_id })
                    //     }, 2800);
                    // }

                    // else if (notification._data.type == 'order_delivered') {
                    //     setTimeout(() => {
                    //         this.props.navigation.navigate('DeliveredDetail', { orderID: notification.data.appointment_id })
                    //     }, 2800);
                    // }

                    // else if (notification._data.type == 'booking_cancelled') {
                    //     setTimeout(() => {
                    //         this.props.navigation.navigate('CancelledDetail', { appointmentID: notification.data.appointment_id })
                    //     }, 2800);
                    // }

                    // else if (notification._data.type == 'late') {
                    //     setTimeout(() => {
                    //         this.props.navigation.navigate('ActiveDetail', { appointmentID: notification.data.appointment_id })
                    //     }, 2800);
                    // }


                    setTimeout(() => {
                        SplashScreen.hide();
                    }, 3000);
                    firebase.notifications().removeDeliveredNotification(notification.notificationId);
                }
            });

    }


    componentWillReceiveProps(nextProps) {
        console.log("ggggggg")
        this.didmountData();
    }


    componentWillUnmount() {
        this.notificationOpenedListener();
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                {Platform.OS == 'ios' ? <StatusBar barStyle="dark-content" translucent={true} /> : <StatusBar hidden={false} backgroundColor="#4CC9CA" translucent={false} />}
                <View style={styles.splashView}>
                    <Image style={styles.splashIcon} source={require('../../assets/images/logo_customer.png')} />
                </View>
            </View>
        )
    }
}
