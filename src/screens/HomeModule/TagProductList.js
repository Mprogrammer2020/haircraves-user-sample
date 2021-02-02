import React, { Component, Fragment } from 'react';
import { View, Image, Text, FlatList, Alert, SafeAreaView, StatusBar, Dimensions, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { Base64 } from '../../constants/common';
import homeStyle from './homeStyle';
import CommonHeader from '../../elements/CommonHeader';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import ApiCaller from '../../constants/ApiCaller';
import Toasty from '../../elements/Toasty';



export default class TagProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productList: [],
            showProductList: [],
            selectedProduct: this.props.navigation.getParam('selectedProductsList'),
            selectedProductID: this.props.navigation.getParam('selectedProductID'),
            searchTitle: '',

        }
    }


    componentDidUpdate() {

    }


    componentDidMount() {
        this.getProductApi('')
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

        // console.log("item==>>>", this.state.showProductList.includes(item.id))

        // var showProductList = [];  

        if (this.state.selectedProductID.includes(item.id) == false) {
            this.state.selectedProduct.push(item)
            this.state.selectedProductID.push(item.id)
            // console.log("show data===>>>", this.state.selectedProduct)

            this.setState({ selectedProduct: this.state.selectedProduct })

            // this.state.showProductList.push(item.id)

            // console.log("helloo===>>> ", this.state.showProductList)
            // console.log("helloo===>>> ", this.state.selectedProduct)

            // this.state.selectedProductID = this.state.showProductList



            // this.state.selectedProductID = this.state.showProductList.join()
            // console.log("helloo===>>> ", this.state.selectedProductID)
        }

    }

    removeTag(itemm) {
        let sd = this.state.selectedProduct
        let si = this.state.selectedProductID
        sd.splice(sd.indexOf(itemm), 1)
        si.splice(si.indexOf(itemm.id), 1)
        this.setState({
            selectedProduct: sd,
            // showProductList: si,
            selectedProductID: si,
        })


        console.log('aayaaa', this.state.selectedProduct, this.state.showProductList)

    }

    selectedCall() {
        console.log(this.state.selectedProductID)
        if (this.state.selectedProductID.length == 0) {
            Toasty.show('Please select product first.');
        } else {
            this.props.navigation.state.params.onGoBackPro(this.state.selectedProductID, this.state.selectedProduct);
            this.props.navigation.goBack();
        }

    }



    updateSearch = searchTitle => {
        var titleSearch = searchTitle;
        this.setState({ searchTitle });

        if (searchTitle != "") {
            this.getProductApi(titleSearch.trim());
        } else {
            this.setState({ productList: [] })
        }
    };



    getProductApi(titleeeee) {
        var data = JSON.stringify({
            "title": titleeeee,
        })
        ApiCaller.call('products/search', "POST", data, true)
            .then((response) => {
                if (response) {
                    console.log("products===>>>>", response)
                    this.setState({ productList: this.state.searchTitle ? response.products : [] })
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
                            title='Products'
                            title1='Done'
                            action2={() => this.selectedCall()} />

                        <ScrollView showsVerticalScrollIndicator={false}>

                            <View style={{ width: '100%', backgroundColor: 'white', paddingBottom: 5, paddingTop: 0 }}>

                                <View style={{ margin: 10, flex: 1, flexDirection: 'row', backgroundColor: '#EFEEEE', borderRadius: 30, alignItems: 'center' }}>
                                    <TouchableOpacity style={{ paddingLeft: 20 }}>
                                        <Image style={homeStyle.imageSend} source={require('../../assets/images/search_black.png')} />
                                    </TouchableOpacity>

                                    <TextInput style={homeStyle.textInput}
                                        placeholder="Search products"
                                        fontSize={16}
                                        fontFamily={'HelveticaNeueLTStd-Lt'}
                                        placeholderTextColor={'black'}
                                        blurOnSubmit={true}
                                        returnKeyType={'done'}
                                        onChangeText={this.updateSearch}
                                        value={this.state.searchTitle} />
                                </View>


                                {this.state.selectedProduct ?
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
                                        {this.state.selectedProduct.map((dataItem, key) => (
                                            <View style={{ backgroundColor: '#4CC9CA', margin: 4, borderRadius: 8, padding: 6, marginStart: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                                <Text style={{ color: '#fff', fontFamily: 'HelveticaNeueLTStd-Md', alignSelf: 'center', fontSize: 18, marginStart: 4, marginRight: 5 }}>{dataItem.title}</Text>
                                                <TouchableOpacity activeOpacity={1} onPress={() => this.removeTag(dataItem)}>
                                                    <Image style={{ height: 25, width: 25, resizeMode: 'contain', marginHorizontal: 6 }} source={require('../../assets/images/delete_black.png')} />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                    : null}

                                <FlatList
                                    scrollEnabled={false}
                                    data={this.state.productList}
                                    refreshing={this.state.refreshing}
                                    renderItem={({ item, index }) =>
                                        <View style={{ flex: 1, borderBottomColor: '#BBBBBB', flexDirection: 'row', borderBottomWidth: 1, paddingTop: 5, paddingBottom: 5, marginLeft: 8, marginRight: 8 }}>
                                            <TouchableOpacity activeOpacity={1} onPress={() => this._onPressSingle()} style={{ flex: 1, flexDirection: 'row', paddingTop: 5, paddingBottom: 5, alignItems: 'center' }}>
                                                {/* {item.barberImage != '' ? <View>
                                                    <Image style={{ height: 50, width: 50, borderRadius: 5 }} source={item.barberImage} />
                                                </View> : null} */}
                                                <Text style={homeStyle.prodUserText}>{item.title}</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity activeOpacity={1} onPress={() => this.addTag(item)} style={{ flex: 1, flexDirection: 'row', paddingTop: 5, paddingBottom: 5, paddingRight: 5, justifyContent: 'flex-end' }}>
                                                <Text style={homeStyle.prodUserText}>+ Add Product</Text>
                                            </TouchableOpacity>

                                        </View>

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