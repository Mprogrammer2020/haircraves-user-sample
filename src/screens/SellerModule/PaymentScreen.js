import React, { Component, Fragment } from 'react';
import { View, Animated, Image, Text, TouchableOpacity, TouchableHighlight, ScrollView, StyleSheet, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView, Dimensions, ActivityIndicator } from 'react-native';
import Toasty from '../../elements/Toasty';
import sellerStyle from './sellerStyle'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import { SwipeListView } from 'react-native-swipe-list-view';
import CommonHeader from '../../elements/CommonHeader';
import Modal from 'react-native-modal';
import { EventRegister } from 'react-native-event-listeners';
import ApiCaller from '../../constants/ApiCaller';
import WebView from 'react-native-webview';


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');


export default class PaymentScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modalVisible: true,
            webViewVisible: false,
            fromPayPal: false,
            webLoader: false,
            cardList: [],
            selectedShow: [],
            customer: '',
            // cardList: [{ paymentSelect: require('../../assets/images/checked.png'), cardNumber: '9872', cardType: 'Mastercard', expiryDate: '17/23' },
            // { paymentSelect: require('../../assets/images/unchecked.png'), cardNumber: '6582', cardType: 'Mastercard', expiryDate: '17/23' },
            // { paymentSelect: require('../../assets/images/unchecked.png'), cardNumber: '6582', cardType: 'Mastercard', expiryDate: '17/23' }],

            cardBacColor: '#4CC9CA',
            cardTextColor: 'white',
            payBacColor: '#DCDADA',
            payTextColor: 'black',
            value1: 'CardPayment',
            selectedID: '',
            sendGrandTotal: '',
            sendAppointmentID: '',
            provider_id: ''
        }
    }



    componentDidMount() {
        const { navigation } = this.props;
        var grandTotal = navigation.getParam('grandTotal');
        var appointmentID = navigation.getParam('appointmentID');
        var providerID = navigation.getParam('providerID');

        this.setState({ sendGrandTotal: grandTotal, sendAppointmentID: appointmentID, provider_id: providerID })
        this.props.navigation.addListener(
            'willFocus',
            () => {
                this.cardApiCall()
                handleAndroidBackButton(() => this.props.navigation.goBack())
            }
        );

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
                EventRegister.emit('loader', false)
                console.log("ErrorLogin", error);
            })
    }


    componentWillUnmount() {
        removeAndroidBackButtonHandler();
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

    submitPopup(type) {
        this.setState({ modalVisible: false });
        global.myvar = 'MyBookings';
        global.prevScreen = '';
        if (type == 'C') {
            this.props.navigation.navigate('SellerProfile')
        }
        else {
            this.props.navigation.navigate("MyBookingScreen");
        }

    }


    callPayNow() {

        if (this.state.value1 == 'CardPayment') {

            console.log(this.state.cardList.length)

            if (this.state.cardList.length == 0) {
                Toasty.show('Please add card')
            }
            else if (this.state.selectedID === '') {
                Toasty.show('Please select card')
            } else {

                this.payNowClick(false)

            }

        }
        else {

            this.setState({ webViewVisible: 'slow' });

        }

    }

    closeWebModal() {
        this.setState({ webViewVisible: false });
    }

    payNowClick(fromPayPal) {

        var data;

        if (fromPayPal == true) {
            data = JSON.stringify({
                "amount": this.state.sendGrandTotal,
                "customer": this.state.customer,
                'card_id': this.state.selectedID,
                'provider_id': this.state.provider_id,
                'paypal': true,
            })
        }
        else {
            data = JSON.stringify({
                "amount": this.state.sendGrandTotal * 100,
                "customer": this.state.customer,
                'card_id': this.state.selectedID,
                'provider_id': this.state.provider_id,
            })
        }
        console.log(data)

        EventRegister.emit('loader', true)
        ApiCaller.call('appointments/' + this.state.sendAppointmentID + '/makePayment', "POST", data, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    this.setState({ modalVisible: 'slow' });

                    console.log("payment_response", response)
                }
            })
            .catch((error) => {
                EventRegister.emit('loader', false)
                console.log("ErrorLogin", error);
            })
    }


    _onNavigationStateChange(webViewState) {
        console.log("======>>>>>", webViewState.url)
        if (webViewState.url.includes('success') == true) {

            this.payNowClick(true)
            this.setState({ webViewVisible: false, modalVisible: 'slow' });

            /* var splittedurl = webViewState.url.split('/');
             var code = splittedurl[splittedurl.length - 1];               
             console.log("codee===>>>", code) */

        }
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
                EventRegister.emit('loader', false)
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
                <SafeAreaView style={[sellerStyle.statusColor]} />
                <SafeAreaView style={sellerStyle.bottomColor}>
                    <View style={{ flex: 1 }}>
                        <CommonHeader
                            drawable={require('../../assets/images/back_arrow.png')}
                            action={() => this.props.navigation.goBack()}
                            title='Payment'
                            title1='' />
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

                                {this.state.value1 == 'CardPayment' ? <TouchableOpacity activeOpacity={1} style={{ alignSelf: 'flex-end', marginTop: 20, marginRight: 10, padding: 8, width: 160, borderRadius: 50, alignItems: 'center', backgroundColor: '#4CC9CA', }}
                                    onPress={() => this.addNewCard()}>
                                    <Text style={[sellerStyle.buttonTextStyle, { paddingTop: Platform.OS === 'ios' ? 5 : 0, fontSize: 16, }]}>Add New Card</Text>
                                </TouchableOpacity> : null}
                            </View>


                        </ScrollView>
                        <TouchableOpacity onPress={() => this.callPayNow()} activeOpacity={1} style={{ justifyContent: 'center', alignItems: 'center', width: '100%', backgroundColor: '#4CC9CA', height: 50 }}>
                            <Text style={{ textAlign: 'center', paddingRight: 10, fontSize: 18, marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Md', color: 'white', paddingTop: Platform.OS === 'ios' ? 8 : 0 }}>Pay Now</Text>
                        </TouchableOpacity>
                    </View>
                    <Modal
                        isVisible={this.state.modalVisible === 'slow'}
                        animationInTiming={1000}
                        animationOutTiming={1000}
                        backdropTransitionInTiming={800}
                        backdropTransitionOutTiming={800}>

                        <View style={{ height: 'auto', borderRadius: 20, backgroundColor: 'white', alignItems: 'center', marginLeft: 20, marginRight: 20 }}>


                            <Image style={[sellerStyle.appIcon, { marginTop: 20, height: 80 }]} source={require('../../assets/images/rounded_checked.png')} />

                            <Text style={[sellerStyle.popText, { fontSize: 18, marginTop: 10, textAlign: 'center', fontFamily: 'HelveticaNeueLTStd-Md' }]} >Congratulations</Text>
                            <Text style={[sellerStyle.popText, { fontSize: 16, marginTop: 5, textAlign: 'center', fontFamily: 'HelveticaNeueLTStd-Roman' }]} >Your appointment has been booked successfully</Text>

                            <View style={{ marginTop: 10, marginBottom: 25, width: '100%', alignItems: 'center' }}>
                                {global.prevScreen == 'profilescreen' ?
                                    <TouchableOpacity activeOpacity={1} style={[sellerStyle.buttonStyle, { width: '80%', borderColor: '#4CC9CA', borderWidth: 1 }]}
                                        onPress={() => this.submitPopup('C')}>
                                        <Text style={sellerStyle.buttonTextStyle}>Continue Booking</Text>
                                    </TouchableOpacity>
                                    : null}
                                <TouchableOpacity activeOpacity={1} style={[sellerStyle.buttonStyle, { width: '80%', borderColor: '#4CC9CA', borderWidth: 1, marginTop: 20 }]}
                                    onPress={() => this.submitPopup('V')}>
                                    <Text style={sellerStyle.buttonTextStyle}>View Appointment</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>



                    <Modal
                        isVisible={this.state.webViewVisible === 'slow'}
                        animationInTiming={1000}
                        animationOutTiming={1000}
                        backdropTransitionInTiming={800}
                        backdropTransitionOutTiming={800}
                        style={{ margin: 0 }}
                        onRequestClose={() => { this.setState({ webViewVisible: false }) }}>

                        <View style={{ height: viewportHeight - 50 }}>

                            <TouchableOpacity activeOpacity={1} onPress={() => this.closeWebModal()}
                                style={{ position: 'absolute', right: 10, top: 10, zIndex: 99999 }}>
                                <Image style={{ height: 30, width: 30, borderRadius: 15, backgroundColor: 'white' }} source={require('../../assets/images/cross.png')} />
                            </TouchableOpacity>


                            <View style={{ height: viewportHeight - 50, backgroundColor: 'white' }}>


                                {this.state.webLoader ?
                                    <View style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator size="large" color={'#4CC9CA'} />
                                    </View>
                                    :
                                    null
                                }

                                <WebView style={{ width: '100%', height: '100%', }}
                                    source={{ uri: 'http://198.211.110.165:3000/paypal?price=' + this.state.sendGrandTotal }}
                                    onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                                    onLoadStart={() => this.setState({ webLoader: true })}
                                    onLoadEnd={() => this.setState({ webLoader: false })}
                                />

                            </View>
                        </View>
                    </Modal>

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
                                        <Text style={sellerStyle.buttonTextStyle}>Add New card</Text>
                                    </TouchableOpacity> */}