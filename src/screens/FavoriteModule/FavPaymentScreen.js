import React, { Component, Fragment } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity, TextInput, ScrollView, FlatList, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import Toasty from '../../elements/Toasty';
import favoriteStyles from './favoriteStyles'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';


export default class FavPaymentScreen extends Component {

    constructor() {
        super()
        this.state = {
            cardList: [{ paymentSelect: require('../../assets/images/unchecked.png'), cardNumber: '9872', cardType: 'Mastercard', expiryDate: '17/23' },
            { paymentSelect: require('../../assets/images/unchecked.png'), cardNumber: '6582', cardType: 'Mastercard', expiryDate: '17/23' },
            { paymentSelect: require('../../assets/images/unchecked.png'), cardNumber: '6582', cardType: 'Mastercard', expiryDate: '17/23' }],

            cardBacColor: '#4CC9CA',
            cardTextColor: 'white',
            payBacColor: '#DCDADA',
            payTextColor: '#6C6A6A',
            value1: 'CardPayment',
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


    onClickCard() {
        this.setState({
            cardBacColor: '#4CC9CA',
            cardTextColor: 'white',
            payBacColor: '#DCDADA',
            payTextColor: '#6C6A6A',
            value1: 'CardPayment',
        })
    }

    onClickPaypal() {
        this.setState({
            cardBacColor: '#DCDADA',
            cardTextColor: '#6C6A6A',
            payBacColor: '#4CC9CA',
            payTextColor: 'white',
            value1: 'PayPal',
        })
    }



    paymentTab() {
        if (this.state.value1 == 'CardPayment') {
            return <View style={{ flex: 1 }}>

                <View style={{ flexDirection: 'column' }}>

                    <FlatList
                        scrollEnabled={false}
                        contentContainerStyle={{ marginTop: 20 }}
                        data={this.state.cardList}
                        refreshing={this.state.refreshing}
                        renderItem={({ item, index }) =>
                            <View style={{ flex: 1, flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#d7dada', alignItems: 'center' }}>
                                <TouchableOpacity style={{ flexDirection: 'row' }}>
                                    <Image style={{ height: 30, width: 30, marginRight: 10 }} source={item.paymentSelect} />
                                </TouchableOpacity>
                                <View>
                                    <Text style={{ paddingTop: 5, paddingBottom: 5, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md' }}>{'\u2B24'}{'\u2B24'}{'\u2B24'}{'\u2B24'} {'\u2B24'}{'\u2B24'}{'\u2B24'}{'\u2B24'} {'\u2B24'}{'\u2B24'}{'\u2B24'}{'\u2B24'} {item.cardNumber}</Text>
                                    <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5 }}>
                                        <Text style={{ fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'black' }}>{item.cardType}</Text>
                                        <Text style={{ fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'black', marginLeft: 5, marginRight: 5 }}>-</Text>
                                        <Text numberOfLines={1} style={{ fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey' }}>{item.expiryDate}</Text>
                                    </View>
                                </View>
                            </View>
                        }
                        keyExtractor={item => item.id}
                    />

                    <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 20, marginRight: 10, padding: 8, width: 160, borderRadius: 50, alignItems: 'center', backgroundColor: '#4CC9CA', }}
                        onPress={() => this.payPal()}>
                        <Text style={favoriteStyles.buttonTextStyle}>Add New card</Text>
                    </TouchableOpacity>
                </View>
            </View>
        } else {
            return <View style={{ flex: 1, }}>


            </View>
        }


    }


    render() {
        return (
            <Fragment>

                <SafeAreaView style={[favoriteStyles.statusColor]} />
                <SafeAreaView style={favoriteStyles.bottomColor}>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={[{ flex: 1 }]}>
                            <View style={{ height: 45, marginTop: 15, flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>

                                <TouchableOpacity activeOpacity={1} style={[{ backgroundColor: this.state.cardBacColor, width: '50%', height: 45, alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 30, borderBottomLeftRadius: 30 }]} onPress={this.onClickCard.bind(this)}>
                                    <View style={[{ alignItems: 'center' }]}>
                                        <Text style={[{ fontFamily: 'HelveticaNeueLTStd-Roman', color: this.state.cardTextColor, fontSize: 16 }]}>Card</Text>
                                    </View>
                                </TouchableOpacity>


                                <TouchableOpacity activeOpacity={1} style={[{ backgroundColor: this.state.payBacColor, width: '50%', alignItems: 'center', justifyContent: 'center', height: 45, borderTopRightRadius: 30, borderBottomRightRadius: 30 }]} onPress={this.onClickPaypal.bind(this)}>
                                    <View style={[{ alignItems: 'center' }]} >
                                        <Text style={[{ fontFamily: 'HelveticaNeueLTStd-Roman', color: this.state.payTextColor, fontSize: 16 }]}>Paypal</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>

                            <View style={{ width: '100%', height: '100%' }}>
                                {this.paymentTab()}
                            </View>
                        </View>

                    </ScrollView>

                </SafeAreaView>
            </Fragment>
        )
    }
}

