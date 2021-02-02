import React, { Component, Fragment } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity, TextInput, ScrollView, Modal, FlatList, Keyboard, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView, Dimensions, Alert } from 'react-native';
import Toasty from '../../elements/Toasty';
import homeStyle from './homeStyle'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import CommonHeader from '../../elements/CommonHeader';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ApiCaller from '../../constants/ApiCaller';
import { EventRegister } from 'react-native-event-listeners';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import moment from 'moment';
import Storage from '../../constants/Storage';
import ReadMore from 'react-native-read-more-text';
import VideoPlayer from 'react-native-video-player';
import WebView from 'react-native-webview';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');


export default class DetailScreen extends Component {

    constructor() {
        super()
        this.state = {
            email: '',
            message: '',
            post_id: '',
            commentCount: '',
            likeCount: '',
            detailData: [],
            commentList: [],
            userData: [],
            postUserImage: '',
            textShown: -1,
            myID: '',
            productsData: [],
            taggedUser: [],
            likedByMe: false,
            modalVisible: false,
            videoUrl: '',
            videoThumb: '',
        }

    }

    commentInput

    toggleModal(visible, videoUrl, videoThumb) {
        this.setState({ modalVisible: visible, videoUrl: videoUrl, videoThumb: videoThumb });
    }


    componentDidMount() {
        this.props.navigation.addListener(
            'willFocus',
            () => {
                const { navigation } = this.props;
                var postID = navigation.getParam('post_id');
                this.setState({ post_id: postID })
                this.detailApiCall(postID)
                Storage.get('loginData').then(loginData => {
                    var userData = JSON.parse(loginData)
                    if (userData != null) {
                        this.setState({ myID: userData.user.id })
                    }
                })

                handleAndroidBackButton(() => this.props.navigation.goBack())
            }
        );
    }

    componentWillMount() {

    }


    componentWillUnmount() {
        removeAndroidBackButtonHandler();
    }

    _menu = null;

    setMenuRef = ref => {
        this._menu = ref;
    };

    hideMenu = () => {
        this.reportPost();
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };

