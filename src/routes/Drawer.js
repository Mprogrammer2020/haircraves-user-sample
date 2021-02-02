import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavigationActions, StackActions } from 'react-navigation';
import { DrawerActions } from "react-navigation";
import { ScrollView, Text, View, Image, TouchableOpacity, SafeAreaView, StyleSheet, StatusBar, Alert } from 'react-native';
import Storage from '../constants/Storage';
import ApiCaller from '../constants/ApiCaller';
import Toasty from '../elements/Toasty';


const mainColor = 'black';

class Drawer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tagsColor: 'white',
            modalVisible: false,
            firstName: '',
            lastName: '',
            profilePic: '',
            email: '',
        }
    }

    componentDidMount() {
        Storage.get('loginData').then(loginData => {
            var userData = JSON.parse(loginData)
            if (userData != null) {
                this.setState({
                    firstName: userData.user.first_name, lastName: userData.user.last_name,
                    profilePic: userData.user.profile_pic_path, email: userData.user.email
                })
            }
        })
    }

    componentWillReceiveProps() {
        ApiCaller.call('users/userDetails', "GET", null, true)
            .then((response) => {
                if (response) {
                    this.setState({
                        firstName: response.user.first_name, lastName: response.user.last_name,
                        profilePic: response.user.profile_pic_path, email: response.user.email
                    })
                }
            })
            .catch((error) => {
                console.log("Drawer ==>>", error);
            })
    }


    tabClick(screen) {
        // if (screen == 'HomeScreen') {
        //     global.myvar = 'Home'
        // }
        global.myvar = 'Home'
        this.props.navigation.closeDrawer();
        this.props.navigation.navigate(screen)
    }

    logout() {
        this.props.navigation.closeDrawer();

        Alert.alert(
            'Log out',
            'Are you sure you want to Log out ?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.logoutCall() },
            ],
            { cancelable: false }
        );
    }


    logoutCall() {
        // EventRegister.emit('loader', true)
        ApiCaller.call('users/logout', "GET", null, true)
            .then((response) => {
                // EventRegister.emit('loader', false)
                if (response) {
                    console.log("logout Screen====>>>>", response)
                    Toasty.show(response.message)
                    global.myvar = 'Home'
                    Storage.clear();
                    global.token = ''
                    // this.props.navigation.navigate('Login')

                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Login' })],
                    });
                    this.props.navigation.dispatch(resetAction);
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }

    render() {

        return (

            <View style={{ flex: 1, backgroundColor: 'white', zIndex: 99999 }}>
                <ScrollView>

                    <View>

                        <View style={styles.bacView}>
                            <Image style={styles.bacImages} source={require('../assets/images/drawer_back.png')} />
                            <View style={styles.userView}>
                                {this.state.profilePic ? <Image style={styles.userImage} source={{ uri: this.state.profilePic }} />
                                    : <Image style={styles.userImage} source={require('../assets/images/ic_placeholder.png')} />}
                                <View style={{ paddingLeft: 10, width: '68%' }}>
                                    <Text style={styles.nameText}>{this.state.firstName} {this.state.lastName}</Text>
                                    {this.state.email ? <Text style={styles.emailText}>{this.state.email}</Text> : null}
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity activeOpacity={1} style={[styles.tabView, { marginTop: 10 }]} onPress={() => this.tabClick('HomeScreen')}>
                            <Image style={styles.tabImages} source={require('../assets/images/home_black.png')} />
                            <Text style={styles.tabText}>Home</Text>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={1} style={styles.tabView} onPress={() => this.tabClick('HomePayment')}>
                            <Image style={styles.tabImages} source={require('../assets/images/card.png')} />
                            <Text style={styles.tabText}>Payment Methods</Text>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={1} style={styles.tabView} onPress={() => this.tabClick('MyOrder')}>
                            <Image style={styles.tabImages} source={require('../assets/images/my_order.png')} />
                            <Text style={styles.tabText}>My Orders</Text>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={1} style={styles.tabView} onPress={() => this.tabClick('FavoriteScreen')}>
                            <Image style={styles.tabImages} source={require('../assets/images/heart.png')} />
                            <Text style={styles.tabText}>Favorites</Text>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={1} style={styles.tabView} onPress={() => this.tabClick('Chat')}>
                            <Image style={styles.tabImages} source={require('../assets/images/message.png')} />
                            <Text style={styles.tabText}>Messages</Text>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={1} style={styles.tabView} onPress={() => this.tabClick('SettingScreen')}>
                            <Image style={styles.tabImages} source={require('../assets/images/setting.png')} />
                            <Text style={styles.tabText}>Settings</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.logout()} activeOpacity={1} style={styles.tabView}>
                            <Image style={styles.tabImages} source={require('../assets/images/logout.png')} />
                            <Text style={styles.tabText}>Logout</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </View>
        );
    }
}

Drawer.propTypes = {
    navigation: PropTypes.object
};

export default Drawer;

const styles = StyleSheet.create({
    bacImages: { height: 180, borderRadius: 50 },
    bacView: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4CC9CA', padding: 10, height: 180, paddingTop:30 },
    userView: { zIndex: 99999, paddingLeft: 10, flexDirection: 'row', position: 'absolute', justifyContent: 'center', alignItems: 'center' },
    userImage: { height: 90, width: 90, borderRadius: 45 },
    nameText: { color: 'white', fontSize: 18, fontFamily: 'HelveticaNeueLTStd-Lt' },
    emailText: { color: 'white', fontSize: 16, fontFamily: 'HelveticaNeueLTStd-Lt', padding: 2 },
    tabView: { flexDirection: 'row', padding: 15, alignItems: 'center' },
    tabImages: { height: 30, width: 30, resizeMode: 'contain' },
    tabText: { color: 'black', fontSize: 18, fontFamily: 'HelveticaNeueLTStd-Lt', paddingLeft: 15, paddingTop: Platform.OS === 'ios' ? 8 : 0, },




});