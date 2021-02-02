import React, { Component, Fragment } from 'react';
import { View, Image, Text, FlatList, Alert, SafeAreaView, StatusBar, Dimensions, TouchableOpacity, ScrollView, TextInput, Keyboard } from 'react-native'
import { Base64 } from '../../constants/common';
import homeStyle from './homeStyle';
import CommonHeader from '../../elements/CommonHeader';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import ApiCaller from '../../constants/ApiCaller';
import { EventRegister } from 'react-native-event-listeners';
import { cond } from 'react-native-reanimated';
import Toasty from '../../elements/Toasty';



export default class TagPeopleList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            peopleList: [],
            dummyList: [],
            showPeopleList: [],
            selectedPeople: this.props.navigation.getParam('selectedUsersList'),
            selectedUsersID: this.props.navigation.getParam('selectedUsersID'),
            searchTitle: '',

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
    }


    componentWillUnmount() {
        removeAndroidBackButtonHandler();
    }


    componentWillMount() {
    }


    _onPressSingle(item) {

    }

    addTag(item) {
        // console.log("item==>>>", item)

        // console.log("item==>>>", this.state.showPeopleList.includes(item.id))

        // var showPeopleList = [];

        if (this.state.selectedUsersID.includes(item.id) == false) {
            this.state.selectedPeople.push(item)
            this.state.selectedUsersID.push(item.id)

            this.setState({ selectedPeople: this.state.selectedPeople })

            // this.state.showPeopleList.push(item.id)

            // console.log("helloo===>>> ", this.state.showPeopleList)

            // this.state.selectedUsersID = this.state.showPeopleList

            // this.state.selectedUsersID = this.state.showPeopleList.join()
            // console.log("helloo===>>> ", this.state.selectedUsersID)
        }

    }

    removeTag(itemm) {
        let sd = this.state.selectedPeople
        let si = this.state.selectedUsersID
        sd.splice(sd.indexOf(itemm), 1)
        si.splice(si.indexOf(itemm.id), 1)
        this.setState({
            selectedPeople: sd,
            // showPeopleList: si,
            selectedUsersID: si,
        })


        console.log('aayaaa', this.state.selectedPeople, this.state.showPeopleList)

    }

    selectedCall() {
        if (this.state.selectedUsersID.length == 0) {
            Toasty.show('Please select user first.');
        } else {
            this.props.navigation.state.params.onGoBack(this.state.selectedUsersID, this.state.selectedPeople);
            this.props.navigation.goBack();

        }

    }


    updateSearch = searchTitle => {
        var titleSearch = searchTitle;
        this.setState({ searchTitle });

        if (searchTitle != "") {
            this.getUserApi(titleSearch.trim());
        } else {
            this.setState({ peopleList: [] })
        }
    };


    getUserApi(nameeeee) {

        var data = JSON.stringify({
            "name": nameeeee,
        })
        // EventRegister.emit('loader', true)
        ApiCaller.call('users/search', "POST", data, true)
            .then((response) => {
                // EventRegister.emit('loader', false)
                if (response) {
                    console.log("users===>>>>", response)
                    this.setState({ peopleList: this.state.searchTitle ? response.users : [] })
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
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
                            title='Users'
                            title1='Done'
                            action2={() => this.selectedCall()} />

                        <ScrollView showsVerticalScrollIndicator={false}>

                            <View style={{ width: '100%', backgroundColor: 'white', paddingBottom: 5, paddingTop: 0 }}>



                                <View style={{ margin: 10, flex: 1, flexDirection: 'row', backgroundColor: '#EFEEEE', borderRadius: 30, alignItems: 'center' }}>
                                    <TouchableOpacity style={{ paddingLeft: 20 }} onPress={() => this.onSearch()}>
                                        <Image style={homeStyle.imageSend} source={require('../../assets/images/search_black.png')} />
                                    </TouchableOpacity>

                                    <TextInput style={homeStyle.textInput}
                                        placeholder="Search users"
                                        fontSize={16}
                                        fontFamily={'HelveticaNeueLTStd-Lt'}
                                        placeholderTextColor={'black'}
                                        blurOnSubmit={true}
                                        returnKeyType={'done'}
                                        onChangeText={this.updateSearch}
                                        value={this.state.searchTitle} />
                                </View>


                                {this.state.selectedPeople ?
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
                                        {this.state.selectedPeople.map((dataItem, key) => (
                                            <View style={{ backgroundColor: '#4CC9CA', margin: 4, borderRadius: 8, padding: 6, marginStart: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>

                                                {dataItem.profile_pic_path ? <Image style={{ height: 50, width: 50, borderRadius: 5, resizeMode: 'contain' }} source={{ uri: dataItem.profile_pic_path }} /> :
                                                    <Image style={{ height: 50, width: 50, borderRadius: 5 }} source={require('../../assets/images/ic_placeholder.png')} />}
                                                <Text style={{ color: '#fff', fontFamily: 'Calibri', alignSelf: 'center', fontSize: 18, marginStart: 4, marginRight: 5 }}>{dataItem.first_name}</Text>

                                                <TouchableOpacity activeOpacity={1} onPress={() => this.removeTag(dataItem)}>
                                                    <Image style={{ height: 30, width: 30, resizeMode: 'contain', marginHorizontal: 6 }} source={require('../../assets/images/delete_black.png')} />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                    : null}


                                <FlatList
                                    style={{ marginBottom: 45 }}
                                    scrollEnabled={false}
                                    data={this.state.peopleList}
                                    refreshing={this.state.refreshing}
                                    renderItem={({ item, index }) =>
                                        item.profile_completed == 'true' ? <View style={{ flex: 1, borderBottomColor: '#BBBBBB', flexDirection: 'row', borderBottomWidth: 1, paddingTop: 5, paddingBottom: 5, marginLeft: 8, marginRight: 8 }}>
                                            <TouchableOpacity onPress={() => this._onPressSingle()} style={{ flex: 1, flexDirection: 'row', paddingTop: 5, paddingBottom: 5, alignItems: 'center' }}>
                                                {item.profile_pic_path ?
                                                    <Image style={{ height: 50, width: 50, borderRadius: 5, resizeMode: 'contain' }} source={{ uri: item.profile_pic_path }} />
                                                    : <Image style={{ height: 50, width: 50, borderRadius: 5 }} source={require('../../assets/images/ic_placeholder.png')} />}
                                                <Text style={homeStyle.prodUserText}>{item.first_name}</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => this.addTag(item)} style={{ paddingTop: 5, paddingBottom: 5, justifyContent: 'center' }}>
                                                <Text style={homeStyle.prodUserText}>+ Add user</Text>
                                            </TouchableOpacity>

                                        </View> : null

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