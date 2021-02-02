import React, { Component, Fragment } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity, TextInput, ScrollView, FlatList, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import Toasty from '../../elements/Toasty';
import CommonHeader from '../../elements/CommonHeader';
import settingStyle from './settingStyle'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import { WebView } from 'react-native-webview';


export default class TermCondition extends Component {

    constructor() {
        super()
        this.state = {
            webLoader: false,

        }
    }


    componentDidMount() {
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



    render() {
        return (
            <Fragment>

                <SafeAreaView style={[settingStyle.statusColor]} />
                <SafeAreaView style={settingStyle.bottomColor}>
                    <View style={{flex:1}}>
                        <CommonHeader
                            drawable={require('../../assets/images/back_arrow.png')}
                            action={() => this.props.navigation.goBack()}
                            title='Terms & Conditions'
                            title1='' />



                        {this.state.webLoader ?
                            <View style={{ height: '80%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                <ActivityIndicator size="large" color={'#4CC9CA'} />
                            </View>
                            :
                            null
                        }

                        <WebView style={{ flex: 1, width: '100%', height: '95%'}}
                            source={{ uri:  'http://198.211.110.165:3000/terms-and-conditions' }}
                            onLoadStart={() => this.setState({ webLoader: true })}
                            onLoadEnd={() => this.setState({ webLoader: false })}
                        />

                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }
}

