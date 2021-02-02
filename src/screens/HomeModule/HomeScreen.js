import React, { Component, Fragment } from 'react';
import { Modal, View, ToastAndroid, Animated, Image, Text, TouchableOpacity, Dimensions, ScrollView, FlatList, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView, TextInput, EventEmitter } from 'react-native';
import Toasty from '../../elements/Toasty';
import homeStyle from './homeStyle'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import ApiCaller from '../../constants/ApiCaller';
import { EventRegister } from 'react-native-event-listeners'
import moment from 'moment';
import Storage from '../../constants/Storage';
import VideoPlayer from 'react-native-video-player';
import ChatHelper from '../ChatModule/ChatHelper';
import ReactNativeModal from 'react-native-modal';
import WebView from 'react-native-webview';


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');


export default class HomeScreen extends Component {

    constructor(props) {
        super(props)
        this.handleBackPress = this.handleBackPress.bind(this);
        this.springValue = new Animated.Value(100);
        this.state = {
            x: new Animated.Value(-100),
            backClickCount: 0,
            userInfo: { gender: '' },
            searchText: '',
            portfolioList: [],
            serviceList: [],
            showSearchStatus: false,
            showService: [],
            gender: '',
            modalVisible: false,
            allPosts: [],
            videoUrl: '',
            videoThumb: '',
        }
    }

    toggleModal(visible, videoUrl, videoThumb) {
        this.setState({ modalVisible: visible, videoUrl: videoUrl, videoThumb: videoThumb });
    }

    componentWillMount() {
    }


    checkIfUserExistOnFirebase() {

        Storage.get('loginData').then(loginData => {
            var userData = JSON.parse(loginData)
            console.log(loginData)
            if (userData != null) {
                global.userId = userData.user.id
                ChatHelper.checkUser(userData.user.id).then(isAvailable => {
                    console.log(">>>>>>>>>>>>", isAvailable)
                    if (isAvailable) {
                        return isAvailable
                    } else {
                        let data = {
                            id: userData.user.id,
                            email: userData.user.email,
                            name: userData.user.first_name + '-' + userData.user.last_name,
                            image: userData.user.profile_pic_path
                        }
                        ChatHelper.addUser(data).then(res => {
                            if (res) {
                                return true
                                //New user added
                            }
                        })
                    }
                }).catch(err => console.log(err))
            }
        })
    }

    componentDidMount() {
        this.serviceApiCall()
        this.props.navigation.addListener(
            'willFocus',
            () => {
                Storage.get('loginData').then(loginData => {
                    var userData = JSON.parse(loginData)
                    this.setState({ gender: userData.user.gender })
                })
                this.serviceApiCall()
                this.checkIfUserExistOnFirebase()
                BackHandler.addEventListener('hardwareBackPress', () => {
                    if (global.myvar == 'Home' || global.myvar == 'MyCart' || global.myvar == 'AddPost' || global.myvar == 'MyBookings' || global.myvar == 'Profile') {
                        this.handleBackPress()
                        return true;
                    }
                    else {
                        return false;
                    }
                });
            }
        );
    }




    handleBackPress() {
        if (global.myvar == 'Home' || global.myvar == 'MyCart' || global.myvar == 'AddPost' || global.myvar == 'MyBookings' || global.myvar == 'Profile') {
            this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring();
            return true;
        }
        else {
            this.props.navigation.goBack()
        }
    }



    _spring() {
        ToastAndroid.show('Press back button again to exit', ToastAndroid.SHORT);
        this.setState({ backClickCount: 1 }, () => {
            Animated.sequence([
                Animated.spring(
                    this.springValue,
                    {
                        toValue: -.15 * viewportHeight,
                        friction: 5,
                        duration: 300,
                        useNativeDriver: true,
                    }
                ),
                Animated.timing(
                    this.springValue,
                    {
                        toValue: 100,
                        duration: 300,
                        useNativeDriver: true,
                    }
                ),

            ]).start(() => {
                this.setState({ backClickCount: 0 });
            });
        });

    }


    handleTitleInputSubmit = () => {
        this.setState({ focusInput: true });
    }


    onClickServices(screen, postID) {
        if (screen == 'DetailScreen') {
            this.props.navigation.navigate(screen, { post_id: postID })
        } else {
            if (postID) {
                var genderToSend = '';
                postID == 'Female' ? genderToSend = 'F' : genderToSend = 'M';
                global.typeOfChoice = genderToSend;
                this.props.navigation.navigate(screen)
            }
            else {
                global.typeOfChoice = 'A';
                this.props.navigation.navigate(screen)
            }

        }
    }

