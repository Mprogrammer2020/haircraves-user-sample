import React, { Component, Fragment } from 'react';
import { View, ImageBackground, Switch, Image, Text, TouchableOpacity, TextInput, ScrollView, FlatList, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import Toasty from '../../elements/Toasty';
import settingStyle from './settingStyle'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import ApiCaller from '../../constants/ApiCaller';


export default class SettingScreen extends Component {

    constructor() {
        super()
        this.state = {
            notificationStatus: true

        }
    }



    componentDidMount() {
        this.props.navigation.addListener(
            'willFocus',
            () => {    
                this.userDetail()           
                handleAndroidBackButton(() => this.props.navigation.goBack())
                StatusBar.setBackgroundColor('#ffffff');
                StatusBar.setBarStyle('dark-content');
            }
        );
    }


    userDetail() {
        ApiCaller.call('users/userDetails', "GET", null, true)
        .then((response) => {
            if (response) {
                this.setState({notificationStatus : response.user.has_notification == 0 ? false : true })
            }
        })
        .catch((error) => {
            console.log("userDetails ==>>", error);
        })
    }

    getNotificationStatus(){
        ApiCaller.call('users/notification', "GET", null, true)
        .then((response) => {
            if (response) {
                console.log("notification===>>>>", response)
              
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


    _onPressCall(screen) {
        this.props.navigation.navigate(screen)
    }

    toggleNotification(value) {
        this.setState({ notificationStatus: value })
        this.getNotificationStatus()
    }


    drawerOpen() {
        this.props.navigation.toggleDrawer();
    }

    render() {
        return (
            <Fragment>
                {Platform.OS == 'ios' ? <StatusBar barStyle="dark-content" translucent={true} /> : <StatusBar hidden={false} barStyle="dark-content" backgroundColor="white" translucent={false} />}

                <SafeAreaView style={[settingStyle.statusColor]} />
                <SafeAreaView style={settingStyle.bottomColor}>


                    <View style={{ flex: 1 }}>
                        <View style={settingStyle.barStyle}>
                            <TouchableOpacity style={{ paddingLeft: 10 }} activeOpacity={0.9}
                                onPress={() => this.drawerOpen()}>
                                <Image style={{ width: 22, height: 22, resizeMode: 'contain' }} source={require('../../assets/images/menu_black.png')} />
                            </TouchableOpacity>

                            <Text style={[settingStyle.headerText,{paddingTop: Platform.OS === 'ios' ? 8:0, marginRight : 15}]}>Settings</Text>

                        </View>
                        <View style={[{ flex: 1, padding: 10 }]}>

                            <View style={settingStyle.touchView}>
                                <Text style={[settingStyle.titleText, { paddingTop: Platform.OS === 'ios' ? 8 : 0 }]}>Notifications</Text>
                                <Switch
                                    thumbColor="white"
                                    onTintColor="#4CC9CA"
                                    ios_backgroundColor='#959595'
                                    onValueChange={(value) => this.toggleNotification(value)}
                                    value={this.state.notificationStatus}
                                />
                            </View>

                            <TouchableOpacity onPress={() => this._onPressCall('TermCondition')} activeOpacity={0.9} style={settingStyle.touchView}>
                                <Text style={settingStyle.titleText}>Terms & Conditions</Text>
                                <Image style={settingStyle.arrowImage} source={require('../../assets/images/right_arrow.png')} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this._onPressCall('PrivacyPolicy')} activeOpacity={0.9} style={settingStyle.touchView}>
                                <Text style={settingStyle.titleText}>Privacy Policy</Text>
                                <Image style={settingStyle.arrowImage} source={require('../../assets/images/right_arrow.png')} />
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={1} style={settingStyle.touchView}>
                                <Text style={settingStyle.titleText}>Rate App</Text>
                                <Image style={settingStyle.arrowImage} source={require('../../assets/images/right_arrow.png')} />
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={1} style={settingStyle.touchView}>
                                <Text style={settingStyle.titleText}>Share App</Text>
                                <Image style={settingStyle.arrowImage} source={require('../../assets/images/right_arrow.png')} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this._onPressCall('BlockedList')} activeOpacity={1} style={settingStyle.touchView}>
                                <Text style={settingStyle.titleText}>Block List</Text>
                                <Image style={settingStyle.arrowImage} source={require('../../assets/images/right_arrow.png')} />
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={1} style={settingStyle.versionView}>
                                <Text style={settingStyle.titleText}>Version</Text>
                                <Text style={settingStyle.versionText}>1.0</Text>
                            </TouchableOpacity>


                        </View>
                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }
}

