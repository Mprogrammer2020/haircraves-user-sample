import React, { Component, Fragment } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity, TextInput, ScrollView, FlatList, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import Toasty from '../../elements/Toasty';
import productsStyles from './../ProductsModule/productsStyles'
import CommonHeader from '../../elements/CommonHeader';
import Modal from 'react-native-modal';


export default class HomeCart extends Component {

    constructor() {
        super()
        this.state = {
            email: '',
            itemCount : 1,
            cardItem: [
                { deleteIcon: require('../../assets/images/delete_black.png'), service: 'Vedix Hair Treatment Solution', price: '10', value: '1' },
                { deleteIcon: require('../../assets/images/delete_black.png'), service: 'Tea Tree Hair Color', price: '30', value: '2' }
            ],

            isChecked: 0,


        }
    }



    componentDidMount() {
       
    }


    componentWillUnmount() {
       
    }

    componentWillReceiveProps() {
        StatusBar.setBackgroundColor('#ffffff');
        StatusBar.setBarStyle('dark-content');
    }


    handleTitleInputSubmit = () => {
        this.setState({ focusInput: true });
    }


    _onPress(screen) {
        this.props.navigation.navigate(screen)
    }

    placeOrderCall() {
        this.setState({ modalVisible: 'slow' });
       
    }

    verifyOK() {
        this.setState({ modalVisible: false });
        global.myvar = 'Home'
        this.props.navigation.navigate("MyOrder");
    }

    onClickCard() {
        this.setState({ isChecked: 0 })
    }

    onClickPaypal() {
        this.setState({ isChecked: 1 })

    }

    _incrementCount() {    
        var countIncrement = this.state.itemCount
        this.setState({itemCount : countIncrement + 1})
    }

    _decrementCount() {
        var countDecrement = this.state.itemCount       
        this.setState({itemCount :  countDecrement != 1 ? countDecrement - 1 : 1})
    }