    onClickProduct(callScreen) {
        if (callScreen == 'Find Product') {
            this.props.navigation.navigate('ProductsScreen', { titleName: 'Products' })
        }
        else {
            this.props.navigation.navigate('ProductsScreen', { titleName: 'Popular Products' })
        }
    }

    drawerOpen() {
        this.props.navigation.toggleDrawer();
    }

    onSerchClick() {
        if (this.state.showSearchStatus == true) {
            this.setState({ showSearchStatus: false, searchText: '' })
            this.homeApiCall()
        }
        else {
            this.setState({ showSearchStatus: true })
        }
    }

    notificationClick(screen) {
        this.props.navigation.navigate(screen)
    }

    serviceApiCall() {
        ApiCaller.call('serviceCategories', "GET", null, true)
            .then((response) => {
                if (response) {
                    console.log("service===>>>>", response)
                    this.setState({ serviceList: response.service_categories })
                    this.homeApiCall()
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }

    postsNum = 10

    homeApiCall() {
        EventRegister.emit('loader', true)
        ApiCaller.call('posts', "GET", null, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("posts===>>> ", response)
                    this.setState({
                        portfolioList: response.totalPosts.slice(0, 10),
                        allPosts: response.totalPosts
                    })
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }

    showNextPosts = () => {
        // alert(">>>")
        this.setState({ portfolioList: this.state.allPosts.slice(0, this.postsNum) }, () => {
            this.postsNum = this.postsNum + 10
        })
    }


    likeApiCall(postID) {
        // EventRegister.emit('loader', true)
        ApiCaller.call('posts/' + postID + '/like', "GET", null, true)
            .then((response) => {
                // EventRegister.emit('loader', false)
                if (response) {
                    console.log("Like response", response)
                    this.homeApiCall()
                }
            })
            .catch((error) => {
                console.log("ErrorLike", error);
            })
    }

    onReport(item) {
        // EventRegister.emit('loader', true)
        ApiCaller.call('posts/' + item.postDetails.id + '/report', "GET", null, true)
            .then((response) => {
                // EventRegister.emit('loader', false)
                if (response) {
                    console.log("repot home ====>>>>", response)
                    this.homeApiCall()
                }
            })
            .catch((error) => {
                console.log("report error", error);
            })
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

    searchApiCall(searchName) {
        ApiCaller.call('posts?search=' + searchName, "GET", null, true)
            .then((response) => {
                console.log("search response", JSON.stringify(response))
                if (response) {
                    this.setState({ portfolioList: response.totalPosts, allPosts: response.totalPosts })
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }

    onClickServiceItem(item, index) {
        var showService = [];
        showService[index] = !showService[index];
        this.setState({ showService: showService, });
        EventRegister.emit('loader', true)
        ApiCaller.call('posts?id=' + item.id, "GET", null, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    // console.log("on Click Service ==>>", response.totalPosts)
                    this.setState({ portfolioList: response.totalPosts, allPosts: response.totalPosts })
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }

    onClickTagUser(screen, item) {
        this.props.navigation.navigate(screen, { taggedItems: item })
    }

    componentWillReceiveProps() {
        this.setState({ showService: [] })
        StatusBar.setBackgroundColor('#000000');
        StatusBar.setBarStyle('light-content');
    }

    render() {
        return (
            <Fragment>
                {Platform.OS == 'ios' ? <StatusBar barStyle="dark-content" translucent={true} /> : <StatusBar hidden={false} barStyle="light-content" backgroundColor="black" translucent={false} />}

                <SafeAreaView style={[homeStyle.statusColor, { backgroundColor: 'black' }]} />
                <SafeAreaView style={homeStyle.bottomColor}>
                    {Platform.OS == 'ios' ? <StatusBar barStyle="light-content" translucent={true} /> : null}

                    <View style={{ flex: 1 }}>
                        <View style={{ width: '100%', paddingTop: 10, paddingBottom: 10, backgroundColor: 'black', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity style={{ flex: 0.1, paddingLeft: 10 }} activeOpacity={0.9}
                                onPress={() => this.drawerOpen()}>
                                <Image style={{ width: 22, height: 22, resizeMode: 'contain' }} source={require('../../assets/images/menu.png')} />
                            </TouchableOpacity>

                            {this.state.showSearchStatus ?
                                <View style={{ flexDirection: 'row', flex: 0.9, alignItems: 'center', borderRadius: 10, backgroundColor: '#fff' }}>

                                    <View style={{ height: 38, flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                        <Image style={{ height: 20, width: 20, marginLeft: 10, }} source={require('../../assets/images/search_black.png')} />
                                        <TextInput
                                            style={{ height: 45, fontSize: 15, fontFamily: 'HelveticaNeueLTStd-Lt', width: '80%', marginLeft: 10 }}
                                            placeholder="Search Posts by name"
                                            fontSize={16}
                                            fontFamily={'HelveticaNeueLTStd-Lt'}
                                            placeholderTextColor={'black'}
                                            value={this.state.searchText}
                                            onChangeText={this.updateSearch}
                                        />
                                    </View>

                                </View>
                                :
                                <Text style={{ flex: 0.9, color: 'white', paddingLeft: 20, fontSize: 20, textAlign: 'center', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Home</Text>
                            }


                            <View style={{ flexDirection: 'row', paddingLeft: 5 }}>
                                <TouchableOpacity style={{ paddingRight: 10 }} activeOpacity={0.9}
                                    onPress={() => this.onSerchClick()}>
                                    {this.state.showSearchStatus ? <Image style={{ width: 22, height: 22, resizeMode: 'contain' }} source={require('../../assets/images/white_cross.png')} />
                                        : <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/images/search.png')} />}
                                </TouchableOpacity>

                                <TouchableOpacity style={{ paddingRight: 10 }} activeOpacity={0.9}
                                    onPress={() => this.notificationClick('NotificationScreen')}>
                                    <Image style={{ width: 22, height: 22, resizeMode: 'contain' }} source={require('../../assets/images/notification.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* <ScrollView showsVerticalScrollIndicator={false}> */}
                        <View style={[{ flex: 1 }]}>

                            <FlatList
                                removeClippedSubviews
                                ListEmptyComponent={() => {
                                    return <View style={{ width: '100%', height: viewportHeight - 400, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md' }}>No data found</Text>
                                    </View>
                                }}
                                ListHeaderComponent={() => {
                                    return <View style={{ flex: 1 }}>

                                        <View style={[{ backgroundColor: 'black', height: 'auto', flexDirection: 'column', paddingTop: 10, paddingBottom: 10 }]}>
                                            <View style={{ flexDirection: 'row' }}>

                                                <TouchableOpacity style={homeStyle.touchService} activeOpacity={1} onPress={() => this.onClickServices('ServiceScreen', '')}>
                                                    <Image style={homeStyle.touchServiceBack} source={require('../../assets/images/looking_bac.png')} />
                                                    <View style={homeStyle.viewStyleService}>
                                                        <Image style={homeStyle.productImage} source={require('../../assets/images/looking.png')} />
                                                        <Text style={homeStyle.productText}>Looking for Services</Text>
                                                    </View>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={homeStyle.touchProduct} activeOpacity={1} onPress={() => this.onClickProduct('Find Product')}>
                                                    <Image style={homeStyle.touchServiceBack} source={require('../../assets/images/find_product_bac.png')} />
                                                    <View style={homeStyle.viewStyleService}>
                                                        <Image style={homeStyle.productImage} source={require('../../assets/images/find_product.png')} />
                                                        <Text style={homeStyle.productText}>Find Products</Text>
                                                    </View>
                                                </TouchableOpacity>

                                            </View>

                                            <View style={{ flexDirection: 'row' }}>

                                                <TouchableOpacity style={homeStyle.touchService} activeOpacity={1} onPress={() => this.onClickServices('ServiceScreen', this.state.gender)}>
                                                    <Image style={homeStyle.touchServiceBack} source={require('../../assets/images/popular_service_bac.png')} />
                                                    <View style={homeStyle.viewStyleService}>
                                                        <Image style={homeStyle.productImage}
                                                            source={this.state.gender == "Male" ? require('../../assets/images/popular_service.png')
                                                                : require('../../assets/images/woman.png')} />
                                                        <Text style={homeStyle.productText}>Popular {this.state.gender} Services</Text>
                                                    </View>
                                                </TouchableOpacity>

                                                <TouchableOpacity activeOpacity={1} style={homeStyle.touchProduct} onPress={() => this.onClickProduct('Popular Products')}>
                                                    <Image style={homeStyle.touchServiceBack} source={require('../../assets/images/popular_product_bac.png')} />
                                                    <View style={homeStyle.viewStyleService}>
                                                        <Image style={homeStyle.productImage} source={require('../../assets/images/popular_product.png')} />
                                                        <Text style={homeStyle.productText}>Popular Products</Text>
                                                    </View>
                                                </TouchableOpacity>

                                            </View>

                                        </View>

                                        <View style={{ backgroundColor: '#EFEEEE', height: 'auto' }}>

                                            <FlatList
                                                scrollEnabled={true}
                                                data={this.state.serviceList}
                                                horizontal={true}
                                                showsHorizontalScrollIndicator={false}
                                                refreshing={this.state.refreshing}
                                                renderItem={({ item, index }) =>
                                                    <TouchableOpacity activeOpacity={1} style={{ flex: 1, padding: 8, alignItems: 'center' }} onPress={() => this.onClickServiceItem(item, index)}>
                                                        <View style={{ backgroundColor: this.state.showService[index] == true ? '#4CC9CA' : null, padding: 5, width: '100%', alignItems: 'center', borderColor: '#4CC9CA', borderWidth: 2, borderRadius: 20 }}>
                                                            <Text numberOfLines={1} style={{ fontSize: 14, width: 100, color: this.state.showService[index] == true ? 'white' : 'black', fontFamily: 'HelveticaNeueLTStd-Lt', textAlign: 'center', paddingTop: Platform.OS === 'ios' ? 6 : 0, }}>{item.name}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                }
                                                keyExtractor={item => item.id}
                                            />

                                        </View>

                                    </View>
                                }}
                                data={this.state.portfolioList}
                                onEndReachedThreshold={0.5}
                                onEndReached={this.showNextPosts}
                                refreshing={this.state.refreshing}
                                renderItem={({ item, index }) =>
                                    <View style={{ flex: 1, borderBottomColor: '#d7dada', borderBottomWidth: 1, marginBottom: 8 }}>
                                        <TouchableOpacity activeOpacity={1} style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }} onPress={() => this.onClickServices('DetailScreen', item.postDetails.id)}>

                                            <View style={{ padding: 5, flexDirection: 'row', width: '100%', marginLeft: 10, alignItems: 'center' }}>
                                                {item.userData.profile_pic_path ? <Image style={{ height: 50, width: 50, borderRadius: 25 }} source={{ uri: item.userData.profile_pic_path }} />
                                                    : <Image style={{ height: 50, width: 50, borderRadius: 25 }} source={require('../../assets/images/ic_placeholder.png')} />}
                                                <View style={{ flex: 1, flexDirection: 'column', marginLeft: 10 }}>
                                                    <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md' }}>{item.postDetails.title}</Text>
                                                    <Text numberOfLines={1} style={{ fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey' }}>{moment(item.postDetails.created_at).fromNow(true)}</Text>
                                                </View>
                                            </View>

                                            <View style={{ height: item.taggedUser[0] ? Dimensions.get('window').width + 20 : Dimensions.get('window').width, width: '100%' }}>
                                                {/* <View style={{ flexDirection: 'row', marginTop: 5, position: 'absolute', left: 25, bottom: -10, zIndex: 9999 }}> */}
                                                {item.taggedUser[0] ? <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', marginTop: 5, position: 'absolute', left: 40, bottom: -10, zIndex: 9999 }} onPress={() => this.onClickTagUser('ShowTagUserScreen', item)}>
                                                    {item.taggedUser.map((dataItem, key) => (
                                                        <View>
                                                            {dataItem.profile_pic_path ? <Image style={{ height: 40, width: 40, borderRadius: 20, marginLeft: -10 }} source={{ uri: dataItem.profile_pic_path }} />
                                                                : <Image style={{ height: 40, width: 40, borderRadius: 20, marginLeft: -10 }} source={require('../../assets/images/ic_placeholder.png')} />}
                                                        </View>
                                                    ))}
                                                </TouchableOpacity>
                                                    : null}

                                                <View style={[homeStyle.portfolioImage]}>
                                                    {
                                                        item.postDetails.video_thumb && item.postDetails.media_path.includes('.mp4') ?
                                                            <View style={[homeStyle.portfolioImage, { backgroundColor: '#dcdcdc', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }]}>
                                                                <TouchableOpacity style={{ height: 50, width: 50, position: 'absolute', zIndex: 99999 }} onPress={() => { this.toggleModal(true, item.postDetails.media_path, item.postDetails.video_thumb) }}>
                                                                    <Image style={{ height: 50, width: 50, position: 'absolute' }} source={require('../../assets/images/video_icon.png')} />
                                                                </TouchableOpacity>
                                                                {item.postDetails.video_thumb ? <Image style={[homeStyle.portfolioImage]} source={{ uri: item.postDetails.video_thumb }} />
                                                                    : <Image style={[homeStyle.portfolioImage]} source={require('../../assets/images/ic_placeholder.png')} />}
                                                            </View>
                                                            :
                                                            <View>
                                                                {item.postDetails.media_path ? <Image style={[homeStyle.portfolioImage]} source={{ uri: item.postDetails.media_path }} />
                                                                    : <Image style={[homeStyle.portfolioImage]} source={require('../../assets/images/ic_placeholder.png')} />}
                                                            </View>
                                                    }
                                                </View>

                                            </View>
                                            <View style={{ padding: 5, flexDirection: 'column', width: '100%', alignItems: 'center' }}>
                                                <Text style={homeStyle.portfolioTitle}>{item.postDetails.service_name}</Text>
                                                <Text style={homeStyle.portfolioDes}>{item.postDetails.description}</Text>
                                                {item.productData[0] ? <Text numberOfLines={1} onPress={() => this.onClickTagUser('ShowTagProductScreen', item)} style={[homeStyle.tagText, { fontFamily: 'HelveticaNeueLTStd-Lt' }]}>Tag Products: <Text style={homeStyle.tagText}>{item.productData[0].title}</Text>{item.productData.length > 1 ? <Text style={homeStyle.tagText}> and {item.productData.length - 1} others</Text> : null}</Text> : null}
                                            </View>
                                        </TouchableOpacity>

                                        <View style={homeStyle.likeMainView}>

                                            <TouchableOpacity style={homeStyle.likeView} activeOpacity={1} onPress={() => this.likeApiCall(item.postDetails.id)}>
                                                {item.likedByMe ? <Image style={homeStyle.likeImage} source={require('../../assets/images/like_blue.png')} /> : <Image style={homeStyle.likeImage} source={require('../../assets/images/like.png')} />}
                                                <Text style={[homeStyle.likeText, { color: item.likedByMe ? '#4CC9CA' : 'grey' }]}>{item.postDetails.likes != 0 ? item.postDetails.likes : ''} Likes</Text>
                                            </TouchableOpacity>

                                            {/* <View style={homeStyle.likeView}> */}
                                            <TouchableOpacity style={homeStyle.likeView} activeOpacity={1} onPress={() => this.onClickServices('DetailScreen', item.postDetails.id)}>
                                                <Image style={homeStyle.likeImage} source={require('../../assets/images/comment.png')} />
                                                <Text style={homeStyle.likeText}>{item.postDetails.total_comments != 0 ? item.postDetails.total_comments : ''} Comments</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity activeOpacity={1} style={homeStyle.likeView} onPress={() => this.onReport(item)}>
                                                {item.reportedByMe ? <Image style={homeStyle.likeImage} source={require('../../assets/images/reportblue.png')} /> : <Image style={homeStyle.likeImage} source={require('../../assets/images/report.png')} />}
                                                <Text style={homeStyle.likeText}>Report</Text>
                                            </TouchableOpacity>

                                        </View>

                                    </View>

                                }
                                keyExtractor={item => item.id}
                            />
                        </View>
                        {/* </ScrollView> */}

                        <ReactNativeModal
                            isVisible={this.state.modalVisible}
                            style={{ margin: 0 }}
                            onBackButtonPress={() => { this.setState({ modalVisible: false }) }}>

                            <View style={{ flex: 1, backgroundColor: '#000000' }}>

                                <TouchableOpacity activeOpacity={1} onPress={() => this.setState({ modalVisible: false })} style={{ zIndex: 9999, width: 40, height: 40, position: 'absolute', top: 65, right: 20 }}>
                                    <Image style={[{ width: 25, height: 25, resizeMode: 'contain' }]} source={require('../../assets/images/white_cross.png')} />
                                </TouchableOpacity>

                                <View>
                                    <VideoPlayer
                                        video={{ uri: this.state.videoUrl }}
                                        videoWidth={viewportWidth}
                                        videoHeight={viewportHeight - 50}
                                        thumbnail={{ uri: this.state.videoThumb }}
                                    />
                                </View>
                            </View>
                        </ReactNativeModal>

                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }
}

