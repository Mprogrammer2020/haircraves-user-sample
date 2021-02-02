import React, { Component, Fragment } from 'react';
import { View, StyleSheet, Animated, TouchableHighlight, Image, Text, TouchableOpacity, TextInput, ScrollView, FlatList, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import Toasty from '../../elements/Toasty';
import productsStyles from './productsStyles'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import CommonHeader from '../../elements/CommonHeader';
import { SwipeListView } from 'react-native-swipe-list-view';
import { EventRegister } from 'react-native-event-listeners';
import ApiCaller from '../../constants/ApiCaller';



export default class ProductPayment extends Component {

    constructor() {
        super()
        this.state = {
            value1: 'ChangePayment',
            selectedShow: [],
            cardList: [],
            customer: '',
            selectedID: '',
            lastFour : '',
        }
    }



    componentDidMount() {
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
                console.log("ErrorLogin", error);
            })
    }


    componentWillUnmount() {
        removeAndroidBackButtonHandler();
    }



    handleTitleInputSubmit = () => {
        this.setState({ focusInput: true });
    }

    addNewCard() {
        this.props.navigation.navigate('AddCard')
    }



    onCardSelection(item, index) {
        console.log(item.id)
        console.log(item.customer)

        var selectedShow = [];
        selectedShow[index] = !selectedShow[index];
        this.setState({ selectedShow: selectedShow, refreshing: true, selectedID: item.id, customer: item.customer , lastFour : item.last4 });
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


    submitCard() {
        if (this.state.cardList.length == 0) {
            Toasty.show('Please add card')
        }
        else if (this.state.selectedID === '') {
            Toasty.show('Please select card')
        } else {
            this.props.navigation.state.params.onGoBack( this.state.lastFour, this.state.selectedID , this.state.customer);
            this.props.navigation.goBack();
        }
    }



    paymentTab(item, index) {
        if (this.state.value1 == 'ChangePayment') {
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
        }

    }


    render() {
        return (
            <Fragment>
                <SafeAreaView style={[productsStyles.statusColor]} />
                <SafeAreaView style={productsStyles.bottomColor}>

                    <View>
                        <CommonHeader
                            drawable={require('../../assets/images/back_arrow.png')}
                            action={() => this.props.navigation.goBack()}
                            title='Payment'
                            title1='Done'
                            action2={() => this.submitCard()}
                        />

                        <ScrollView showsVerticalScrollIndicator={false}>

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


                            <TouchableOpacity activeOpacity={0.9} style={{ alignSelf: 'flex-end', marginTop: 20, marginRight: 10, padding: 8, width: 160, borderRadius: 50, alignItems: 'center', backgroundColor: '#4CC9CA', }}
                                onPress={() => this.addNewCard()}>
                                <Text style={[productsStyles.buttonTextStyle, { paddingTop: Platform.OS === 'ios' ? 5 : 0 }]}>Add New card</Text>
                            </TouchableOpacity>

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