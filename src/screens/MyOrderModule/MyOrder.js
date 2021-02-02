import React, { Component, Fragment } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity, TextInput, ScrollView, FlatList, BackHandler, Dimensions, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import Toasty from '../../elements/Toasty';
import orderStyle from './orderStyle'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import { EventRegister } from 'react-native-event-listeners';
import ApiCaller from '../../constants/ApiCaller';


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default class MyOrder extends Component {
    constructor() {
        super()
        this.state = {
            email: '',
            productList: [],
            // productList: [{ productImage: require('../../assets/images/imgggg.png'), service: 'Vedix Hair Treatment Solution', description: "Vedix is India's first and only first ayurvedic hair care regimen.", status: 'In Progress' },
            // { productImage: require('../../assets/images/product_image2.png'), service: 'Tea Tree Hair Color', description: "Vedix is India's first and only first ayurvedic hair care regimen.", status: 'Delivered' },
            // { productImage: require('../../assets/images/product_image4.png'), service: 'Moisturizing Conditioner', description: "Vedix is India's first and only first ayurvedic hair care regimen.", status: 'Delivered' }],



        }
    }




    componentDidMount() {
        this.props.navigation.addListener(
            'willFocus',
            () => {
                this.myOrderApi()
                handleAndroidBackButton(() => this.props.navigation.goBack())
                StatusBar.setBackgroundColor('#ffffff');
                StatusBar.setBarStyle('dark-content');
            }
        );
    }


    myOrderApi() {
        EventRegister.emit('loader', true)
        ApiCaller.call('appointments/orders', "GET", null, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("my order ===>>>> ", response.myOrders[response.myOrders.length - 1])
                    this.setState({ productList: response.myOrders })
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }



    componentWillUnmount() {
        removeAndroidBackButtonHandler();
    }


    drawerOpen() {
        this.props.navigation.toggleDrawer();
    }


    onClickOrder(item) {
        // if (item.order.status == 3) {
        this.props.navigation.navigate('DeliveredDetail', { orderID: item.order.order_id })
        // }
        // else {
        //     this.props.navigation.navigate('InProgressDetail', { orderID: item.order.order_id })
        // }
    }

    render() {
        return (
            <Fragment>
                {Platform.OS == 'ios' ? <StatusBar barStyle="dark-content" translucent={true} /> : <StatusBar hidden={false} barStyle="dark-content" backgroundColor="white" translucent={false} />}

                <SafeAreaView style={[orderStyle.statusColor]} />
                <SafeAreaView style={orderStyle.bottomColor}>

                    <View style={{ flex: 1 }}>
                        <View style={orderStyle.barStyle}>
                            <TouchableOpacity style={{ paddingLeft: 10 }} activeOpacity={0.9}
                                onPress={() => this.drawerOpen()}>
                                <Image style={{ width: 22, height: 22, resizeMode: 'contain' }} source={require('../../assets/images/menu_black.png')} />
                            </TouchableOpacity>

                            <Text style={[orderStyle.headerText, { paddingTop: Platform.OS === 'ios' ? 8 : 0, marginRight: 15 }]}>My Orders</Text>

                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={[{ flex: 1, marginTop: 10 }]}>
                                {this.state.productList.length > 0 ? <FlatList
                                    scrollEnabled={false}
                                    data={this.state.productList}
                                    contentContainerStyle={{ padding: 5 }}
                                    refreshing={this.state.refreshing}
                                    renderItem={({ item, index }) =>
                                        item.order.line_items[0] ?
                                            <TouchableOpacity activeOpacity={1} style={orderStyle.myOrderView} onPress={() => this.onClickOrder(item)}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={orderStyle.myOrderService}>{item.order.line_items[0].lineItem.title}</Text>
                                                    <Text style={orderStyle.myOrderDes}>{item.order.line_items[0].lineItem.description}</Text>
                                                    {item.order.status == 3 ? <Text style={orderStyle.myOrderStatus}>Delivered</Text>
                                                        : <Text style={orderStyle.myOrderStatus}>In Progress</Text>}
                                                </View>
                                                {item.order.line_items[0].lineItem.itemDetails ? <Image style={orderStyle.myOrderImg} source={{ uri: item.order.line_items[0].lineItem.itemDetails[0].image_path }} />
                                                    : <Image style={orderStyle.myOrderImg} source={require('../../assets/images/ic_placeholder.png')} />}
                                            </TouchableOpacity>
                                            : null
                                    }
                                    keyExtractor={item => item.id}
                                />

                                    :
                                    <View style={[{ flex: 1, height: viewportHeight - 90, justifyContent: 'center' }]}>
                                        <Text style={{ textAlign: 'center', fontSize: 18, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>No order found</Text>
                                    </View>}
                            </View>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }
}
