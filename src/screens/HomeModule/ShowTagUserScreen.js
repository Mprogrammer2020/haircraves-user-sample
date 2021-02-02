import React, { Component, Fragment } from 'react';
import { View, Image, Text, FlatList, Alert, SafeAreaView, StatusBar, Dimensions, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { Base64 } from '../../constants/common';
import homeStyle from './homeStyle';
import CommonHeader from '../../elements/CommonHeader';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import ApiCaller from '../../constants/ApiCaller';
import { EventRegister } from 'react-native-event-listeners';
import Toasty from '../../elements/Toasty';
import colors from '../../constants/Colors';



export default class ShowTagUserScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            peopleList: [],
            dummyList: [],
            showPeopleList: [],
            selectedPeople: [],
            selectedUsersID: '',
            searchTitle: '',
            taggedUser: [],

        }
    }


    componentDidUpdate() {

    }


    componentDidMount() {
        const { navigation } = this.props;
        var userItem = navigation.getParam('taggedItems');
        var from = navigation.getParam('from');

        console.log("UserItem", userItem)
        this.setState({ taggedUser: from == 'Detail' ? userItem.users : userItem.taggedUser })

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


    componentWillMount() {
    }


    _onPressSingle(item) {

    }

    goToProfile = (item) => {
        console.log(item)
        if (item.role == 1) {
            global.providerID = item.id;
            this.props.navigation.navigate('SellerProfile')
        }
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
                            title='Tagged Users' />

                        <ScrollView showsVerticalScrollIndicator={false}>

                            <View style={{ width: '100%', backgroundColor: 'white', paddingBottom: 5, paddingTop: 0 }}>


                                <FlatList
                                    style={{ marginBottom: 45 }}
                                    scrollEnabled={false}
                                    data={this.state.taggedUser}
                                    refreshing={this.state.refreshing}
                                    renderItem={({ item, index }) =>
                                        <View style={{ flex: 1, borderBottomColor: '#BBBBBB', flexDirection: 'row', borderBottomWidth: 1, paddingTop: 5, paddingBottom: 5, marginLeft: 8, marginRight: 8 }}>
                                            <TouchableOpacity activeOpacity={1} onPress={() => this.goToProfile(item)} style={{ flex: 1, flexDirection: 'row', paddingTop: 5, paddingBottom: 5, alignItems: 'center' }}>
                                                {item.profile_pic_path ?
                                                    <Image style={{ height: 50, width: 50, borderRadius: 25, }} source={{ uri: item.profile_pic_path }} />
                                                    : <Image style={{ height: 50, width: 50, borderRadius: 25 }} source={require('../../assets/images/ic_placeholder.png')} />}
                                                <Text style={homeStyle.prodUserText}>{item.full_name}</Text>
                                                {item.role == 1 && <Text style={{ color: colors.appColor, fontSize: 12, marginStart: 8, textDecorationLine: 'underline' }}>View Profile</Text>}
                                            </TouchableOpacity>

                                        </View>

                                    }
                                    keyExtractor={item => item.id}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </Fragment>
        );
    }
}