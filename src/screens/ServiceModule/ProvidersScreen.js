import React, { Component, Fragment } from 'react'
import { View, ImageBackground, Image, Text, TouchableOpacity, TextInput, ScrollView, FlatList, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import Toasty from '../../elements/Toasty';
import serviceStyle from './serviceStyle'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import StarRating from 'react-native-star-rating';
import Modal from 'react-native-modal';
import CheckBox from 'react-native-check-box';
import ApiCaller from '../../constants/ApiCaller';
import { EventRegister } from 'react-native-event-listeners';



export default class ProvidersScreen extends Component {

    constructor() {
        super()
        this.state = {
            radio: 0,
            favRadio: 0,
            email: '',
            searchTitle: '',
            modalVisible: false,
            providerList: [],
            servicename: '',
            filterRating: 0
        }
    }



    componentDidMount() {
        this.props.navigation.addListener(
            'willFocus',
            () => {
                this.setState({ servicename: this.props.navigation.getParam('servicename') })
                this.providerApiCall();
                handleAndroidBackButton(() => this.props.navigation.goBack())
            }
        );
    }


    componentWillMount() {

    }




    componentWillUnmount() {
        removeAndroidBackButtonHandler();
    }



    handleTitleInputSubmit = () => {
        this.setState({ focusInput: true });
    }


    backPress() {
        this.props.navigation.goBack()
    }

    onMapClick(item) {
        this.props.navigation.navigate('MapScreen');
    }

    onSellerClick(item) {
        global.providerID = item.user.id
        this.props.navigation.navigate('SellerProfile');
    }


    modalOpen() {
        this.setState({ modalVisible: 'sliding' });
    }

    submitFilter() {

        if (this.state.filterRating == 0) {
            Toasty.show('Please select rating')
        }
        else {

            var data = JSON.stringify({
                "filterRating": this.state.filterRating,
                "low": this.state.radio == 0 ? true : false,
                "favorites": this.state.favRadio == 1 ? true : false,
            })
            console.log(data)

            ApiCaller.call('users/filter', "POST", data, true)
                .then((response) => {
                    if (response) {
                        console.log(response.providersList)
                        this.setState({ providerList: response.providersList, modalVisible: false })
                    }
                })
                .catch((error) => {
                    console.log("ErrorLogin", error);
                })
        }

    }

    resetFilter() {
        this.setState({ modalVisible: false, radio: 0, filterRating: 0, favRadio: 0 });
    }

    onSearch() {

    }


    updateSearch = searchTitle => {
        var titleSearch = searchTitle;
        this.setState({ searchTitle });

        if (searchTitle != "") {
            this.providerSearchCall(titleSearch.trim());
        } else {
            this.setState({ peopleList: [] })
        }
    };


    providerSearchCall(searchhhh) {
        ApiCaller.call('users/providers?search=' + searchhhh + '&type=' + global.typeOfChoice + '&service_category_id=' + this.props.navigation.getParam('services'), "GET", null, true)
            .then((response) => {

                if (response) {
                    console.log("search ===>>>>", JSON.stringify(response))
                    this.setState({ providerList: this.state.searchTitle ? response.providersList : [] })

                    // this.state.searchTitle ? null : this.providerApiCall('')
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }


    providerApiCall() {
        EventRegister.emit('loader', true)
        ApiCaller.call('users/providers?service_category_id=' + this.props.navigation.getParam('services') + '&type=' + global.typeOfChoice, "GET", null, true)
            // ApiCaller.call('users/providers?service_category_id=[' + this.props.navigation.getParam('services') + "]", "GET", null, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("service===>>>>", response)
                    this.setState({ providerList: response.providersList })
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }


    onPressFav(item) {
        ApiCaller.call('users/' + item.user.id + '/favorite', "GET", null, true)
            .then((response) => {
                if (response) {
                    console.log("portfolio user ===>>>>", response)
                    this.providerApiCall('')
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })

    }


    onFilterRating(rating) {
        this.setState({
            filterRating: rating
        });
    }


    render() {
        return (
            <Fragment>

                <SafeAreaView style={[serviceStyle.statusColor]} />
                <SafeAreaView style={serviceStyle.bottomColor}>

                    <View style={{ flex: 1 }}>
                        <View style={{ width: '100%', paddingTop: 10, paddingBottom: 10, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity style={{ flex: 0.1, paddingLeft: 10 }} activeOpacity={0.9}
                                onPress={() => this.backPress()}>
                                <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../../assets/images/back_arrow.png')} />
                            </TouchableOpacity>

                            <Text style={{ flex: 0.8, color: 'black', fontSize: 20, textAlign: 'center', fontFamily: 'HelveticaNeueLTStd-Roman' }}>{this.state.servicename}</Text>


                            <TouchableOpacity style={{ flex: 0.1 }} activeOpacity={0.9}
                                onPress={() => this.onMapClick()}>
                                <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../../assets/images/ic_map.png')} />
                            </TouchableOpacity>

                            <TouchableOpacity style={{ flex: 0.1 }} activeOpacity={0.9}
                                onPress={() => this.modalOpen()}>
                                <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../../assets/images/filter.png')} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={[{ flex: 1, }]}>

                                <View style={{ margin: 10, flex: 1, flexDirection: 'row', backgroundColor: '#EFEEEE', borderRadius: 30, alignItems: 'center' }}>
                                    <TouchableOpacity style={{ paddingLeft: 20 }} onPress={() => this.onSearch()}>
                                        <Image style={serviceStyle.imageSend} source={require('../../assets/images/search_black.png')} />
                                    </TouchableOpacity>

                                    <TextInput style={serviceStyle.textInput}
                                        placeholder="Search Service provider"
                                        fontSize={16}
                                        fontFamily={'HelveticaNeueLTStd-Lt'}
                                        placeholderTextColor={'black'}
                                        blurOnSubmit={true}
                                        returnKeyType={'done'}
                                        onChangeText={this.updateSearch}
                                        value={this.state.searchTitle} />
                                </View>

                                <FlatList
                                    scrollEnabled={false}
                                    data={this.state.providerList}
                                    contentContainerStyle={{ marginTop: 5 }}
                                    refreshing={this.state.refreshing}
                                    renderItem={({ item, index }) =>
                                        <View style={{ flex: 1, borderBottomColor: '#d7dada', marginLeft: 8, marginRight: 8, borderBottomWidth: 1, marginBottom: 8 }}>
                                            <TouchableOpacity activeOpacity={1} style={{ flex: 1, flexDirection: 'column', paddingBottom: 8, alignItems: 'center' }} onPress={() => this.onSellerClick(item)}>
                                                <View style={{ flexDirection: 'row', width: '100%' }}>


                                                    {item.user.profile_pic_path ? <Image style={{ height: 70, width: 70, borderRadius: 10 }} source={{ uri: item.user.profile_pic_path }} />
                                                        : <Image style={{ height: 70, width: 70, borderRadius: 10 }} source={require('../../assets/images/ic_placeholder.png')} />}

                                                    <View style={{ flex: 1, paddingLeft: 10, justifyContent: 'center' }}>
                                                        <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Roman' }}>{item.user.first_name ? item.user.first_name + ' ' + item.user.last_name : item.businessDetails.name}</Text>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <StarRating
                                                                activeOpacity={1}
                                                                disabled={false}
                                                                starSize={18}
                                                                fullStarColor={'#ED8A19'}
                                                                rating={item.rating}
                                                            />
                                                            {item.reviews_count ? <Text style={{ fontSize: 14, color: 'grey', fontFamily: 'HelveticaNeueLTStd-Roman', marginLeft: 5, paddingTop: Platform.OS === 'ios' ? 5 : 0, }}>{item.reviews_count.count}</Text> : null}
                                                        </View>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Image style={{ height: 20, width: 20 }} source={require('../../assets/images/location_black.png')} />
                                                            <Text style={{ fontSize: 14, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt', paddingTop: Platform.OS === 'ios' ? 5 : 0, }}>{item.businessAddress}</Text>
                                                        </View>
                                                    </View>

                                                    <TouchableOpacity activeOpacity={0.9} onPress={() => this.onPressFav(item)}>
                                                        {item.isMyFavorite ? <Image style={{ height: 40, width: 40, marginRight: 5, marginTop: -5 }} source={require('../../assets/images/heart_fill.png')} /> : <Image style={{ height: 40, width: 40, marginRight: 5, marginTop: -5 }} source={require('../../assets/images/heart_overlay.png')} />}
                                                    </TouchableOpacity>
                                                </View>
                                            </TouchableOpacity>

                                        </View>

                                    }
                                    keyExtractor={item => item.id}
                                />

                            </View>
                        </ScrollView>
                        <Modal
                            coverScreen={true}
                            style={{ margin: 0, marginLeft: '30%' }}
                            isVisible={this.state.modalVisible === 'sliding'}
                            animationInTiming={1000}
                            animationOutTiming={1000}
                            animationIn="slideInRight"
                            animationOut="slideOutRight"
                            backdropTransitionInTiming={800}
                            backdropTransitionOutTiming={800}>


                            <View style={{ flex: 1, backgroundColor: 'tranparent', flexDirection: 'row' }}>

                                <View style={{ width: '100%', height: '100%', backgroundColor: 'white' }}>
                                    <View style={{ height: 'auto', backgroundColor: 'white', padding: 20, marginTop: Platform.OS === 'ios' ? 10 : 0, }}>

                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ flex: 1, fontSize: 20, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md' }}>Filter</Text>
                                            <TouchableOpacity activeOpacity={1} onPress={() => this.submitFilter()}>
                                                <Image style={{ height: 20, width: 20, }} source={require('../../assets/images/cross.png')} />
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{ flexDirection: 'column', paddingTop: 40, paddingBottom: 10 }}>
                                            <Text style={serviceStyle.filterHeader}>Rating</Text>
                                            <StarRating
                                                containerStyle={{ width: 50, paddingTop: 10, paddingBottom: 10 }}
                                                starStyle={{ paddingRight: 5 }}
                                                disabled={false}
                                                starSize={30}
                                                maxStars={5}
                                                emptyStarColor={'#ED8A19'}
                                                fullStarColor={'#ED8A19'}
                                                rating={this.state.filterRating}
                                                selectedStar={(filterRating) => this.onFilterRating(filterRating)}
                                            />
                                        </View>


                                        <View style={{ flexDirection: 'column', paddingTop: 15, paddingBottom: 15, borderBottomColor: 'grey', borderBottomWidth: 1, borderTopColor: 'grey', borderTopWidth: 1 }}>
                                            <Text style={serviceStyle.filterHeader}>Price</Text>

                                            <View style={{ flexDirection: 'row', paddingTop: 15, paddingBottom: 15, alignItems: 'center' }}>
                                                <CheckBox
                                                    isChecked={this.state.radio == 0}
                                                    checkedImage={<Image style={serviceStyle.filterCheckImg} source={require('../../assets/images/checked.png')} />}
                                                    unCheckedImage={<Image style={serviceStyle.filterCheckImg} source={require('../../assets/images/unchecked.png')} />}
                                                    onClick={() => this.setState({ radio: 0 })} />

                                                <Text style={serviceStyle.fiterCheckText}>Low to High</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <CheckBox
                                                    isChecked={this.state.radio == 1}
                                                    checkedImage={<Image style={serviceStyle.filterCheckImg} source={require('../../assets/images/checked.png')} />}
                                                    unCheckedImage={<Image style={serviceStyle.filterCheckImg} source={require('../../assets/images/unchecked.png')} />}
                                                    onClick={() => this.setState({ radio: 1 })} />

                                                <Text style={serviceStyle.fiterCheckText}>High to Low</Text>
                                            </View>
                                        </View>



                                        <View style={{ flexDirection: 'column', paddingTop: 15, paddingBottom: 15 }}>
                                            <Text style={serviceStyle.filterHeader}>Favourites</Text>

                                            <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10, alignItems: 'center' }}>
                                                <CheckBox
                                                    isChecked={this.state.favRadio == 1}
                                                    checkedImage={<Image style={serviceStyle.filterCheckImg} source={require('../../assets/images/checked.png')} />}
                                                    unCheckedImage={<Image style={serviceStyle.filterCheckImg} source={require('../../assets/images/unchecked.png')} />}
                                                    onClick={() => this.setState({ favRadio: 1 })} />

                                                <Text style={serviceStyle.fiterCheckText}>Favourites only</Text>
                                            </View>

                                        </View>



                                        <TouchableOpacity activeOpacity={1} style={[serviceStyle.buttonStyle, { width: 200, marginTop: 20, marginBottom: 15, alignSelf: 'center' }]}
                                            onPress={() => this.submitFilter()}>
                                            <Text style={serviceStyle.buttonTextStyle}>Submit</Text>
                                        </TouchableOpacity>


                                        <TouchableOpacity activeOpacity={1} style={{
                                            width: 200, marginBottom: 25, padding: 15, borderRadius: 50,
                                            alignItems: 'center', backgroundColor: 'white', alignSelf: 'center'
                                        }}
                                            onPress={() => this.resetFilter()}>
                                            <Text style={[serviceStyle.buttonTextStyle, { color: 'black' }]}>Reset</Text>
                                        </TouchableOpacity>


                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }
}

