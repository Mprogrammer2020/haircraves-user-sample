import React, { Component, Fragment } from 'react';
import { View, StyleSheet, Animated, Image, Text, TouchableOpacity, TouchableHighlight, ScrollView, FlatList, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import Toasty from '../../elements/Toasty';
import productsStyles from './productsStyles'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import CommonHeader from '../../elements/CommonHeader';
import { SwipeListView } from 'react-native-swipe-list-view';
import { EventRegister } from 'react-native-event-listeners';
import ApiCaller from '../../constants/ApiCaller';


export default class AddressScreen extends Component {

    constructor() {
        super()
        this.state = {
            value1: 'Address',
            addressList: [],
            selectedShow: [],
            selectedID: '',
            sendAddress: '',
            // addressList: [{ paymentSelect: require('../../assets/images/unchecked.png'), address: '51952 Copper Creek Ct, New Baltimore, MN, 48047' },
            // { paymentSelect: require('../../assets/images/unchecked.png'), address: '9799 Brighton Ln, Eden Prairie, MN, 55347' },
            // { paymentSelect: require('../../assets/images/unchecked.png'), address: '502 Planters Run, Elizabeth City, NC, 27909' }],

        }
    }



    componentDidMount() {
        this.props.navigation.addListener(
            'willFocus',
            () => {
                this.getAddressApi();
                handleAndroidBackButton(() => this.props.navigation.goBack())
            }
        );
    }


    getAddressApi() {
        // EventRegister.emit('loader', true)
        ApiCaller.call('users/address', "GET", null, true)
            .then((response) => {
                // EventRegister.emit('loader', false)
                if (response) {
                    console.log("portfolio user ===>>>> ", response.addresses)

                    this.setState({ addressList: response.addresses })
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


    addAddressScreen() {
        this.props.navigation.navigate('AddAddressScreen')
    }



    deleteAddress(item) {
        ApiCaller.call('users/address/' + item.item.id, 'DELETE', null, true)
            .then((response) => {
                if (response) {
                    this.getAddressApi();
                    console.log("All Cards===>>>>", response)
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }

    editAddress(item) {
        console.log(item.item.id)
        this.props.navigation.navigate('EditAddressScreen', { addressID: item.item.id })

    }



    onClickAddress(item, index) {
        var selectedShow = [];
        selectedShow[index] = !selectedShow[index];
        this.setState({ selectedShow: selectedShow, refreshing: true, selectedID: item.id, sendAddress: item.address });
    }


    submitAddress() {
        if (this.state.addressList.length == 0) {
            Toasty.show('Please add address');
        }
        else if (this.state.sendAddress == '') {
            Toasty.show('Please select address');
        } else {
            this.props.navigation.state.params.onGoBack(this.state.sendAddress);
            this.props.navigation.goBack();
        }

    }


    addressTab(item, index) {
        if (this.state.value1 == 'Address') {
            return <TouchableHighlight
                style={styles.rowFront}
                underlayColor={'#A8A8A8'}>
                <Animated.View>
                    <View style={{ flex: 1, flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#d7dada', alignItems: 'center' }}>
                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.onClickAddress(item, index)}>
                            {/* <Image style={{ height: 30, width: 30, marginRight: 10 }} source={item.paymentSelect} /> */}
                            {this.state.selectedShow[index] == true ? <Image style={{ height: 30, width: 30, marginRight: 10 }} source={require('../../assets/images/checked.png')} />
                                : <Image style={{ height: 30, width: 30, marginRight: 10 }} source={require('../../assets/images/unchecked.png')} />}
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <Text style={{ paddingTop: 5, paddingBottom: 5, fontSize: 12, color: '#BBBBBB', fontFamily: 'HelveticaNeueLTStd-Md', textTransform: 'uppercase' }}>Deliver To</Text>
                            <Text style={{ paddingBottom: 5, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt' }}>{item.address}</Text>
                        </View>
                    </View>
                </Animated.View>
            </TouchableHighlight>
        }

    }


    render() {
        return (
            <Fragment>
                {Platform.OS == 'ios' ? <StatusBar barStyle="dark-content" translucent={true} /> : <StatusBar hidden={false} barStyle="dark-content" backgroundColor="white" translucent={false} />}

                <SafeAreaView style={[productsStyles.statusColor]} />
                <SafeAreaView style={productsStyles.bottomColor}>
                    <View>
                        <CommonHeader
                            drawable={require('../../assets/images/back_arrow.png')}
                            action={() => this.props.navigation.goBack()}
                            title='Address'
                            title1='Done'
                            action2={() => this.submitAddress()}
                        />
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={[{ flex: 1 }]}>

                                <SwipeListView
                                    disableRightSwipe
                                    data={this.state.addressList}
                                    previewOpenValue={-10}
                                    previewOpenDelay={3000}
                                    renderItem={({ item, index }) =>
                                        this.addressTab(item, index)
                                    }
                                    renderHiddenItem={(item) => (
                                        <View style={styles.rowBack}>
                                            <Text></Text>
                                            <Animated.View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <TouchableOpacity style={{ marginRight: 10 }} activeOpacity={1} onPress={() => this.editAddress(item)}>
                                                        <Image style={{ width: 40, height: 40, resizeMode: 'contain' }} source={require('../../assets/images/edit.png')} />
                                                    </TouchableOpacity>

                                                    <TouchableOpacity style={{ marginRight: 10 }} activeOpacity={1} onPress={() => this.deleteAddress(item)}>
                                                        <Image style={{ width: 40, height: 40, resizeMode: 'contain' }} source={require('../../assets/images/dlt_red.png')} />
                                                    </TouchableOpacity>
                                                </View>
                                            </Animated.View>
                                        </View>
                                    )}
                                    rightOpenValue={-100}

                                />


                            </View>


                            <TouchableOpacity onPress={() => this.addAddressScreen()} activeOpacity={0.9} style={{ alignSelf: 'flex-end', marginTop: 20, marginRight: 10, padding: 8, width: 180, borderRadius: 50, alignItems: 'center', backgroundColor: '#4CC9CA', }}>
                                <Text style={[productsStyles.buttonTextStyle, { fontSize: 15, fontFamily: 'HelveticaNeueLTStd-Md', paddingTop: Platform.OS === 'ios' ? 5 : 0 }]}>Add New Address</Text>
                            </TouchableOpacity>
                        </ScrollView>

                    </View>
                </SafeAreaView>
            </Fragment >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        backgroundColor: 'white',
        borderBottomColor: '#A8A8A8',
        borderBottomWidth: 0.3,

    },
    rowBack: {
        backgroundColor: 'white',
        // height: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },

    backRightBtnRight: {
        backgroundColor: '#fff',
        right: 0,
    },
    flatlistchild: {
        fontSize: 12,
        color: '#263847'
    },
    flatlisttime: {
        fontSize: 12,
        color: '#263847'
    },
    flatListItem: {
        fontSize: 14,
        color: 'black'
    }
});