import React, { Component, Fragment } from 'react';
import { StyleSheet, View, ImageBackground, Image, Text, TouchableOpacity, TextInput, ScrollView, FlatList, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView, Linking, Dimensions, AsyncStorage } from 'react-native';
import Toasty from '../../elements/Toasty';
import sellerStyle from './sellerStyle'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import StarRating from 'react-native-star-rating';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import Modal from 'react-native-modal';
import NavigationService from '../../routes/NavigationService';
import { EventRegister } from 'react-native-event-listeners';
import ApiCaller from '../../constants/ApiCaller';
import moment from 'moment';
import homeStyle from '../HomeModule/homeStyle';


global.serviceList = []
global.productList = []
global.portfolioList = []
global.userInfo = {}
global.businessDetails = {}
global.availabilityList = {}

class SellerService extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      modalVisible: false,
      serviceList: [],
      showPeopleList: [],
      selectedPeople: [],
      selectedServiceID: '',
      deleteItem: {},
      resendCardID: '',
      totalPrice: '',
      totalService: 0,
    }
  }

  componentDidMount() {
    this.props.props.navigation.addListener(
      'willFocus',
      () => {
        this.setState({ totalService: 0 })
      }
    );
  }

  discardNo() {
    this.setState({ modalVisible: false });

  }


  submitFilter() {

    console.log(this.state.deleteItem)
    var data = this.state.deleteItem
    data.selected = false
    // this.setState({deleteItem : data.selected })

    let sd = this.state.selectedPeople
    let si = this.state.showPeopleList
    sd.splice(sd.indexOf(this.state.deleteItem), 1)
    si.splice(si.indexOf(this.state.deleteItem.service.id), 1)
    this.setState({
      selectedPeople: sd,
      showPeopleList: si,
      selectedServiceID: si.join(),
    })

    console.log('aayaaa', this.state.selectedPeople, this.state.showPeopleList)

    console.log("delete", this.state.deleteItem.lineItem)

    var dataaaa = JSON.stringify({
      "cart_price": this.state.totalPrice,
      "line_item_price": this.state.deleteItem.service.price,
      "cart_id": this.state.resendCardID,
    })
    ApiCaller.call('lineItems/' + this.state.deleteItem.lineItem, "DELETE", dataaaa, true)
      .then((response) => {
        if (response) {

          data.lineItem = ''
          console.log("service response ===>>>>", response)
          this.setState({ totalPrice: response.cartDetails.price, totalService: response.totalCount[0].total_count })

        }
      })
      .catch((error) => {
        console.log("ErrorLogin", error);
      })



    this.setState({ modalVisible: false });

  }

  callPopUp(item) {
    this.setState({ modalVisible: 'slow', deleteItem: item });

  }


  addServiceApi(item) {
    let serviceList = [...global.serviceList];
    var showPeopleList = [];
    var selectedPeople = [];

    for (let data of serviceList) {
      if (data.service.id == item.service.id) {
        data.selected = (data.selected == null) ? true : !data.selected;
        console.log("helloooo", data.selected)

        if (data.selected == true) {
          if (this.state.showPeopleList.includes(data.service.id) == false) {
            this.state.selectedPeople.push(data)

            console.log("show data===>>>", this.state.selectedPeople)

            this.setState({ selectedPeople: this.state.selectedPeople })

            this.state.showPeopleList.push(data.service.id)
            this.state.selectedServiceID = this.state.showPeopleList.join()

            console.log("helloo===>>> ", this.state.selectedServiceID)



            var dataaaa = JSON.stringify({
              "price": data.service.price,
              "business_id": data.service.business_id,
              "business_service_id": data.service.id,
              'cart_id': this.state.resendCardID,
            })

            // data.lineItem = (data.lineItem == null) ? 200 : !data.lineItem;
            // console.log("lineIte==>>", data.lineItem)

            ApiCaller.call('lineItems/service', "POST", dataaaa, true)
              .then((response) => {
                if (response) {
                  console.log("Add Service ===>>>>", response)
                  this.setState({ resendCardID: response.cart_id, totalPrice: response.cartDetails.price, totalService: response.totalCount[0].total_count })
                  data.lineItem = (data.lineItem == null) ? response.line_item_id : !data.lineItem;
                  console.log("lineItem==>>", data.lineItem)

                }
              })
              .catch((error) => {
                console.log("Error Appointment ==>>", error);
              })
          }

        }
        break;
      }
    }

    global.serviceList = serviceList

    // this.setState({ serviceList });
  }

  callAppointment() {
    console.log("resremd", this.state.resendCardID)
    if (this.state.resendCardID == '') {
      Toasty.show('Please select a service first');
    } else {
      global.prevScreen = 'profilescreen';
      NavigationService.navigate('Appointment', { cardID: this.state.resendCardID })

    }

  }


  render() {
    return (
      <View style={[{ flex: 1, paddingBottom: 0, backgroundColor: 'white' }]}>

        {global.serviceList.length > 0 ?
          <FlatList
            scrollEnabled={true}
            contentContainerStyle={{ padding: 10, }}
            showsVerticalScrollIndicator={false}
            data={global.serviceList}
            refreshing={this.state.refreshing}
            renderItem={({ item, index }) =>
              <View style={{ flex: 1, borderBottomColor: '#d7dada', borderBottomWidth: 1, marginBottom: 8 }}>
                <TouchableOpacity activeOpacity={1} style={{ flex: 1, flexDirection: 'column', padding: 5, alignItems: 'center', paddingBottom: 10, paddingTop: 10 }}>
                  <View style={{ flexDirection: 'row', width: '100%', marginLeft: 10, alignItems: 'center' }}>
                    {item.service.image_path ? <Image style={{ height: 50, width: 50, borderRadius: 25 }} source={{ uri: item.service.image_path }} />
                      : <Image style={{ height: 50, width: 50, borderRadius: 25 }} source={require('../../assets/images/ic_placeholder.png')} />}
                    <View style={{ flex: 1 }}>
                      <Text style={{ paddingLeft: 20, fontSize: 14, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md', textTransform: 'uppercase' }}>{item.service.name}</Text>
                      <Text style={{ paddingLeft: 20, fontSize: 14, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>${item.service.price}</Text>
                      <Text style={{ paddingLeft: 20, fontSize: 12, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt' }}>{item.service.time_takes.split(':')[0]}:{item.service.time_takes.split(':')[1]}</Text>
                      <Text style={{ paddingLeft: 20, fontSize: 12, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt' }}>{item.service.description}</Text>

                      {/* {console.log("item",item)} */}
                    </View>

                    <TouchableOpacity onPress={() => item.selected == true ? this.callPopUp(item) : this.addServiceApi(item)} activeOpacity={1} style={{ alignItems: 'center', borderColor: '#4CC9CA', borderWidth: 2, backgroundColor: item.selected == true ? '#4CC9CA' : 'white', width: 100, borderRadius: 20, padding: 8 }}>
                      <Text style={{ textAlign: 'center', fontSize: 14, width: '95%', marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Md', color: item.selected == true ? 'white' : '#4CC9CA', marginTop: Platform.OS == 'ios' ? 5 : 0 }}>{item.selected == true ? 'Remove' : 'Add'}</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

              </View>

            }
            keyExtractor={item => item.id}
          /> :

          <View style={[{ flex: 1, padding: 10, paddingBottom: 0, }]}>
            <View style={[sellerStyle.dayView, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={[sellerStyle.dayStyle, { textAlign: 'center' }]}>No service found</Text>
            </View>
          </View>}

        {this.state.totalService > 0 ?

          <TouchableOpacity onPress={() => this.callAppointment()} activeOpacity={1} style={{ flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: '#4CC9CA', height: 50 }}>

            <View style={{ flex: 1, paddingLeft: 10, alignItems: 'flex-start' }}>
              {/* <Text style={{ textAlign: 'center', fontSize: 14, marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'white' }}>1 Services (2 hrs)</Text> */}
              <Text style={{ textAlign: 'center', fontSize: 14, marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'white' }}>{this.state.totalService} {this.state.totalService > 1 ? "Services" : "Service"}</Text>
              <Text style={{ textAlign: 'center', fontSize: 14, marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Roman', color: 'white' }}>$ {this.state.totalPrice}</Text>

            </View>

            <Text style={{ textAlign: 'center', paddingRight: 10, fontSize: 16, marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Md', color: 'white' }}>Book Appointment</Text>
          </TouchableOpacity>
          : null}

        <Modal
          isVisible={this.state.modalVisible === 'slow'}
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={800}
          backdropTransitionOutTiming={800}>

          <View style={{ height: 'auto', borderRadius: 20, backgroundColor: 'white', alignItems: 'center', marginLeft: 20, marginRight: 20 }}>


            <Image style={[sellerStyle.appIcon, { marginTop: 20, height: 80 }]} source={require('../../assets/images/email_not.png')} />


            <Text style={[sellerStyle.popText, { marginTop: 10, textAlign: 'center', lineHeight: 20 }]} >Added services for this provider will be{'\n'}discarded. Are you sure you want to go{'\n'} back.</Text>

            <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 25 }}>
              <TouchableOpacity activeOpacity={1} style={[sellerStyle.buttonStyle, { width: 120, marginRight: 5, borderColor: '#4CC9CA', borderWidth: 1 }]}
                onPress={() => this.submitFilter()}>
                <Text style={sellerStyle.buttonTextStyle}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={1} style={[sellerStyle.buttonStyle, { width: 120, marginLeft: 5, backgroundColor: 'white', borderColor: '#4CC9CA', borderWidth: 2 }]}
                onPress={() => this.discardNo()}>
                <Text style={[sellerStyle.buttonTextStyle, { color: '#4CC9CA' }]}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    )
  };

}

class SellerProduct extends React.Component {
  constructor() {
    super()
    this.state = {
      email: '',
      productList: [],
      cartItems: []
    }
  }


  componentDidMount() {
    console.log(">>>")
    this.getPreOrderApi()
  }

  buyProductApi(item) {
    global.prevScreenOrder = 'profilescreen';

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
  onPressFav(item) {
    console.log("item---", item)
    ApiCaller.call('products/' + item.product.id + '/favorite', "GET", null, true)
      .then((response) => {
        if (response) {
          item.product.isMyfavorite = !item.product.isMyfavorite;
          this.setState({ refreshing: !this.state.refreshing })
        }
      })
      .catch((error) => {
        console.log("ErrorLogin", error);
      })

  }


  addToCartApi(item) {
    console.log(item.product)
    var data = JSON.stringify({
      "price": item.product.price,
      "business_id": item.product.business_id,
      "product_id": item.product.id,
      "quantity": 1,
    })

    console.log(data)

    ApiCaller.call('lineItems/cart', "POST", data, true)
      .then((response) => {
        if (response) {
          console.log("getAppointment ===>>>>", response)
          global.cartID = response.cart_id;
          AsyncStorage.setItem('CartId', String(response.cart_id))
          Toasty.show('Product added')
          this.getPreOrderApi()
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

  render() {
    return (
      <View style={[{ flex: 1, padding: 10, paddingBottom: 0, backgroundColor: 'white' }]}>
        {global.productList.length > 0 ?
          <FlatList
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            data={global.productList}
            refreshing={this.state.refreshing}
            renderItem={({ item, index }) =>
              <TouchableOpacity activeOpacity={1} onPress={() => { global.prevScreenOrder = 'profilescreen'; NavigationService.navigate('ProductDetail', { productID: item.product.id }) }} style={{ flex: 1, flexDirection: 'column', alignItems: 'center', borderBottomColor: 'grey', borderBottomWidth: 1, paddingTop: 10, paddingBottom: 10 }}>
                <View style={{ flexDirection: 'row', padding: 5 }}>
                  <TouchableOpacity activeOpacity={1} style={{ height: 140, width: 140 }} onPress={() => this.onPressFav(item)}>

                    <Image resizeMode={'contain'} style={{ height: 40, width: 40, position: 'absolute', right: 0, padding: 20, zIndex: 1 }}
                      source={item.product.isMyfavorite ?
                        require('../../assets/images/heart_fill.png') :
                        require('../../assets/images/heart_overlay.png')} />

                    {item.product.productImages.length > 0 ? <Image style={{ height: 140, width: 140, borderRadius: 10 }} source={{ uri: item.product.productImages[0].image_path }} /> : <Image style={{ height: 140, width: 140, borderRadius: 10 }} source={require('../../assets/images/ic_placeholder.png')} />}
                  </TouchableOpacity>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ fontSize: 16, width: '95%', color: 'black', fontFamily: 'HelveticaNeueLTStd-Md', marginTop: 5 }}>{item.product.title}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
                      <StarRating
                        activeOpacity={1}
                        disabled={false}
                        starSize={20}
                        fullStarColor={'#ED8A19'}
                        rating={item.rating}
                      />
                      <Text style={{ fontSize: 14, width: '95%', marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey', paddingTop: Platform.OS === 'ios' ? 8 : 0, }}>{item.product.number}</Text>
                    </View>
                    <Text style={{ fontSize: 14, width: '95%', fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey' }}>{item.product.description}</Text>
                    <Text style={{ flex: 1, fontSize: 16, width: '95%', marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Roman', color: 'black' }}>${item.product.price}</Text>
                    {!this.checkIfItemIsInCart(item.product.id) ?
                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
                        < TouchableOpacity activeOpacity={1} style={{ alignItems: 'center', backgroundColor: '#4CC9CA', borderRadius: 20, padding: 8 }} onPress={() => this.addToCartApi(item)}>
                          <Text style={{ textAlign: 'center', fontSize: 14, width: '95%', marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Md', color: 'white', paddingTop: Platform.OS === 'ios' ? 5 : 0 }}>Add To Cart</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} style={{ alignItems: 'center', backgroundColor: '#4CC9CA', width: 65, borderRadius: 20, padding: 8, marginStart: 10 }} onPress={() => this.buyProductApi(item)}>
                          <Text style={{ textAlign: 'center', fontSize: 14, width: '95%', marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Md', color: 'white', paddingTop: Platform.OS === 'ios' ? 4 : 0, }}>Buy</Text>
                        </TouchableOpacity>
                      </View>
                      :
                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
                        < TouchableOpacity activeOpacity={1} style={{ alignItems: 'center', borderRadius: 20, padding: 8, borderColor: '#4CC9CA', borderWidth: 1 }} onPress={() => {
                          NavigationService.navigate('CartScreen')
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

          :

          <View style={[{ flex: 1, padding: 10, paddingBottom: 0, }]}>
            <View style={[sellerStyle.dayView, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={[sellerStyle.dayStyle, { textAlign: 'center' }]}>No product found</Text>
            </View>
          </View>}


      </View>
    )
  };

}




class SellerPortfolio extends React.Component {
  constructor() {
    super()
    this.state = {
      email: '',
      portfolioList: [],

    }
  }

  componentDidMount() {
  }

  onClickTagUser(screen, item) {
    NavigationService.navigate(screen, { taggedItems: { productData: item.taggedProductsDetails } })
  }

  render() {
    return (
      <View style={[{ flex: 1, paddingBottom: 0, backgroundColor: 'white' }]}>
        {global.portfolioList.length > 0 ?
          <FlatList
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 10 }}
            data={global.portfolioList}
            refreshing={this.state.refreshing}
            renderItem={({ item, index }) =>
              <TouchableOpacity activeOpacity={1} style={{ flex: 1, flexDirection: 'column', alignItems: 'center', borderBottomColor: 'grey', borderBottomWidth: 1, paddingTop: 10, paddingBottom: 10 }}>
                {console.log(item.portfolio.media_path)}
                {item.portfolio.media_path ? <Image style={{ height: Dimensions.get('window').width, width: '100%', marginTop: 5 }} source={{ uri: item.portfolio.media_path }} />
                  : <Image style={{ height: Dimensions.get('window').width, width: '100%', marginTop: 5 }} source={require('../../assets/images/ic_placeholder.png')} />}
                <View style={{ width: '100%', flexDirection: 'column', paddingLeft: 5, paddingRight: 5, alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, width: '95%', color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman', marginTop: 5 }}>{item.portfolio.title}</Text>
                  <Text style={{ fontSize: 14, width: '95%', fontFamily: 'HelveticaNeueLTStd-Lt', color: 'black' }}>{item.portfolio.description}</Text>
                </View>
                {item.portfolio.status == 'video' ? <Image style={{ height: 50, width: 50, bottom: 0, top: 100, position: 'absolute' }} source={require('../../assets/images/video_icon.png')} /> : null}

                {item.portfolio.taggedProductsDetails.length > 0 && item.portfolio.taggedProductsDetails[0] ? <Text numberOfLines={1} onPress={() => this.onClickTagUser('ShowTagProductScreen', item.portfolio)} style={[homeStyle.tagText, { fontFamily: 'HelveticaNeueLTStd-Lt' }]}>Tagged Products: <Text style={homeStyle.tagText}>{item.portfolio.taggedProductsDetails[0].title}</Text>{item.portfolio.taggedProductsDetails.length > 1 ? <Text style={homeStyle.tagText}> and {item.portfolio.taggedProductsDetails.length - 1} others</Text> : null}</Text> : null}

              </TouchableOpacity>

            }
            keyExtractor={item => item.id}
          />
          :

          <View style={[{ flex: 1, padding: 10, paddingBottom: 0, }]}>
            <View style={[sellerStyle.dayView, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={[sellerStyle.dayStyle, { textAlign: 'center' }]}>No portfolio found</Text>
            </View>
          </View>}

      </View>
    )
  };

}




class SellerInfo extends React.Component {
  constructor() {
    super()
    this.state = {
      email: '',
      userInfo: {},
      businessDetails: {},
    }
  }


  componentDidMount() {

  }

  openSocialPage(url) {
    console.log(url)
    if (url && url != 'null')
      Linking.openURL(url.toLowerCase().includes('https://') ? url : 'https://' + url).catch((err) => alert("Not available"));
  }

  render() {
    return (
      <ScrollView style={{ width: '100%', height: '100%', backgroundColor: 'white' }} showsVerticalScrollIndicator={false}>
        <View style={[{ width: '100%', height: '100%', padding: 10 }]}>
          {global.businessDetails.address ? <View style={{ width: '100%', borderBottomColor: 'grey', borderBottomWidth: 1, paddingTop: 10, paddingBottom: 10 }}>
            <Text style={sellerStyle.greyTitle}>Address</Text>
            <Text style={{ marginTop: 5, flex: 1, fontSize: 16, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'black' }}>{global.businessDetails.address}</Text>
          </View> : null}

          {global.userInfo.experience ? <View style={{ width: '100%', borderBottomColor: 'grey', borderBottomWidth: 1, paddingTop: 10, paddingBottom: 10 }}>
            <Text style={sellerStyle.greyTitle}>Total Experience</Text>
            <Text style={{ marginTop: 5, flex: 1, fontSize: 16, fontFamily: 'HelveticaNeueLTStd-Lt' }}>{global.userInfo.experience} years</Text>
          </View> : null}

          {global.userInfo.about ? <View style={{ width: '100%', borderBottomColor: 'grey', borderBottomWidth: 1, paddingTop: 10, paddingBottom: 10 }}>
            <Text style={sellerStyle.greyTitle}>About me</Text>
            <Text style={{ marginTop: 5, flex: 1, fontSize: 16, fontFamily: 'HelveticaNeueLTStd-Lt' }}>{global.userInfo.about}</Text>
          </View> : null}

          {global.businessDetails.fb_link && global.businessDetails.insta_link && global.businessDetails.twitter_link ?
            <View>
              <Text style={[sellerStyle.greyTitle, { padding: 10, paddingLeft: 5 }]}>Follow us</Text>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {global.businessDetails.fb_link ? <TouchableOpacity activeOpacity={1} onPress={() => this.openSocialPage(global.businessDetails.fb_link)}>
                  <Image style={sellerStyle.socialIcon} source={require('../../assets/images/fb.png')} />
                </TouchableOpacity> : null}

                {global.businessDetails.insta_link ? <TouchableOpacity activeOpacity={1} onPress={() => this.openSocialPage(global.businessDetails.insta_link)}>
                  <Image style={sellerStyle.socialIcon} source={require('../../assets/images/insta.png')} />
                </TouchableOpacity> : null}

                {global.businessDetails.twitter_link ? <TouchableOpacity activeOpacity={1} onPress={() => this.openSocialPage(global.businessDetails.twitter_link)}>
                  <Image style={sellerStyle.socialIcon} source={require('../../assets/images/tw.png')} />
                </TouchableOpacity> : null}
              </View>
            </View> : null}

        </View>
      </ScrollView>
    )
  };

}



class SellerAvalibalities extends React.Component {
  constructor() {
    super()
    this.state = {
      email: '',
      availabilityList: {},

    }
  }


  componentDidMount() {
  }


  render() {
    return (
      <View style={[{ flex: 1, paddingBottom: 0, backgroundColor: 'white' }]}>
        {global.availabilityList ?
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[{ flex: 1, padding: 10, paddingBottom: 0, }]}>

              <View style={sellerStyle.dayView}>
                <Text style={sellerStyle.dayStyle}>Monday</Text>
                {global.availabilityList.monday_start_time ? <Text style={sellerStyle.timeStyle}>{moment(global.availabilityList.monday_start_time, 'hh:mm A').format('hh:mm A')} to {moment(global.availabilityList.monday_end_time, 'hh:mm A').format('hh:mm A')}</Text>
                  : <Text style={sellerStyle.timeStyle}>Closed</Text>}

              </View>

              <View style={sellerStyle.dayView}>
                <Text style={sellerStyle.dayStyle}>Tuesday</Text>
                {global.availabilityList.tuesday_end_time ? <Text style={sellerStyle.timeStyle}>{moment(global.availabilityList.tuesday_start_time, 'hh:mm A').format('hh:mm A')} to {moment(global.availabilityList.tuesday_end_time, 'hh:mm A').format('hh:mm A')}</Text>
                  : <Text style={sellerStyle.timeStyle}>Closed</Text>}
              </View>

              <View style={sellerStyle.dayView}>
                <Text style={sellerStyle.dayStyle}>Wednesday</Text>
                {global.availabilityList.wednesday_start_time ? <Text style={sellerStyle.timeStyle}>{moment(global.availabilityList.wednesday_start_time, 'hh:mm A').format('hh:mm A')} to {moment(global.availabilityList.wednesday_end_time, 'hh:mm A').format('hh:mm A')}</Text>
                  : <Text style={sellerStyle.timeStyle}>Closed</Text>}
              </View>

              <View style={sellerStyle.dayView}>
                <Text style={sellerStyle.dayStyle}>Thursday</Text>
                {global.availabilityList.thursday_start_time ? <Text style={sellerStyle.timeStyle}>{moment(global.availabilityList.thursday_start_time, 'hh:mm A').format('hh:mm A')} to {moment(global.availabilityList.thursday_end_time, 'hh:mm A').format('hh:mm A')}</Text>
                  : <Text style={sellerStyle.timeStyle}>Closed</Text>}
              </View>


              <View style={sellerStyle.dayView}>
                <Text style={sellerStyle.dayStyle}>Friday</Text>
                {global.availabilityList.friday_start_time ? <Text style={sellerStyle.timeStyle}>{moment(global.availabilityList.friday_start_time, 'hh:mm A').format('hh:mm A')} to {moment(global.availabilityList.friday_end_time, 'hh:mm A').format('hh:mm A')}</Text>
                  : <Text style={sellerStyle.timeStyle}>Closed</Text>}
              </View>

              <View style={sellerStyle.dayView}>
                <Text style={sellerStyle.dayStyle}>Saturday</Text>
                {global.availabilityList.saturday_start_time ? <Text style={sellerStyle.timeStyle}>{moment(global.availabilityList.saturday_start_time, 'hh:mm A').format('hh:mm A')} to {moment(global.availabilityList.saturday_end_time, 'hh:mm A').format('hh:mm A')}</Text>
                  : <Text style={sellerStyle.timeStyle}>Closed</Text>}
              </View>

              <View style={sellerStyle.dayView}>
                <Text style={sellerStyle.dayStyle}>Sunday</Text>
                {global.availabilityList.sunday_start_time ? <Text style={sellerStyle.timeStyle}>{moment(global.availabilityList.sunday_start_time, 'hh:mm A').format('hh:mm A')} to {moment(global.availabilityList.sunday_end_time, 'hh:mm A').format('hh:mm A')}</Text>
                  : <Text style={sellerStyle.timeStyle}>Closed</Text>}
              </View>

              {/* <FlatList
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          data={this.state.availabilityList}
          refreshing={this.state.refreshing}
          renderItem={({ item, index }) =>
            <View style={{ flex: 1, padding: 10, flexDirection: 'row', borderBottomColor: '#d7dada', borderBottomWidth: 1, marginBottom: 8 }}>
              <Text style={{ flex: 1, fontSize: 16, fontFamily: 'HelveticaNeueLTStd-Lt' }}>{item.availabilityDay}</Text>
              <Text style={{ fontSize: 16, fontFamily: 'HelveticaNeueLTStd-Lt' }}>{item.time}</Text>
            </View>

          }
          keyExtractor={item => item.id}
        /> */}

            </View>
          </ScrollView> :


          <View style={[{ flex: 1, padding: 10, paddingBottom: 0, }]}>
            <View style={[sellerStyle.dayView, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={[sellerStyle.dayStyle, { textAlign: 'center' }]}>No availability found</Text>
            </View>
          </View>

        }
      </View>)
  };

}


class SellerProfile extends Component {

  constructor() {
    super()
    this.state = {
      userInfo: {},
      businessDetails: {},
      reviewsCount: '',
      likeStatus: false,
      temp: 0,
    }
  }


  componentDidMount() {
    this.props.navigation.addListener(
      'willFocus',
      () => {
        this.getPorviderInfo();
        this.setState({ totalService: 0, temp: this.state.temp + 1 })
        global.prevScreen = '';
        global.prevScreenOrder = '';
      }
    );
  }


  getPorviderInfo() {
    // EventRegister.emit('loader', false)
    ApiCaller.call('users/' + global.providerID + '/details', "GET", null, true)
      .then((response) => {
        EventRegister.emit('loader', false)
        if (response) {
          console.log("portfolio user ===>>>>", response.products)

          global.serviceList = response.services
          global.productList = response.products
          global.portfolioList = response.portfolios
          global.userInfo = response.user
          global.businessDetails = response.businessDetails
          global.availabilityList = response.availability



          this.setState({ userInfo: response.user, businessDetails: response.businessDetails, reviewsCount: response.reviewsCount, likeStatus: response.isMyFavorite })

        }
      })
      .catch((error) => {
        console.log("ErrorLogin", error);
      })
  }

  onClickReview() {
    this.props.navigation.navigate('ReviewScreen')
  }


  onPressFav() {
    ApiCaller.call('users/' + this.state.userInfo.id + '/favorite', "GET", null, true)
      .then((response) => {
        if (response) {
          console.log("likeeee ===>>>>", response)

          this.setState({ likeStatus: response.isMyfavorite })

        }
      })
      .catch((error) => {
        console.log("ErrorLogin", error);
      })
  }


  render() {
    const placeholder = {
      label: 'Select a sport...',
      value: null,
      color: '#9EA0A4',
    };
    return (
      <View style={styles.container}>
        <View>
          <ImageBackground style={{ height: 250, width: '100%', }} source={this.state.userInfo.cover_pic_path ? { uri: this.state.userInfo.cover_pic_path } : require('../../assets/images/ic_placeholder.png')}>
            <Image style={{ height: 250, width: '100%' }} source={require('../../assets/images/back.png')} />
            <View style={{ width: '100%', position: 'absolute', paddingTop: Platform.OS == 'ios' ? 40 : 0 }}>
              <View style={[styles.childViewContainer]}>

                <TouchableOpacity activeOpacity={1} style={{ paddingLeft: 5, flex: 1 }} onPress={() => this.props.navigation.goBack()}>
                  <Image style={styles.imgtop} source={require('../../assets/images/back_white.png')} />
                </TouchableOpacity>

                <Text style={[styles.headertext]}>Profile</Text>

                <TouchableOpacity activeOpacity={1} style={{ paddingRight: 5, flex: 1, alignItems: 'flex-end' }} onPress={() => this.onPressFav()}>
                  {this.state.likeStatus ? <Image style={{ height: 50, width: 50, right: -8 }} resizeMode={'cover'} source={require('../../assets/images/heart_fill.png')} />
                    : <Image style={styles.imgtop} source={require('../../assets/images/heart_white.png')} />}
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flexDirection: 'row', bottom: 20, position: 'absolute', width: '100%' }}>
              {this.state.userInfo.profile_pic_path ? <Image style={{ height: 90, width: 90, marginLeft: 10, borderRadius: 45 }} source={{ uri: this.state.userInfo.profile_pic_path }} />
                : <Image style={{ height: 90, width: 90, marginLeft: 10, borderRadius: 45 }} source={require('../../assets/images/ic_placeholder.png')} />}

              <View style={{ flexDirection: 'column', marginLeft: 10, marginTop: 10, width: '100%' }}>
                <Text style={{ color: '#fff', marginLeft: 5, fontSize: 16, fontFamily: 'HelveticaNeueLTStd-Md' }}>{this.state.userInfo.first_name ? this.state.userInfo.first_name + " " + this.state.userInfo.last_name : this.state.businessDetails.name}</Text>
                <View style={{ width: '60%', flexDirection: 'row' }}>
                  <Image style={{ height: 15, width: 15, marginTop: 3, marginLeft: 3 }} source={require('../../assets/images/location_white.png')} />
                  <Text numberOfLines={2} style={{ color: '#fff', marginLeft: 2, fontSize: 14 }}>{this.state.businessDetails.address}</Text>
                </View>

                <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center' }}>
                  <StarRating
                    activeOpacity={1}
                    starSize={18}
                    containerStyle={{ width: '20%', paddingTop: 5 }}
                    rating={0}
                    emptyStarColor={'#ED8A19'}
                    fullStarColor={'#ED8A19'}
                  />
                  {this.state.reviewsCount ? <Text onPress={() => null} style={{ flex: 1, color: '#fff', paddingLeft: 15, fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt', textDecorationLine: 'underline', paddingTop: Platform.OS === 'ios' ? 8 : 5 }}>{this.state.reviewsCount} Reviews</Text> : null}

                  {/* {this.state.reviewsCount ? <Text onPress={() => this.onClickReview()} style={{ flex: 1, color: '#fff', paddingLeft: 15, fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt', textDecorationLine: 'underline', paddingTop: Platform.OS === 'ios' ? 8 : 5 }}>{this.state.reviewsCount} Reviews</Text> : null} */}
                </View>


              </View>
            </View>
          </ImageBackground>
        </View>
        <CustomTabView navigation={this.props.navigation} />
      </View>
    );
  }

}


export function CustomTabView(props) {
  console.log("props", props)
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: '0', title: 'Services' },
    { key: '1', title: 'Products' },
    { key: '2', title: 'Portfolio' },
    { key: '3', title: 'Basic Info' },
    { key: '4', title: 'Availabilities' },
  ]);


  const renderScene = ({ route }) => {
    console.log("ffff", route)
    switch (route.key) {
      case '0':
        return <SellerService props={props} />;
      case '1':
        return <SellerProduct />;
      case '2':
        return <SellerPortfolio />;
      case '3':
        return <SellerInfo />;
      case '4':
        return <SellerAvalibalities />;
      default:
        return null;
    }
  };


  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#47CACC' }}
      scrollEnabled={true}
      renderLabel={({ route, focused, color }) => <Text style={{ color: focused == true ? '#000' : '#8d8d8d' }}>{route.title}</Text>}
      style={{ backgroundColor: '#F0EFEF', elevation: 0 }}
      contentContainerStyle={{ width: 'auto' }}
      tabStyle={{ width: 'auto' }}
      indicatorContainerStyle={{ width: 'auto' }}
    />
  );


  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent'
  },
  childViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    height: 40,
    backgroundColor: 'transparent'
  },
  imgtop: {
    height: 35,
    width: 35,
  },
  headertext: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff'
  },
  titletext: {
    color: '#B3B3B3',
    paddingRight: 10,
    paddingLeft: 20,
    marginTop: 20
  },
  SectionStylepicker: {
    flexDirection: 'row',
    borderBottomWidth: .5,
    borderColor: '#B3B3B3',
    height: 40,
    borderRadius: 5,
    marginLeft: 15,
    marginRight: 10,
    width: '90%'

  },
  SectionStyle: {
    flexDirection: 'row',
    borderBottomWidth: .5,
    borderColor: '#B3B3B3',
    height: 40,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    width: '90%'

  },
  SectionStyleDescription: {
    height: 80,
    flexDirection: 'row',
    borderBottomWidth: .5,
    borderColor: '#B3B3B3',
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    width: '90%',
  },
  categorytext: {
    color: '#B3B3B3',
    paddingRight: 10,
    paddingLeft: 20
  },
  placeholder: {
    color: 'purple',
    fontSize: 12,
    fontWeight: 'bold',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 18,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: '95%', // to ensure the text is never behind the icon
  },
});


export default SellerProfile;






