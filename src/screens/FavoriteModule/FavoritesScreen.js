import React, { Component, Fragment } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity, TextInput, Dimensions, ScrollView, FlatList, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import Toasty from '../../elements/Toasty';
import favoriteStyles from './favoriteStyles'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import StarRating from 'react-native-star-rating';
import { EventRegister } from 'react-native-event-listeners';
import ApiCaller from '../../constants/ApiCaller';
import NavigationService from '../../routes/NavigationService';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
export default class FavoriteScreen extends Component {

    constructor() {
        super()
        this.state = {
            email: '',
            providerList: [],
            productList: [],
            serviceBacColor: '#4CC9CA',
            serviceTextColor: 'white',
            productBacColor: '#DCDADA',
            productTextColor: 'back',
            value1: 'ServiceProvides',
        }
    }



    componentDidMount() {
        this.props.navigation.addListener(
            'willFocus',
            () => {
                this.state.value1 == 'ServiceProvides' ? this.getServiceApi() : this.getProductApi();

                handleAndroidBackButton(() => this.props.navigation.goBack())
                StatusBar.setBackgroundColor('#ffffff');
                StatusBar.setBarStyle('dark-content');
            }
        );
    }


    getServiceApi() {
        EventRegister.emit('loader', true)
        ApiCaller.call('users/favoriteProviders', "GET", null, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    // console.log("portfolio service ===>>>>", response)

                    console.log("Favorite Providers ===>>>>", response.providersDetails)
                    this.setState({ providerList: response.providersDetails })

                }
            })
            .catch((error) => {
                console.log("Error favoriteProviders", error);
            })
    }


    getProductApi() {
        EventRegister.emit('loader', true)
        ApiCaller.call('products/favoriteProducts', "GET", null, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("product ===>>>>", response.allFavoriteProducts)

                    this.setState({ productList: response.allFavoriteProducts })

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


    handleTitleInputSubmit = () => {
        this.setState({ focusInput: true });
    }


    onClickServiceProvider() {
        this.setState({
            serviceBacColor: '#4CC9CA',
            serviceTextColor: 'white',
            productBacColor: '#DCDADA',
            productTextColor: 'black',
            value1: 'ServiceProvides',
        })
        this.getServiceApi()
    }

    onClickProducts() {
        this.setState({
            serviceBacColor: '#DCDADA',
            serviceTextColor: 'black',
            productBacColor: '#4CC9CA',
            productTextColor: 'white',
            value1: 'Products',
        })
        this.getProductApi()
    }


    onPressProFav(item) {
        ApiCaller.call('users/' + item.userDetails.id + '/favorite', "GET", null, true)
            .then((response) => {
                if (response) {
                    console.log("portfolio user ===>>>>", response)
                    this.getServiceApi()
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })

    }


    onPressFav(item) {
        ApiCaller.call('products/' + item.product.id + '/favorite', "GET", null, true)
            .then((response) => {
                if (response) {
                    console.log("portfolio user ===>>>>", response)
                    this.getProductApi()
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })

    }

    onProductClick(item) {
        console.log(item)
        NavigationService.navigate('ProductDetail', { productID: item.product.id })
    }

    buyProductApi(item) {
        console.log(item.product.price)

        var data = JSON.stringify({
            "price": item.product.price,
            "business_id": item.product.business_id,
            "product_id": item.product.id,
            "quantity": 1,
        })

        console.log(data)

        ApiCaller.call('lineItems', "POST", data, true)
            .then((response) => {
                if (response) {
                    console.log("getAppointment ===>>>>", response)
                    global.myvar = 'MyCart';
                    NavigationService.navigate('HomeCart', { cartID: response.cart_id })
                }
            })
            .catch((error) => {
                console.log("Error Appointment ==>>", error);
            })

    }



    tabSwitch() {
        if (this.state.value1 == 'ServiceProvides') {
            return <View style={{ flex: 1, padding: 10, }}>
                {this.state.providerList.length > 0 ? <FlatList
                    scrollEnabled={false}
                    data={this.state.providerList}
                    refreshing={this.state.refreshing}
                    renderItem={({ item, index }) =>
                        <View style={{ flex: 1, borderBottomColor: '#d7dada', borderBottomWidth: 1, paddingTop: 8, paddingBottom: 8 }}>
                            <TouchableOpacity activeOpacity={1} style={{ flex: 1, flexDirection: 'column', padding: 5, alignItems: 'center', }} onPress={() => { global.providerID = item.userDetails.id; this.props.navigation.navigate('SellerProfile') }}>
                                <View style={{ flexDirection: 'row', width: '100%', marginLeft: 10, }}>
                                    {item.userDetails.profile_pic_path ? <Image style={favoriteStyles.providerImage} source={{ uri: item.userDetails.profile_pic_path }} />
                                        : <Image style={favoriteStyles.providerImage} source={require('../../assets/images/ic_placeholder.png')} />}

                                    <View style={{ flex: 1, paddingLeft: 10, marginTop: 2 }}>
                                        <Text style={favoriteStyles.providerName}>{item.userDetails.first_name ? item.userDetails.first_name + ' ' + item.userDetails.last_name : item.businessDetails.name}</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <StarRating
                                                activeOpacity={1}
                                                disabled={false}
                                                starSize={20}
                                                fullStarColor={'#ED8A19'}
                                                rating={item.rating[0].average_rating}
                                            />
                                            <Text style={favoriteStyles.ProviderReview}>{item.businessReview[0].count}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image style={favoriteStyles.imageLocation} source={require('../../assets/images/location_black.png')} />
                                            <Text style={[favoriteStyles.providerAddress, { paddingTop: Platform.OS === 'ios' ? 8 : 0 }]}>{item.businessDetails.address}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity activeOpacity={0.9} onPress={() => this.onPressProFav(item)}>
                                        <Image style={[favoriteStyles.isFavImage, { marginTop: -8 }]} source={require('../../assets/images/heart_fill.png')} />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>

                        </View>

                    }
                    keyExtractor={item => item.id}
                /> :

                    <View style={{ flex: 1, height: viewportHeight - 200, justifyContent: 'center' }}>
                        <Text style={[favoriteStyles.productName, { textAlign: 'center' }]}>No Provider found</Text>
                    </View>}

            </View>
        } else {
            return <View style={{ flex: 1, padding: 10, }}>
                {this.state.productList.length > 0 ?
                    <FlatList
                        scrollEnabled={false}
                        data={this.state.productList}
                        refreshing={this.state.refreshing}
                        renderItem={({ item, index }) =>
                            <TouchableOpacity onPress={() => this.onProductClick(item)} activeOpacity={1} style={{ flex: 1, flexDirection: 'column', alignItems: 'center', borderBottomColor: '#d7dada', borderBottomWidth: 1, paddingTop: 5, paddingBottom: 5 }}>
                                <View style={{ flexDirection: 'row', padding: 5 }}>
                                    <View style={favoriteStyles.imageView}>
                                        <TouchableOpacity style={favoriteStyles.productLikeView} activeOpacity={0.9} onPress={() => this.onPressFav(item)}>
                                            <Image style={favoriteStyles.productLike} source={require('../../assets/images/heart_fill.png')} />
                                        </TouchableOpacity>
                                        {item.product.productImages.length > 0 ? <Image style={favoriteStyles.productImage} source={{ uri: item.product.productImages[0].image_path }} />
                                            : <Image style={favoriteStyles.productImage} source={require('../../assets/images/ic_placeholder.png')} />}
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                        <Text style={favoriteStyles.productName}>{item.product.title}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
                                            <StarRating
                                                activeOpacity={1}
                                                disabled={false}
                                                starSize={20}
                                                fullStarColor={'#ED8A19'}
                                                rating={item.rating}
                                            />
                                            <Text style={favoriteStyles.productReview}>{item.number}</Text>
                                        </View>
                                        <Text numberOfLines={4} style={favoriteStyles.productDescription}>{item.product.description}</Text>

                                        <View style={favoriteStyles.priceBuyView}>
                                            <Text style={favoriteStyles.productPrice}>${item.product.price}</Text>
                                            <TouchableOpacity activeOpacity={1} style={favoriteStyles.buyButton} onPress={() => this.buyProductApi(item)}>
                                                <Text style={favoriteStyles.buyText}>Buy</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View>

                                </View>
                            </TouchableOpacity>

                        }
                        keyExtractor={item => item.id}
                    />

                    :
                    <View style={{ flex: 1, height: viewportHeight - 200, justifyContent: 'center' }}>
                        <Text style={[favoriteStyles.productName, { textAlign: 'center' }]}>No Product found</Text>
                    </View>}

            </View>
        }

    }



    render() {
        return (
            <Fragment>
                {Platform.OS == 'ios' ? <StatusBar barStyle="dark-content" translucent={true} /> : <StatusBar hidden={false} barStyle="dark-content" backgroundColor="white" translucent={false} />}

                <SafeAreaView style={[favoriteStyles.statusColor]} />
                <SafeAreaView style={favoriteStyles.bottomColor}>

                    <View style={{ flex: 1 }}>
                        <View style={favoriteStyles.barStyle}>
                            <TouchableOpacity style={{ paddingLeft: 10 }} activeOpacity={0.9}
                                onPress={() => this.drawerOpen()}>
                                <Image style={{ width: 22, height: 22, resizeMode: 'contain' }} source={require('../../assets/images/menu_black.png')} />
                            </TouchableOpacity>

                            <Text style={[favoriteStyles.headerText, { paddingTop: Platform.OS === 'ios' ? 8 : 0, marginRight: 15 }]}>Favourites</Text>

                        </View>


                        <View style={[{ flex: 1, }]}>

                            <View style={favoriteStyles.mainSrvPro}>

                                <TouchableOpacity activeOpacity={1} style={[favoriteStyles.serviceView, { backgroundColor: this.state.serviceBacColor, }]} onPress={this.onClickServiceProvider.bind(this)}>
                                    <View style={[{ alignItems: 'center' }]}>
                                        <Text style={[{ fontFamily: 'HelveticaNeueLTStd-Roman', color: this.state.serviceTextColor, fontSize: 16, paddingTop: Platform.OS === 'ios' ? 8 : 0, }]}>Service Providers</Text>
                                    </View>
                                </TouchableOpacity>


                                <TouchableOpacity activeOpacity={1} style={[favoriteStyles.productsView, { backgroundColor: this.state.productBacColor }]} onPress={this.onClickProducts.bind(this)}>
                                    <View style={[{ alignItems: 'center' }]} >
                                        <Text style={[{ fontFamily: 'HelveticaNeueLTStd-Roman', color: this.state.productTextColor, fontSize: 16, paddingTop: Platform.OS === 'ios' ? 8 : 0, }]}>Products</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ width: '100%', height: '100%' }}>
                                    {this.tabSwitch()}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }
}

