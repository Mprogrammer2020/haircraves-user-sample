import React, { Component, Fragment } from 'react';
import { View, Animated, Image, Text, TouchableOpacity, TouchableHighlight, ScrollView, StyleSheet, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import Toasty from '../../elements/Toasty';
import homeStyle from './homeStyle'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import { SwipeListView } from 'react-native-swipe-list-view';
import { EventRegister } from 'react-native-event-listeners';
import ApiCaller from '../../constants/ApiCaller';
import { requestOneTimePayment, requestBillingAgreement } from 'react-native-paypal';


export default class HomePayment extends Component {

    constructor(props) {
        super(props)
        this.state = {
            cardList: [],
            cardBacColor: '#4CC9CA',
            cardTextColor: 'white',
            payBacColor: '#DCDADA',
            payTextColor: 'black',
            value1: 'CardPayment',
            selectedShow: [],
            customer: '',
            selectedID: '',
        }
    }



    componentDidMount() {
        this.props.navigation.addListener(
            'willFocus',
            () => {
                this.cardApiCall()
                handleAndroidBackButton(() => this.props.navigation.goBack())
                StatusBar.setBackgroundColor('#ffffff');
                StatusBar.setBarStyle('dark-content');
            }
        );

    }

    componentWillUnmount() {
        removeAndroidBackButtonHandler();
    }

    cardApiCall() {
        // EventRegister.emit('loader', true)
        ApiCaller.call('cards/all', "GET", null, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("All Cards===>>>>", response)
                    this.setState({ cardList: response.cards.data })
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }

    handleTitleInputSubmit = () => {
        this.setState({ focusInput: true });
    }

    drawerOpen() {
        this.props.navigation.toggleDrawer();
    }

    onClickCard() {
        this.setState({
            cardBacColor: '#4CC9CA',
            cardTextColor: 'white',
            payBacColor: '#DCDADA',
            payTextColor: 'black',
            value1: 'CardPayment',
        })
    }

    onClickPaypal() {
        this.setState({
            cardBacColor: '#DCDADA',
            cardTextColor: 'black',
            payBacColor: '#4CC9CA',
            payTextColor: 'white',
            value1: 'PayPal',
        })
    }

    addNewCard() {
        this.props.navigation.navigate('AddCard')
    }

    deleteMethod(item) {
        EventRegister.emit('loader', true)
        ApiCaller.call('cards/' + item.item.id, "DELETE", null, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    this.cardApiCall()
                    console.log("All Cards===>>>>", response)
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })

    }


    onCardSelection(item, index) {
        console.log(item.id)
        console.log(item.customer)

        var selectedShow = [];
        selectedShow[index] = !selectedShow[index];
        this.setState({ selectedShow: selectedShow, refreshing: true, selectedID: item.id, customer: item.customer });
    }


    payPal() {
        ApiCaller.call('users/getClientToken', 'GET', false, true)
            .then(async (response) => {
                console.log("responseeee", response.token)
                this.payPAllllll(response.token)
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })


    }


    payPAllllll(responseJson) {
        const { token } = 'A21AAKCyCkCuJ41xrbus-AZbDgOReTdhprz-wzdxAuK6ApICUPW9j2dql9-4s1_pd5qL7sweMNW6i9StZS3kInIjOTe8Wdyhw';
        const {
            nonce,
            payerId,
            email,
            firstName,
            lastName,
            phone,
        } = requestOneTimePayment('sandbox_9dbg82cq_dcpspy2brwdjr3qn', {
            amount: '5', // required
            // any PayPal supported currency (see here: https://developer.paypal.com/docs/integration/direct/rest/currency-codes/#paypal-account-payments)
            currency: 'USD',
            // any PayPal supported locale (see here: https://braintree.github.io/braintree_ios/Classes/BTPayPalRequest.html#/c:objc(cs)BTPayPalRequest(py)localeCode)
            localeCode: 'en_US',
            shippingAddressRequired: false,
            userAction: 'commit', // display 'Pay Now' on the PayPal review page
            // one of 'authorize', 'sale', 'order'. defaults to 'authorize'. see details here: https://developer.paypal.com/docs/api/payments/v1/#payment-create-request-body
            intent: 'authorize',
        });
        // console.log(nonce, payerId, email, firstName, lastName, phone);
        // alert('Transaction Successful');

    }




    paymentTab(item, index) {
        if (this.state.value1 == 'CardPayment') {
            return <TouchableHighlight
                style={styles.rowFront}
                underlayColor={'#A8A8A8'}>
                <Animated.View>
                    <View style={{ flex: 1 }}>

                        <View style={{ flexDirection: 'column' }}>

                            <View style={{ flex: 1, flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#d7dada', alignItems: 'center' }}>
                                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.onCardSelection(item, index)}>
                                    {this.state.selectedShow[index] == true ? <Image style={{ height: 30, width: 30, marginRight: 10 }} source={require('../../assets/images/checked.png')} />
                                        : <Image style={{ height: 30, width: 30, marginRight: 10 }} source={require('../../assets/images/unchecked.png')} />}
                                </TouchableOpacity>
                                <View>
                                    <Text style={{ paddingTop: 5, paddingBottom: 5, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md' }}>{'\u2B24'}{'\u2B24'}{'\u2B24'}{'\u2B24'} {'\u2B24'}{'\u2B24'}{'\u2B24'}{'\u2B24'} {'\u2B24'}{'\u2B24'}{'\u2B24'}{'\u2B24'} {item.last4}</Text>
                                    <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5 }}>
                                        <Text style={{ fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'black' }}>{item.brand}</Text>
                                        <Text style={{ fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'black', marginLeft: 5, marginRight: 5 }}>-</Text>
                                        <Text numberOfLines={1} style={{ fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey' }}>{item.exp_month}/{item.exp_year}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </TouchableHighlight>
        } else {
            return <View style={{ flex: 1, }}>


            </View>
        }


    }


    render() {
        return (
            <Fragment>
                {Platform.OS == 'ios' ? <StatusBar barStyle="dark-content" translucent={true} /> : <StatusBar hidden={false} barStyle="dark-content" backgroundColor="white" translucent={false} />}

                <SafeAreaView style={[homeStyle.statusColor]} />
                <SafeAreaView style={homeStyle.bottomColor}>
                    <View style={{ flex: 1 }}>
                        <View style={homeStyle.barStyle}>
                            <TouchableOpacity style={{ paddingLeft: 10 }} activeOpacity={0.9}
                                onPress={() => this.drawerOpen()}>
                                <Image style={{ width: 22, height: 22, resizeMode: 'contain' }} source={require('../../assets/images/menu_black.png')} />
                            </TouchableOpacity>

                            <Text style={[homeStyle.headerText, { paddingTop: Platform.OS === 'ios' ? 8 : 0, marginRight: 15 }]}>Payment</Text>

                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={[{ flex: 1 }]}>
                                <View style={{ height: 45, marginTop: 15, flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>

                                    <TouchableOpacity activeOpacity={1} style={[{ backgroundColor: this.state.cardBacColor, width: '50%', height: 45, alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 30, borderBottomLeftRadius: 30 }]} onPress={this.onClickCard.bind(this)}>
                                        <View style={[{ alignItems: 'center' }]}>
                                            <Text style={[{ fontFamily: 'HelveticaNeueLTStd-Roman', color: this.state.cardTextColor, fontSize: 16, paddingTop: Platform.OS === 'ios' ? 8 : 0, }]}>Card</Text>
                                        </View>
                                    </TouchableOpacity>


                                    <TouchableOpacity activeOpacity={1} style={[{ backgroundColor: this.state.payBacColor, width: '50%', alignItems: 'center', justifyContent: 'center', height: 45, borderTopRightRadius: 30, borderBottomRightRadius: 30 }]} onPress={this.onClickPaypal.bind(this)}>
                                        <View style={[{ alignItems: 'center' }]} >
                                            <Text style={[{ fontFamily: 'HelveticaNeueLTStd-Roman', color: this.state.payTextColor, fontSize: 16, paddingTop: Platform.OS === 'ios' ? 8 : 0, }]}>PayPal</Text>
                                        </View>
                                    </TouchableOpacity>

                                </View>





                                <View style={{ flex: 1, marginTop: 20, borderBottomColor: this.state.value1 == 'CardPayment' ? '#A8A8A8' : null, borderBottomWidth: this.state.value1 == 'CardPayment' ? 0.3 : null }}>

                                    <SwipeListView
                                        disableRightSwipe
                                        data={this.state.cardList}
                                        previewOpenValue={-10}
                                        previewOpenDelay={3000}
                                        renderItem={({ item, index }) =>
                                            this.paymentTab(item, index)
                                        }
                                        renderHiddenItem={(item) => (
                                            <View style={styles.rowBack}>
                                                <Text></Text>
                                                <Animated.View>
                                                    <TouchableOpacity style={{ marginRight: 25 }} activeOpacity={1} onPress={() => this.deleteMethod(item)}>
                                                        <Image style={{ width: 40, height: 40, resizeMode: 'contain' }} source={require('../../assets/images/dlt_red.png')} />
                                                    </TouchableOpacity>
                                                </Animated.View>
                                            </View>
                                        )}
                                        rightOpenValue={-75}

                                    />


                                </View>

                                {this.state.value1 == 'CardPayment' ?
                                    <TouchableOpacity activeOpacity={1} style={{ alignSelf: 'flex-end', marginTop: 20, marginRight: 10, padding: 8, width: 160, borderRadius: 50, alignItems: 'center', backgroundColor: '#4CC9CA', }}
                                        onPress={() => this.addNewCard()}>
                                        <Text style={homeStyle.buttonTextStyle}>Add New card</Text>
                                    </TouchableOpacity>
                                    :
                                    null}

                                {/* <TouchableOpacity activeOpacity={1} style={{ alignSelf: 'flex-end', marginTop: 20, marginRight: 10, padding: 8, width: 160, borderRadius: 50, alignItems: 'center', backgroundColor: '#4CC9CA', }}
                                         onPress={() => this.payPal()}>
                                         <Text style={homeStyle.buttonTextStyle}>Add New card</Text>
                                     </TouchableOpacity>} */}


                            </View>

                        </ScrollView>
                    </View>

                </SafeAreaView>
            </Fragment>
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




{/* <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 20, marginRight: 10, padding: 8, width: 160, borderRadius: 50, alignItems: 'center', backgroundColor: '#4CC9CA', }}
                                        onPress={() => this.addNewCard()}>
                                        <Text style={homeStyle.buttonTextStyle}>Add New card</Text>
                                    </TouchableOpacity> */}