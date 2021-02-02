import React, { Component, Fragment } from 'react';
import { StyleSheet, View, ImageBackground, Image, Text, TouchableOpacity, TextInput, ScrollView, FlatList, BackHandler, Dimensions, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import Toasty from '../../elements/Toasty';
import productsStyles from './productsStyles'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import StarRating from 'react-native-star-rating';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import NavigationService from '../../routes/NavigationService';
import { EventRegister } from 'react-native-event-listeners';
import ApiCaller from '../../constants/ApiCaller';
import ReactNativeSegmentedControlTab from 'react-native-segmented-control-tab';
import { AsyncStorage } from 'react-native';


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

global.productList = [];
class FindProduct extends React.Component {
    constructor() {
        super()
        this.state = {
            email: '',
            productList: [],
            cartItems: []
        }
    }


    componentWillMount() {
        // this.getProductApi();
    }


    // getProductApi() {
    //     EventRegister.emit('loader', true)
    //     ApiCaller.call('products/all', "GET", null, true)
    //         .then((response) => {
    //             EventRegister.emit('loader', false)
    //             if (response) {
    //                 console.log("portfolio product ===>>>>", response.allProducts)
    //                 this.setState({ productList: response.allProducts })
    //             }
    //         })
    //         .catch((error) => {
    //             console.log("ErrorLogin", error);
    //         })
    // }

    // onPressFav(item) {
    //     ApiCaller.call('products/' + item.id + '/favorite', "GET", null, true)
    //         .then((response) => {
    //             if (response) {
    //                 console.log("portfolio user ===>>>>", response)
    //                 this.getProductApi()
    //             }
    //         })
    //         .catch((error) => {
    //             console.log("ErrorLogin", error);
    //         })

    // }



    // onClickReview() {
    //     this.props.navigation.navigate('ReviewScreen')
    // }


    // onProductClick(item) {
    //     NavigationService.navigate('ProductDetail', { productID: item.id })
    // }


    // buyProductApi(item) {
    //     console.log(item)
    //     var data = JSON.stringify({
    //         "price": item.price,
    //         "business_id": item.business_id,
    //         "product_id": item.id,
    //         "quantity": 1,
    //     })

    //     console.log(data)

    //     ApiCaller.call('lineItems', "POST", data, true)
    //         .then((response) => {
    //             if (response) {
    //                 console.log("getAppointment ===>>>>", response)
    //                 global.myvar = 'MyCart';
    //                 NavigationService.navigate('HomeCart', { cartID: response.cart_id })
    //             }
    //         })
    //         .catch((error) => {
    //             console.log("Error Appointment ==>>", error);
    //         })
    // }


    render() {
        return (
            <View style={{ flex: 1, marginTop: 10 }}>
                {/* <ScrollView showsVerticalScrollIndicator={false}>
                    {this.state.productList.length > 0 ?
                        <View style={{ flex: 1 }}>
                            <FlatList
                                scrollEnabled={false}
                                data={this.state.productList}
                                refreshing={this.state.refreshing}
                                renderItem={({ item, index }) =>
                                    <TouchableOpacity onPress={() => this.onProductClick(item)} activeOpacity={1} style={{ flex: 1, flexDirection: 'column', alignItems: 'center', borderBottomColor: '#d7dada', borderBottomWidth: 1, paddingTop: 5, paddingBottom: 5 }}>
                                        <View style={{ flexDirection: 'row', padding: 5 }}>
                                            <View style={{ height: 150, width: 150 }}>
                                                <TouchableOpacity style={{ height: 30, width: 30, borderRadius: 10, position: 'absolute', top: 5, right: 5, zIndex: 99999 }} activeOpacity={0.9} onPress={() => this.onPressFav(item)}>
                                                    {item.isMyfavorite ? <Image style={{ height: 35, width: 35, borderRadius: 10, }} source={require('../../assets/images/heart_fill.png')} /> : <Image style={{ height: 35, width: 35, borderRadius: 10, }} source={require('../../assets/images/heart_overlay.png')} />}
                                                </TouchableOpacity>

                                                {item.productImages.length > 0 ? <Image style={{ height: 150, width: 150, borderRadius: 10 }} source={{ uri: item.productImages[0].image_path }} />
                                                    : <Image style={{ height: 150, width: 150, borderRadius: 10 }} source={require('../../assets/images/ic_placeholder.png')} />}
                                            </View>
                                            <View style={{ flex: 1, marginLeft: 10 }}>
                                                <Text style={{ fontSize: 16, width: '95%', color: 'black', fontFamily: 'HelveticaNeueLTStd-Md', marginTop: 5 }}>{item.title}</Text>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
                                                    <StarRating
                                                        disabled={false}
                                                        starSize={20}
                                                        activeOpacity={1}
                                                        fullStarColor={'#ED8A19'}
                                                        rating={item.rating.average_rating}
                                                    />
                                                    <Text style={{ fontSize: 14, width: '95%', marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Roman', color: 'grey', paddingTop: Platform.OS === 'ios' ? 5 : 0 }}>{item.productRatingCount.count}</Text>
                                                </View>
                                                <Text style={{ fontSize: 14, width: '95%', fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey' }}>{item.description}</Text>

                                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
                                                    <Text style={{ flex: 1, fontSize: 14, width: '95%', marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Roman', color: 'black' }}>${item.price}</Text>
                                                    <TouchableOpacity activeOpacity={1} style={{ alignItems: 'center', backgroundColor: '#4CC9CA', width: 65, borderRadius: 20, padding: 8 }} onPress={() => this.buyProductApi(item)}>
                                                        <Text style={{ textAlign: 'center', fontSize: 14, width: '95%', marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Md', color: 'white', paddingTop: Platform.OS === 'ios' ? 5 : 0 }}>Buy</Text>
                                                    </TouchableOpacity>
                                                </View>

                                            </View>

                                        </View>
                                    </TouchableOpacity>

                                }
                                keyExtractor={item => item.id}
                            />
                        </View>
                        :
                        <View style={[{ flex: 1, height: viewportHeight - 200, justifyContent: 'center' }]}>
                            <Text style={{ fontFamily: 'HelveticaNeueLTStd-Roman', color: 'black', fontSize: 16, textAlign: 'center' }}>No Product found</Text>
                        </View>}
                </ScrollView> */}
            </View>
        )
    };

}




class ProductsScreen extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            titleName: '',
            showSearchStatus: false,
            categoryList: [],
            productList: [],
            cartItems: [],
            index: 0
        };
    }



    componentDidMount() {

        const { navigation } = this.props;
        var title = navigation.getParam('titleName');

        this.setState({ titleName: title })

        this.props.navigation.addListener(
            'willFocus',
            () => {
                this.getCategoriesApi();
                handleAndroidBackButton(() => this.props.navigation.goBack())
            }
        );
    }


    componentWillUnmount() {
        removeAndroidBackButtonHandler();
    }

    getProductApi(id) {
        global.catId = id
        EventRegister.emit('loader', true)
        ApiCaller.call('products/all?category_id=' + id, "GET", null, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("portfolio product ===>>>>", response.allProducts)
                    this.setState({ productList: response.allProducts })
                }
                this.getPreOrderApi()
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }

    onPressFav(item) {
        ApiCaller.call('products/' + item.id + '/favorite', "GET", null, true)
            .then((response) => {
                if (response) {
                    console.log("portfolio user ===>>>>", response)
                    this.getProductApi(global.catId)
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })

    }

    onClickReview() {
        this.props.navigation.navigate('ReviewScreen')
    }


    onProductClick(item) {
        NavigationService.navigate('ProductDetail', { productID: item.id })
    }


    buyProductApi(item) {
        console.log(item)
        var data = JSON.stringify({
            "price": item.price,
            "business_id": item.business_id,
            "product_id": item.id,
            "quantity": 1,
        })

        console.log(data)

        ApiCaller.call('lineItems/cart', "POST", data, true)
            .then((response) => {
                if (response) {
                    console.log("getAppointment ===>>>>", response)
                    global.myvar = 'MyCart';
                    AsyncStorage.setItem('CartId', String(response.cart_id))
                    NavigationService.navigate('HomeCart', { cartID: response.cart_id })
                }
            })
            .catch((error) => {
                console.log("Error Appointment ==>>", error);
            })
    }


    getPreOrderApi() {
        AsyncStorage.getItem('CartId').then(res => {
            var data = JSON.stringify({
                'cart_id': res,
            })

            ApiCaller.call('appointments/preOrder', "POST", data, true)
                .then((response) => {
                    console.log("appointments/preOrder", JSON.stringify(response))
                    if (response) {
                        this.setState({
                            cartItems: response.products,
                        })
                    }
                })
                .catch((error) => {
                    console.log("Error preOrder ==>>", error);
                })
        })

    }


    addToCartApi(item) {
        console.log(item)
        var data = JSON.stringify({
            "price": item.price,
            "business_id": item.business_id,
            "product_id": item.id,
            "quantity": 1,
        })

        console.log(data)

        ApiCaller.call('lineItems/cart', "POST", data, true)
            .then((response) => {
                if (response) {
                    console.log("getAppointment ===>>>>", response)
                    global.cartID = response.cart_id;
                    AsyncStorage.setItem('CartId', String(response.cart_id))
                    this.getPreOrderApi()
                    Toasty.show('Product added')
                    // global.myvar = 'MyCart';
                    // NavigationService.navigate('HomeCart', { cartID: response.cart_id })
                }
            })
            .catch((error) => {
                console.log("Error Appointment ==>>", error);
            })
    }

    checkIfItemIsInCart(id) {
        console.log(id)
        let result = false
        this.state.cartItems.forEach(element => {
            if (element.id == id) {
                result = true
            }
        });
        return result
    }

    handleCustomIndexSelect = (index) => {
        this.setState(prevState => ({ ...prevState, customStyleIndex: index, selectedId: this.state.allCategories[index].id }));
        this.getProductApi(this.state.allCategories[index].id);
    };

    handleTitleInputSubmit = () => {
        this.setState({ focusInput: true });
    }


    onClickSearch() {
        if (this.state.showSearchStatus == true) {
            this.setState({ showSearchStatus: false, searchText: '' })
        }
        else {
            this.setState({ showSearchStatus: true })
        }

    }

    backPress() {
        this.props.navigation.goBack();
    }

    componentWillReceiveProps() {
        StatusBar.setBackgroundColor('#ffffff');
        StatusBar.setBarStyle('dark-content');
    }

    onSerchClick() {
        if (this.state.showSearchStatus == true) {
            this.setState({ showSearchStatus: false, searchText: '' })
        }
        else {
            this.setState({ showSearchStatus: true })
        }
    }



    updateSearch = searchText => {
        var titleSearch = searchText;
        this.setState({ searchText });

        if (searchText != "") {
            this.searchApiCall(titleSearch.trim());
        } else {
            this.setState({ peopleList: [] })
        }
    };

    getCategoriesApi() {
        this.setState({ isLoading: true });

        ApiCaller.call('productCategories', "GET", null, true)
            .then((response) => {
                this.setState({ isLoading: false });

                if (response) {
                    console.log("service_categories===>>>>", response)

                    let temp = [], temp2 = [];
                    response.productCategories.map((item) => temp.push(item.name))
                    response.productCategories.map((item) => temp2.push({ id: item.id, name: item.name }))
                    this.setState({ categoryList: temp, allCategories: temp2, selectedId: temp2[0].id })
                    this.getProductApi(temp2[0].id);
                    // this.setState({ categoryList: response.service_categories })
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }

    searchApiCall(searchName) {
        var data = JSON.stringify({
            "search": searchName,
        })
        ApiCaller.call('products/searchProducts', "POST", data, true)
            .then((response) => {
                if (response) {

                    console.log("searchProduct==>>>", response)
                    // this.setState({ portfolioList: this.state.searchText ? response.totalPosts : [] })
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

                <SafeAreaView style={[productsStyles.statusColor]} />
                <SafeAreaView style={productsStyles.bottomColor}>
                    <View style={[{ flex: 1, }]}>

                        <View style={{ width: '100%', paddingTop: 10, paddingBottom: 10, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity style={{ flex: 0.1, paddingLeft: 10 }} activeOpacity={0.9}
                                onPress={() => this.backPress()}>
                                <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../../assets/images/back_arrow.png')} />
                            </TouchableOpacity>

                            {this.state.showSearchStatus ? <View style={{ flexDirection: 'row', flex: 0.8, alignItems: 'center', borderRadius: 10, backgroundColor: '#F0EFEF', marginRight: 5 }}>
                                <View style={{ height: 38, flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                    <Image style={{ height: 20, width: 20, marginLeft: 10, }} source={require('../../assets/images/search_black.png')} />
                                    <TextInput
                                        style={{ height: 38, fontSize: 15, width: '100%' }}
                                        placeholder="Search Products by name"
                                        fontSize={16}
                                        fontFamily={'HelveticaNeueLTStd-Roman'}
                                        placeholderTextColor={'black'}
                                        value={this.state.searchText}
                                        onChangeText={this.updateSearch}
                                    />
                                </View>
                            </View>
                                :
                                <Text style={{ flex: 0.8, color: 'black', fontSize: 20, textAlign: 'center', fontFamily: 'HelveticaNeueLTStd-Roman' }}>{this.state.titleName}</Text>
                            }

                            <TouchableOpacity style={{ flex: 0.1 }} activeOpacity={0.9}
                                onPress={() => this.onClickSearch()}>
                                {this.state.showSearchStatus ? <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../../assets/images/cross.png')} />
                                    : <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../../assets/images/search_black.png')} />}
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: 50 }}>
                            <ScrollView style={{ flex: 1 }} horizontal showsHorizontalScrollIndicator={false}>
                                <ReactNativeSegmentedControlTab
                                    // values={['Hair', 'Beard & mustache', 'Face', 'Wax', 'Shave', 'Massage']}
                                    values={this.state.categoryList}
                                    selectedIndex={this.state.customStyleIndex}
                                    onTabPress={this.handleCustomIndexSelect}
                                    borderRadius={0}
                                    tabsContainerStyle={{ height: 50 }}
                                    tabStyle={{
                                        backgroundColor: '#F0EFEF',
                                        borderColor: 'black',
                                        borderBottomColor: 'black',
                                        borderRightWidth: 0,
                                        paddingHorizontal: 10,
                                        borderBottomWidth: 0,
                                        borderLeftWidth: 0,
                                        borderTopWidth: 0
                                    }}
                                    activeTabStyle={{
                                        backgroundColor: '#F0EFEF', color: 'black', borderBottomColor: '#47CACC', borderRightWidth: 0,
                                        borderBottomWidth: 3,
                                        borderLeftWidth: 0,
                                        borderTopWidth: 0
                                    }}
                                    tabTextStyle={{ color: '#8d8d8d', fontSize: 15, fontFamily: 'HKGrotesk-SemiBold' }}
                                    activeTabTextStyle={{ color: 'black', fontSize: 16 }}
                                />

                            </ScrollView>
                        </View>
                        {/* <CustomTabView /> */}

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {this.state.productList.length > 0 ?
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        scrollEnabled={false}
                                        data={this.state.productList}
                                        refreshing={this.state.refreshing}
                                        renderItem={({ item, index }) =>
                                            <TouchableOpacity onPress={() => this.onProductClick(item)} activeOpacity={1} style={{ flex: 1, flexDirection: 'column', alignItems: 'center', borderBottomColor: '#d7dada', borderBottomWidth: 1, paddingTop: 5, paddingBottom: 5 }}>
                                                <View style={{ flexDirection: 'row', padding: 5 }}>
                                                    <View style={{ height: 150, width: 150 }}>
                                                        <TouchableOpacity style={{ height: 30, width: 30, borderRadius: 10, position: 'absolute', top: 5, right: 5, zIndex: 99999 }} activeOpacity={0.9} onPress={() => this.onPressFav(item)}>
                                                            {item.isMyfavorite ? <Image style={{ height: 35, width: 35, borderRadius: 10, }} source={require('../../assets/images/heart_fill.png')} /> : <Image style={{ height: 35, width: 35, borderRadius: 10, }} source={require('../../assets/images/heart_overlay.png')} />}
                                                        </TouchableOpacity>

                                                        {item.productImages.length > 0 ? <Image style={{ height: 150, width: 150, borderRadius: 10 }} source={{ uri: item.productImages[0].image_path }} />
                                                            : <Image style={{ height: 150, width: 150, borderRadius: 10 }} source={require('../../assets/images/ic_placeholder.png')} />}
                                                    </View>
                                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                                        <Text style={{ fontSize: 16, width: '95%', color: 'black', fontFamily: 'HelveticaNeueLTStd-Md', marginTop: 5 }}>{item.title}</Text>

                                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
                                                            <StarRating
                                                                disabled={false}
                                                                starSize={20}
                                                                activeOpacity={1}
                                                                fullStarColor={'#ED8A19'}
                                                                rating={item.rating.average_rating}
                                                            />
                                                            <Text style={{ fontSize: 14, width: '95%', marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Roman', color: 'grey', paddingTop: Platform.OS === 'ios' ? 5 : 0 }}>{item.productRatingCount.count}</Text>
                                                        </View>

                                                        <Text style={{ fontSize: 14, width: '95%', fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey' }}>{item.description}</Text>
                                                        <Text style={{ flex: 1, fontSize: 14, marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Roman', color: 'black' }}>${item.price}</Text>

                                                        {!this.checkIfItemIsInCart(item.id) ? <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
                                                            < TouchableOpacity activeOpacity={1} style={{ alignItems: 'center', backgroundColor: '#4CC9CA', borderRadius: 20, padding: 8 }} onPress={() => this.addToCartApi(item)}>
                                                                <Text style={{ textAlign: 'center', fontSize: 14, width: '95%', marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Md', color: 'white', paddingTop: Platform.OS === 'ios' ? 5 : 0 }}>Add To Cart</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity activeOpacity={1} style={{ alignItems: 'center', backgroundColor: '#4CC9CA', width: 65, marginStart: 10, borderRadius: 20, padding: 8 }} onPress={() => this.buyProductApi(item)}>
                                                                <Text style={{ textAlign: 'center', fontSize: 14, width: '95%', marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Md', color: 'white', paddingTop: Platform.OS === 'ios' ? 5 : 0 }}>Buy</Text>
                                                            </TouchableOpacity>
                                                        </View> : <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
                                                                < TouchableOpacity activeOpacity={1} style={{ alignItems: 'center', borderRadius: 20, padding: 8, borderColor: '#4CC9CA', borderWidth: 1 }} onPress={() => {
                                                                    this.props.navigation.navigate('CartScreen', { cartID: global.cartID })
                                                                }}>
                                                                    <Text style={{ textAlign: 'center', fontSize: 14, width: '95%', marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Md', color: '#4CC9CA', paddingTop: Platform.OS === 'ios' ? 5 : 0 }}>In Your Cart</Text>
                                                                </TouchableOpacity>
                                                            </View>}

                                                    </View>

                                                </View>
                                            </TouchableOpacity>

                                        }
                                        keyExtractor={item => item.id}
                                    />
                                </View>
                                :
                                <View style={[{ flex: 1, height: viewportHeight - 200, justifyContent: 'center' }]}>
                                    <Text style={{ fontFamily: 'HelveticaNeueLTStd-Roman', color: 'black', fontSize: 16, textAlign: 'center' }}>No Product found</Text>
                                </View>}
                        </ScrollView>

                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }
}

// export function CustomTabView() {

//     const [index, setIndex] = React.useState(0);
//     const [routes] = React.useState([
//         { key: '0', title: 'Hair' },
//       // { key: '0', title: 'Wax' },
//         // { key: '1', title: 'Beard & mustache' },
//         // { key: '2', title: 'Face' },
//         // { key: '3', title: 'Wax' },
//         // { key: '4', title: 'Shave' },
//         // { key: '5', title: 'Massage' },
//     ]);

//     const renderScene = ({ route }) => {
//         switch (route.key) {
//             case '0':
//                 return <FindProduct />;
//             // return <FindProduct />;
//             // case '1':
//             //     return <ServiceLooking />;
//             // case '2':
//             //     return <ServiceLooking />;
//             // case '3':
//             //     return <ServiceLooking />;
//             // case '4':
//             //     return <ServiceLooking />;
//             default:
//                 return <FindProduct />;
//         }
//     };

//     const renderTabBar = props => (
//         <TabBar
//             {...props}
//             indicatorStyle={{ backgroundColor: '#47CACC' }}
//             scrollEnabled={true}
//             renderLabel={({ route, focused, color }) => <Text style={{ color: focused == true ? '#000' : '#8d8d8d' }}>{route.title}</Text>}
//             style={{ backgroundColor: '#F0EFEF', elevation: 0 }}
//             contentContainerStyle={{ width: 'auto' }}
//             tabStyle={{ width: 'auto' }}
//             indicatorContainerStyle={{ width: 'auto' }}
//         />
//     );
//     return (
//         <TabView
//             navigationState={{ index, routes }}
//             renderScene={renderScene}
//             renderTabBar={renderTabBar}
//             onIndexChange={setIndex}
//         />
//     );
// }
// const styles = StyleSheet.create({
//     container: {
//         width: '100%',
//         height: '100%',
//         backgroundColor: 'transparent'
//     },

// });

export default ProductsScreen;