    reportPost() {
        EventRegister.emit('loader', true)
        ApiCaller.call('posts/' + this.state.post_id + '/report', "GET", null, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("detailScreen====>>>>", response)
                    this.props.navigation.goBack()
                }
            })
            .catch((error) => {
                console.log("report error", error);
            })
    }




    handleTitleInputSubmit = () => {
        this.setState({ focusInput: true });
    }

    selectPhotoTapped() {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            title: 'Image Picker',
            takePhotoButtonTitle: 'Capture Image',
            maxHeight: 500,
            storageOptions: {
                skipBackup: true,
            },
        };
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled photo picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({ avatarSource: source, });
                this.setState({ imageUri: response.uri, imageLoad: false })
                this.onSendMsg();
            }

        });
    }



    clearFields() {
        setTimeout(() => {
            this.setState({ message: '' })
        }, 1000);
    }

    deleteComment(itemmm) {
        Alert.alert(
            '',
            'Are you sure you want to delete comment?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.deleteCommentApi(itemmm) },
            ],
            { cancelable: false }
        );
    }

    deleteCommentApi(itemmm) {
        EventRegister.emit('loader', true)
        ApiCaller.call('postComments/' + itemmm.id, "GET", null, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("delete Comment====>>>>", response)
                }
            })
            .catch((error) => {
                console.log("report error", error);
            })

    }





    detailApiCall(postID) {
        EventRegister.emit('loader', true)
        ApiCaller.call('posts/' + postID, "GET", null, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("detailScreen====>>>>", response)
                    this.setState({
                        userData: response.users,
                        detailData: response.postDetails,
                        commentList: response.comments,
                        commentCount: response.postDetails.comments_count,
                        likeCount: response.postDetails.likes_count,
                        postUserImage: response.postUserImage,
                        productsData: response.products,
                        taggedUser: response.users,
                        likedByMe: response.likedByMe,
                        responseData: response
                    })
                    // if (this.state.detailData.media_path.includes('.mp4')) {
                    //     this.setState({
                    //         imageHeight: 200
                    //     })
                    // }
                    // else {
                    //     Image.getSize(response.postDetails.media_path, (width, height) => {
                    //         alert(height)
                    //         this.setState({
                    //             imageHeight: height
                    //         })
                    //     })
                    // }
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }


    likeApiCall(postID) {
        console.log("ll", postID)
        EventRegister.emit('loader', true)
        ApiCaller.call('posts/' + postID + '/like', "GET", null, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("Like response", response)
                    this.setState({ likeCount: response.totalLikes, likedByMe: response.likedByMe })
                }
            })
            .catch((error) => {
                console.log("ErrorLike", error);
            })
    }


    postCommentApi() {
        if (this.state.message === 0 || this.state.message === '') {
            Toasty.show('Comment field can\'t be empty');
        } else {
            Keyboard.dismiss()

            var data = JSON.stringify({
                "comment": this.state.message,
            })

            EventRegister.emit('loader', true)
            ApiCaller.call('posts/' + this.state.post_id + '/comment', "POST", data, true)
                .then((response) => {
                    EventRegister.emit('loader', false)
                    if (response) {
                        console.log("Comment response", response)
                        this.setState({ commentList: response.comments, commentCount: response.comments_count })
                        this.clearFields();
                    }
                })
                .catch((error) => {
                    this.clearFields();
                    console.log("Error Comment", error);
                })
        }
    }


    toggleNumberOfLines = index => {
        this.setState({
            textShown: this.state.textShown === index ? -1 : index,
        });
    };


    onClickTagUser(screen, response) {
        console.log(response)
        this.props.navigation.navigate(screen, { taggedItems: response, from: 'Detail' })
    }


    _renderTruncatedFooter = (handlePress) => {
        return (
            <Text style={{ color: 'white', marginTop: 5, fontFamily: 'HelveticaNeueLTStd-Md' }} onPress={handlePress}>
                Read more...
            </Text>
        );
    }

    _renderRevealedFooter = (handlePress) => {
        return (
            <Text style={{ color: 'white', marginTop: 5, fontFamily: 'HelveticaNeueLTStd-Md' }} onPress={handlePress}>
                Show less...
            </Text>
        );
    }

    _handleTextReady = () => {
        // ...
    }

    render() {
        return (
            <Fragment>
                {Platform.OS == 'ios' ? <StatusBar barStyle="dark-content" translucent={true} /> : <StatusBar hidden={false} barStyle="dark-content" backgroundColor="white" translucent={false} />}


                <SafeAreaView style={[homeStyle.statusColor]} />
                <SafeAreaView style={homeStyle.bottomColor}>
                    <View style={{ flex: 1 }}>
                        <CommonHeader
                            drawable={require('../../assets/images/back_arrow.png')}
                            action={() => this.props.navigation.goBack()}
                            title='Details' />
                        <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={20} behavior={Platform.OS == 'ios' ? 'padding' : 'none'}>

                            <ScrollView ref={ref => { this.scrollView = ref }} style={{}} showsVerticalScrollIndicator={false} >
                                <View style={[{ flex: 1, marginTop: 10 }]}>
                                    {this.state.detailData ?
                                        <View style={{ flex: 1, marginBottom: 8 }}>
                                            <TouchableOpacity activeOpacity={1} style={{ flex: 1, flexDirection: 'column', padding: 5, alignItems: 'center' }}>
                                                <View style={{ flexDirection: 'row', width: '100%', marginLeft: 10, alignItems: 'center' }}>
                                                    {this.state.postUserImage ? <Image style={{ height: 50, width: 50, borderRadius: 25 }} source={{ uri: this.state.postUserImage }} /> : <Image style={{ height: 50, width: 50, borderRadius: 25 }} source={require('../../assets/images/ic_placeholder.png')} />}
                                                    <View style={{ flex: 1, flexDirection: 'column', marginLeft: 10 }}>
                                                        <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md' }}>{this.state.detailData.title}</Text>
                                                        <Text numberOfLines={1} style={{ fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey' }}>{moment(this.state.detailData.created_at).fromNow(true)}</Text>
                                                    </View>
                                                    <View style={{ paddingRight: 5 }}>
                                                        <Menu
                                                            ref={this.setMenuRef}
                                                            style={{ marginTop: 40 }}
                                                            button={<TouchableOpacity onPress={this.showMenu}>
                                                                <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../../assets/images/black_dots.png')} />
                                                            </TouchableOpacity>}>

                                                            <MenuItem style={{ fontFamily: 'HelveticaNeueLTStd-Roman', height: 40 }} onPress={this.hideMenu}>Report Post</MenuItem>
                                                            <MenuDivider />
                                                        </Menu>
                                                    </View>
                                                    {/* <Image style={{ height: 25, width: 25, marginRight: 10 }} source={require('../../assets/images/black_dots.png')} /> */}
                                                </View>

                                                <View style={{ height: this.state.taggedUser[0] ? Dimensions.get('window').width + 20 : Dimensions.get('window').width, width: '100%' }}>

                                                    {this.state.taggedUser[0] ? <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', marginTop: 5, position: 'absolute', left: 40, bottom: -10, zIndex: 9999 }} onPress={() => this.onClickTagUser('ShowTagUserScreen', this.state.responseData)}>
                                                        {this.state.taggedUser.map((dataItem, key) => (
                                                            <View>
                                                                {dataItem.profile_pic_path ? <Image style={{ height: 40, width: 40, borderRadius: 20, marginLeft: -10 }} source={{ uri: dataItem.profile_pic_path }} />
                                                                    : <Image style={{ height: 40, width: 40, borderRadius: 20, marginLeft: -10 }} source={require('../../assets/images/ic_placeholder.png')} />}
                                                            </View>
                                                        ))}
                                                    </TouchableOpacity> : null}
                                                    {/* <Image style={[homeStyle.portfolioImage]} source={{ uri: this.state.detailData.media_path }} /> */}

                                                    <View style={[homeStyle.portfolioImage]}>
                                                        {
                                                            this.state.detailData.video_thumb && this.state.detailData.media_path.includes('.mp4') ?
                                                                <View style={[homeStyle.portfolioImage, { backgroundColor: '#dcdcdc', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }]}>
                                                                    <TouchableOpacity style={{ height: 50, width: 50, position: 'absolute', zIndex: 99999 }} onPress={() => { this.toggleModal(true, this.state.detailData.media_path, this.state.detailData.video_thumb) }}>
                                                                        <Image style={{ height: 50, width: 50, position: 'absolute' }} source={require('../../assets/images/video_icon.png')} />
                                                                    </TouchableOpacity>
                                                                    {this.state.detailData.video_thumb ? <Image style={[homeStyle.portfolioImage]} source={{ uri: this.state.detailData.video_thumb }} />
                                                                        : <Image style={[homeStyle.portfolioImage]} source={require('../../assets/images/ic_placeholder.png')} />}
                                                                </View>
                                                                :
                                                                <View>
                                                                    {this.state.detailData.media_path ? <Image style={[homeStyle.portfolioImage]} source={{ uri: this.state.detailData.media_path }} />
                                                                        : <Image style={[homeStyle.portfolioImage]} source={require('../../assets/images/ic_placeholder.png')} />}
                                                                </View>
                                                        }
                                                    </View>

                                                </View>
                                                <Text style={homeStyle.portfolioTitle}>{this.state.detailData.service_name}</Text>
                                                <Text style={homeStyle.portfolioDes}>{this.state.detailData.description}</Text>
                                                {/* <Text numberOfLines={1} style={{ fontSize: 14, width: '95%', fontFamily: 'HelveticaNeueLTStd-Lt', color: 'black', marginTop: 5, marginBottom: 5 }}>Tag Products: Herbal Essences and 2 others</Text> */}
                                                {this.state.productsData[0] ? <Text numberOfLines={1} onPress={() => this.onClickTagUser('ShowTagProductScreen', this.state.responseData)} style={[homeStyle.tagText, { fontFamily: 'HelveticaNeueLTStd-Lt' }]}>Tag Products: <Text style={homeStyle.tagText}>{this.state.productsData[0].title}</Text> {this.state.productsData.length > 1 ? <Text style={homeStyle.tagText}> and {this.state.productsData.length - 1} others</Text> : null}</Text> : null}

                                            </TouchableOpacity>

                                            <View style={homeStyle.likeCommentView}>
                                                <TouchableOpacity style={homeStyle.likeView} activeOpacity={1} onPress={() => this.likeApiCall(this.state.detailData.id)}>
                                                    {this.state.likedByMe ? <Image style={homeStyle.likeImage} source={require('../../assets/images/like_blue.png')} />
                                                        : <Image style={homeStyle.likeImage} source={require('../../assets/images/like.png')} />}
                                                    <Text style={[homeStyle.likeText, { color: this.state.likedByMe ? '#4CC9CA' : 'grey' }]}>{this.state.likeCount ? this.state.likeCount : ''} Likes</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity onPress={() => { this.commentInput.focus() }} style={homeStyle.likeView}>
                                                    <Image style={homeStyle.likeImage} source={require('../../assets/images/comment.png')} />
                                                    <Text style={homeStyle.likeText}>{this.state.commentCount ? this.state.commentCount : ''} Comments</Text>
                                                </TouchableOpacity>

                                            </View>

                                            {/* <View style={homeStyle.detailLikeView}>
                                            <Image style={homeStyle.detailLike} source={require('../../assets/images/like_rounded.png')} />
                                            <Text style={homeStyle.detailLikeText}>Peter Parker<Text style={[homeStyle.detailLikeText, { fontFamily: 'HelveticaNeueLTStd-Lt' }]}> and </Text>200K others</Text>
                                        </View> */}

                                        </View> : null}

                                    <FlatList
                                        scrollEnabled={false}
                                        data={this.state.commentList}
                                        refreshing={this.state.refreshing}
                                        renderItem={({ item, index }) =>
                                            <View style={{ flex: 1, marginBottom: 8 }}>
                                                <TouchableOpacity activeOpacity={1} style={{ flex: 1, flexDirection: 'column', padding: 5, alignItems: 'center' }}>
                                                    <View style={{ flexDirection: 'row', width: '100%', marginLeft: 10 }}>
                                                        <Image style={homeStyle.commentImage} source={{ uri: item.user_image_path }} />
                                                        <TouchableOpacity activeOpacity={0.8} style={homeStyle.commentView} onLongPress={() => item.user_id == this.state.myID ? this.deleteComment(item) : console.log(item.user_id)}>
                                                            <Text style={homeStyle.commentName}>{item.user_name}</Text>

                                                            <ReadMore
                                                                numberOfLines={5}
                                                                renderTruncatedFooter={this._renderTruncatedFooter}
                                                                renderRevealedFooter={this._renderRevealedFooter}
                                                                onReady={this._handleTextReady}>
                                                                {item.comment ? <Text style={[homeStyle.comment, { padding: 4, }]}>
                                                                    {item.comment}
                                                                </Text> : null}
                                                            </ReadMore>

                                                            {/* {item.comment ? <View>
                                                            <Text numberOfLines={this.state.textShown === index ? undefined : 5} style={homeStyle.comment}>{item.comment}</Text>
                                                            <Text
                                                                onPress={() => this.toggleNumberOfLines(index)}
                                                                style={[homeStyle.comment, { padding: 4, fontFamily: 'HelveticaNeueLTStd-Md' }]}>
                                                                {this.state.textShown === index ? 'Show less...' : 'Show more...'}
                                                            </Text>
                                                        </View> : null} */}
                                                            <Text numberOfLines={1} style={homeStyle.commentTime}>{moment(item.created_at).fromNow(true)}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        }
                                        keyExtractor={item => item.id}
                                    />

                                </View>


                            </ScrollView>

                            <View style={[homeStyle.inputView, { paddingVertical: 10, paddingLeft: 5, paddingRight: 5 }]}>

                                <View style={{ marginLeft: 5, flex: 1, flexDirection: 'row', backgroundColor: '#EFEEEE', borderRadius: 30, alignItems: 'center' }}>

                                    <TextInput style={homeStyle.textInput}
                                        placeholder="Type your message here"
                                        fontSize={16}
                                        multiline={true}
                                        ref={ref => { this.commentInput = ref }}
                                        blurOnSubmit={true}
                                        returnKeyType={'done'}
                                        onFocus={() => this.scrollView.scrollToEnd({ animated: true })}
                                        onChangeText={(message) => this.setState({ message: message })}
                                        value={this.state.message} />


                                    <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => this.postCommentApi()}>
                                        <Image style={homeStyle.imageSend} source={require('../../assets/images/send_icon.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>



                        <Modal animationType={"slide"} transparent={false}
                            visible={this.state.modalVisible}
                            onRequestClose={() => { this.setState({ modalVisible: false }) }}>

                            <View style={{ flex: 1, backgroundColor: '#000000' }}>

                                <TouchableOpacity activeOpacity={1} onPress={() => this.setState({ modalVisible: false })} style={{ zIndex: 9999, width: 25, height: 25, position: 'absolute', top: 20, right: 20 }}>
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
                        </Modal>
                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }
}

