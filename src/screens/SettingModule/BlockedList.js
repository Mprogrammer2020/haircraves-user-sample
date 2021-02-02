import React, { Component, Fragment } from 'react';
import { View, Image, Text, FlatList, Alert, SafeAreaView, StatusBar, Dimensions, TouchableOpacity, ScrollView, Platform, StyleSheet } from 'react-native'
import { Base64 } from '../../constants/common';
import settingStyle from './settingStyle';
import colors from '../../constants/Colors'
import CommonHeader from '../../elements/CommonHeader';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import ApiCaller from '../../constants/ApiCaller';
import { EventRegister } from 'react-native-event-listeners';
import ChatHelper from '../ChatModule/ChatHelper';



export default class BlockedList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blockedUsers: []
        }
    }


    componentDidUpdate() {

    }



    componentDidMount() {
        this.props.navigation.addListener(
            'willFocus',
            () => {
                handleAndroidBackButton(() => this.props.navigation.goBack())
            }
        );
        EventRegister.emit('loader', true)
        ApiCaller.call('users/blockedList', "POST", null, true)
            .then((response) => {
                console.log(response)
                EventRegister.emit('loader', false)
                this.setState({ blockedUsers: response.users })
            })
    }


    componentWillUnmount() {
        removeAndroidBackButtonHandler();
    }

    componentWillMount() {

    }



    _onPressUnbock(providerID) {
        EventRegister.emit('loader', true)
        ApiCaller.call('users/unblock', "POST", JSON.stringify({ id: providerID }), true)
            .then((response) => {
                console.log(response)
                ChatHelper.blockEmployer(global.userId, providerID, false).then(() => {
                    this.setState({ blockedUsers: this.state.blockedUsers.filter(item => item.id != providerID) })
                    EventRegister.emit('loader', false)
                })
            })
    }



    render() {
        return (
            <Fragment>

                <SafeAreaView style={[settingStyle.statusColor]} />
                <SafeAreaView style={settingStyle.bottomColor}>

                    <View>
                        <CommonHeader
                            drawable={require('../../assets/images/back_arrow.png')}
                            action={() => this.props.navigation.goBack()}
                            title='Blocked List'
                            title1='' />

                        {this.state.blockedUsers.length == 0 ?
                            <View style={{ flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                <Text>No blocked users</Text>
                            </View> : <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ flex: 1, paddingBottom: 50 }}>

                                    <FlatList
                                        scrollEnabled={false}
                                        data={this.state.blockedUsers}
                                        contentContainerStyle={{ paddingLeft: 5, paddingRight: 5 }}
                                        refreshing={this.state.refreshing}
                                        renderItem={({ item, index }) =>
                                            <TouchableOpacity activeOpacity={1} style={settingStyle.salonView}>
                                                <Image style={settingStyle.salonImage} source={{ uri: item.profile_pic_path }} />
                                                <Text style={settingStyle.salonName}>{item.first_name + " " + item.last_name}</Text>
                                                <TouchableOpacity onPress={() => this._onPressUnbock(item.id)} activeOpacity={1} style={settingStyle.buttonStyle}>
                                                    <Text style={settingStyle.unblockText}>Unblock</Text>
                                                </TouchableOpacity>
                                            </TouchableOpacity>
                                        }
                                        keyExtractor={item => item.id}
                                    />
                                </View>
                            </ScrollView>}
                    </View>
                </SafeAreaView>
            </Fragment>
        );
    }
}