    render() {
        return (
            <Fragment>
                {Platform.OS == 'ios' ? <StatusBar barStyle="dark-content" translucent={true} /> : <StatusBar hidden={false} barStyle="dark-content" backgroundColor="white" translucent={false} />}
                <SafeAreaView style={[productsStyles.statusColor]} />
                <SafeAreaView style={productsStyles.bottomColor}>

                    <View>
                        <CommonHeader
                            title='Cart' />

                        <ScrollView style={{ height: '95%' }} showsVerticalScrollIndicator={false}>

                            <View>
                                <View style={[{ flex: 1 }]}>

                                    <FlatList
                                        scrollEnabled={false}
                                        data={this.state.cardItem}
                                        contentContainerStyle={{ marginTop: 20 }}
                                        refreshing={this.state.refreshing}
                                        renderItem={({ item, index }) =>
                                            <View style={{ flexDirection: 'row', padding: 10, flex: 1, paddingTop: 10, paddingBottom: 10, paddingTop: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1 }}>
                                                <Image style={{ height: 30, width: 30 }} source={item.deleteIcon} />

                                                <View style={{ flex: 1, paddingLeft: 10 }}>
                                                    <Text style={{ flex: 1, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md', justifyContent: 'center' }}>{item.service}</Text>
                                                    <Text style={{ flex: 1, fontSize: 14, color: 'grey', fontFamily: 'HelveticaNeueLTStd-Roman', justifyContent: 'center' }}>${item.price}</Text>
                                                </View>


                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman', marginRight: 5 , marginTop : Platform.OS === 'ios' ? 5 :0 }}>{item.value}</Text>

                                                    <TouchableOpacity activeOpacity={1} style={{ height: 30, width: 30, borderBottomLeftRadius: 50, borderTopLeftRadius: 50, backgroundColor: '#4CC9CA', alignItems: 'center', padding: 5, marginRight: 1 }}>
                                                        <Image style={{ height: 20, width: 10, resizeMode: 'contain', marginLeft: 5 }} source={require('../../assets/images/minus.png')} />
                                                    </TouchableOpacity>

                                                    <TouchableOpacity activeOpacity={1} style={{ height: 30, width: 30, borderTopRightRadius: 50, borderBottomRightRadius: 50, backgroundColor: '#4CC9CA', alignItems: 'center', padding: 5, marginLeft: 1 }}>
                                                        <Image style={{ height: 20, width: 10, resizeMode: 'contain', marginRight: 3 }} source={require('../../assets/images/plus.png')} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                        }
                                        keyExtractor={item => item.id}
                                    />



                                    <View style={{ padding: 10, paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 5 : 10, borderBottomColor: '#d7dada', borderBottomWidth: 1, alignItems: 'center' }}>

                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ flex: 1, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Sub Total</Text>
                                            <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman', paddingBottom: 4 }}>$ 70</Text>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ flex: 1, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Service Tax</Text>
                                            <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman', paddingBottom: 4 }}>$ 5%</Text>
                                        </View>

                                    </View>

                                    <View style={{ padding: 10, paddingTop: 10, paddingBottom: 10, borderBottomColor: '#d7dada', borderBottomWidth: 1, alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}>
                                            <Text style={{ flex: 1, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md', textTransform: 'uppercase',marginTop: Platform.OS === 'ios' ? 8 : 0, }}>Grand Total</Text>
                                            <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md', paddingTop: 4, paddingBottom: 4 }}>$ 75</Text>
                                        </View>
                                    </View>


                                    <View style={{ padding: 10 }}>
                                        <Text style={{ flex: 1, fontSize: 12, color: '#BBBBBB', fontFamily: 'HelveticaNeueLTStd-Md', textTransform: 'uppercase' }}>Payment</Text>

                                        <View style={{ paddingTop: 10, alignItems: 'center', flexDirection: 'row' }}>

                                            <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'column' }} onPress={() => this.onClickCard()}>
                                                <View style={{ width: 100, height: 100, backgroundColor: '#dcdcdc', borderWidth: 2, borderColor: this.state.isChecked == 0 ? '#4CC9CA' : '#dcdcdc', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image style={{ height: 70, width: 70, resizeMode: 'contain' }} source={require('../../assets/images/card_ui.png')} />
                                                </View>
                                                <Text style={{ flex: 1, marginTop: 5, textAlign: 'center', fontSize: 14, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt' }}>Card</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'column', paddingLeft: 10 }} onPress={() => this.onClickPaypal()}>
                                                <View style={{ width: 100, height: 100, backgroundColor: '#dcdcdc', borderWidth: 2, borderColor: this.state.isChecked == 1 ? '#4CC9CA' : '#dcdcdc', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                                                    <Image style={{ height: 70, width: 70, resizeMode: 'contain' }} source={require('../../assets/images/paypal.png')} />
                                                </View>
                                                <Text style={{ flex: 1, marginTop: 5, textAlign: 'center', fontSize: 14, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt' }}>PayPal</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{ paddingTop: 10, paddingBottom: 10, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: 'grey' }}>
                                            <Text style={{ flex: 1, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md' }}>Selected Payment Method</Text>

                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                <View style={{ flex: 1, flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                                                    <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../assets/images/card_ui.png')} />
                                                    <Text style={{ marginLeft: 5, marginTop: 2, textAlign: 'center', fontSize: 12, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt' }}>{'\u2B24'}{'\u2B24'}{'\u2B24'}{'\u2B24'}  {'\u2B24'}{'\u2B24'}{'\u2B24'}{'\u2B24'}  {'\u2B24'}{'\u2B24'}{'\u2B24'}{'\u2B24'}  9872</Text>
                                                </View>
                                                <Text onPress={() => this._onPress('ProductPayment')} style={{ alignSelf: 'center', marginTop: 5, textAlign: 'center', fontSize: 14, color: '#4CC9CA', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Change Card</Text>
                                            </View>


                                        </View>


                                        <View style={{ paddingTop: 10, paddingBottom: 10, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: 'grey' }}>
                                            <Text style={{ flex: 1, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Delivery Address</Text>

                                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                                <View style={{ flex: 1, flexDirection: 'row', marginTop: 5, paddingRight: 5, alignItems: 'center' }}>
                                                    <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../assets/images/address.png')} />
                                                    <Text numberOfLines={1} style={{ flex: 1, marginTop: 2, fontSize: 12, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt' }}>51952 Copper Creek Ct, New Baltimore....</Text>
                                                </View>
                                                <Text onPress={() => this._onPress('AddressScreen')} style={{ marginTop: 5, alignSelf: 'center', fontSize: 14, color: '#4CC9CA', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Change Address</Text>
                                            </View>
                                        </View>
                                    </View>


                                    <TouchableOpacity activeOpacity={1} onPress={() => this.placeOrderCall()} style={{ padding: 10, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', width: '95%', backgroundColor: '#4CC9CA', margin: 30 }}>
                                        <Text style={productsStyles.buttonTextStyle}>Place Order</Text>
                                    </TouchableOpacity>


                                </View>

                            </View>
                        </ScrollView>
                        <Modal
                            isVisible={this.state.modalVisible === 'slow'}
                            animationInTiming={1000}
                            animationOutTiming={1000}
                            backdropTransitionInTiming={800}
                            backdropTransitionOutTiming={800}>

                            <View style={{ height: 'auto', borderRadius: 20, backgroundColor: 'white', alignItems: 'center', marginLeft: 25, marginRight: 25 }}>

                                <Image style={[productsStyles.appIcon, { marginTop: 20, height: 80 }]} source={require('../../assets/images/rounded_checked.png')} />

                                <Text style={[productsStyles.popText, { marginTop: 10 }]} >Congratulations</Text>
                                <Text style={[productsStyles.popText, { fontFamily: 'HelveticaNeueLTStd-Lt', fontSize: 16, textAlign: 'center', marginTop: 5 }]}>Your order has been placed {'\n'} successfully</Text>

                                <TouchableOpacity activeOpacity={1} style={[productsStyles.buttonStyle, { width: 250, marginTop: 20, marginBottom: 25 }]}
                                    onPress={() => this.verifyOK()}>
                                    <Text style={productsStyles.buttonTextStyle}>Okay</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }
}

