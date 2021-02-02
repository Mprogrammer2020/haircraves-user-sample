import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { DrawerNavigator } from './DrawerNavigator';
import HomeScreen from '../screens/HomeModule/HomeScreen';
import colors from '../constants/Colors'
import AddPostScreen from '../screens/HomeModule/AddPostScreen';
import MyBookingScreen from '../screens/BookingModule/MyBookingScreen';
import MyProfile from '../screens/MyProfileModule/MyProfile'
import HomeCart from '../screens/HomeModule/HomeCart'


export const BottomNavigator = createBottomTabNavigator({

    HomeScreen: {
        screen: HomeScreen,
        navigationOptions: ({ navigation }) => ({
            tabBarOnPress: ({ }) => {
                global.myvar = 'Home';
                navigation.navigate("HomeScreen", { refresh: 'refresh' })
            },
            header: null,
            title: 'Home',
            selectedIcon: require('../assets/images/home_selected.png'),
            tabBarIcon: ({ tintColor }) => (
                <Image style={{ height: 20, width: 20, marginTop: 10, resizeMode: 'contain' }}
                    source={global.myvar == 'Home'
                        ? require('../assets/images/home_selected.png') : require('../assets/images/home.png')} />
            ),
            tabBarOptions: {
                style: { height: 56, backgroundColor: colors.white, borderTopColor: colors.white, paddingBottom: 5, elevation: 8, shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.2 },
                activeTintColor: colors.appColor,
                inactiveTintColor: colors.greyText,
                labelStyle: {
                    fontFamily: 'HelveticaNeueLTStd-Roman',
                    fontSize: 12,
                    marginTop: 5
                },

            },

        })

    },


    HomeCart: {
        screen: HomeCart,
        navigationOptions: ({ navigation }) => ({
            tabBarOnPress: ({ }) => {
                global.myvar = 'MyCart';
                navigation.navigate("HomeCart", { refresh: 'refresh', cartID: global.cartID })
            },
            header: null,
            title: 'Cart',
            selectedIcon: require('../assets/images/cart.png'),
            tabBarIcon: ({ tintColor }) => (
                <View>
                    <Image style={{ height: 20, width: 20, marginTop: 10, resizeMode: 'contain' }}
                        source={global.myvar == 'MyCart' ?
                            require('../assets/images/cart_selected.png')
                            :
                            require('../assets/images/cart.png')} />
                </View >
            ),
            tabBarOptions: {
                style: { height: 56, backgroundColor: colors.white, borderTopColor: colors.white, paddingBottom: 5, elevation: 8, shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.2 },
                activeTintColor: colors.appColor,
                inactiveTintColor: colors.greyText,
                labelStyle: {
                    fontFamily: 'HelveticaNeueLTStd-Roman',
                    fontSize: 12,
                    marginTop: 5
                },

            },

        })

    }

    ,

    AddPostScreen: {
        screen: AddPostScreen,
        navigationOptions: ({ navigation }) => ({
            tabBarOnPress: ({ }) => {
                global.myvar = 'AddPost';
                navigation.navigate("AddPostScreen", { refresh: 'refresh' })
            },
            header: null,
            title: 'Add Post',
            selectedIcon: require('../assets/images/add.png'),
            tabBarIcon: ({ tintColor }) => (
                <View>
                    <Image style={{ height: 20, width: 20, marginTop: 10, resizeMode: 'contain' }} source={global.myvar == 'AddPost'
                        ? require('../assets/images/add_selected.png') : require('../assets/images/add.png')} />
                </View>
            ),
            tabBarOptions: {
                style: { height: 56, backgroundColor: colors.white, borderTopColor: colors.white, paddingBottom: 5, elevation: 8, shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.2 },
                activeTintColor: colors.appColor,
                inactiveTintColor: colors.greyText,
                labelStyle: {
                    fontFamily: 'HelveticaNeueLTStd-Roman',
                    fontSize: 12,
                    marginTop: 5,
                },
            },
        })
    },

    MyBookingScreen: {
        screen: MyBookingScreen,
        navigationOptions: ({ navigation }) => ({
            tabBarOnPress: ({ }) => {
                global.myvar = 'MyBookings';
                navigation.navigate("MyBookingScreen", { refresh: 'refresh' })
            },
            header: null,
            title: 'My Bookings',
            selectedIcon: require('../assets/images/booking.png'),
            tabBarIcon: ({ tintColor }) => (
                <Image style={{ height: 20, width: 20, marginTop: 10, resizeMode: 'contain' }} source={global.myvar == 'MyBookings'
                    ? require('../assets/images/booking_selected.png') : require('../assets/images/booking.png')} />

            ),
            tabBarOptions: {
                style: { height: 56, backgroundColor: colors.white, borderTopColor: colors.white, paddingBottom: 5, elevation: 8, shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.2 },
                activeTintColor: colors.appColor,
                inactiveTintColor: colors.greyText,
                labelStyle: {
                    fontFamily: 'HelveticaNeueLTStd-Roman',
                    fontSize: 12,
                    marginTop: 5
                },
            },


        })

    },

    MyProfile: {
        screen: MyProfile,
        navigationOptions: ({ navigation }) => ({
            tabBarOnPress: ({ }) => {
                global.myvar = 'Profile';
                navigation.navigate("MyProfile", { refresh: 'refresh' })
            },
            header: null,
            title: 'Profile',
            selectedIcon: require('../assets/images/profile.png'),
            tabBarIcon: ({ tintColor }) => (
                <Image style={{ height: 20, width: 20, marginTop: 10, resizeMode: 'contain' }} source={global.myvar == 'Profile'
                    ? require('../assets/images/profile_selected.png') : require('../assets/images/profile.png')} />
            ),
            tabBarOptions: {
                style: { height: 56, backgroundColor: colors.white, borderTopColor: colors.white, paddingBottom: 5, elevation: 8, shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.2 },
                activeTintColor: colors.appColor,
                inactiveTintColor: colors.greyText,
                labelStyle: {
                    fontFamily: 'HelveticaNeueLTStd-Roman',
                    fontSize: 12,
                    marginTop: 5
                },

            },

        })
    }

},



    {
        navigationOptions: {
            header: null,
            gesturesEnabled: false,
        },
        initialRouteName: 'HomeScreen'
    }


)
export default createAppContainer(BottomNavigator);

