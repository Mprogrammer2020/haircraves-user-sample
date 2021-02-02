import React, { Component, Fragment, useState, useEffect } from 'react';
import { View, Text, Image, TextInput, FlatList, ScrollView, Dimensions, KeyboardAvoidingView, TouchableOpacity, Linking, Platform, SafeAreaView, Alert } from 'react-native';
import ChatStyle from './ChatStyle';
import { removeAndroidBackButtonHandler, handleAndroidBackButton } from '../../routes/Backer';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Modal from 'react-native-modal';
import CheckBox from 'react-native-check-box';
import Storage from '../../constants/Storage';
import moment from 'moment';
import Toasty from '../../elements/Toasty';
import ChatHelper from '../ChatModule/ChatHelper';
import StorageHelper from '../ChatModule/StorageHelper';
import ActionSheet from 'react-native-action-sheet';
import { check, openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import { EventRegister } from 'react-native-event-listeners';
import ApiCaller from '../../constants/ApiCaller';
import { ImageViewer } from '../../constants/ImageViewer';
import KeyboardSpacer from 'react-native-keyboard-spacer';



const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

var BUTTONS = [
    'Capture Image',
    'Choose from library...',
    'cancel',
];

var CAMERA_INDEX = 0;
var GALLERY_INDEX = 1;
var CANCEL_INDEX = 2;



// import { useNavigation } from '@react-navigation/native';
// import { blockUser, reportUser, tellUsWhy } from '../common/Modals';

export default function SingleChat(props) {

    const [blockUserModal, setBlockUserModal] = useState(false);
    const [reportUserModal, setReportUserModal] = useState(false);
    const [tellUsWhyModal, setTellUsWhyModal] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState('');
    const [temp, setTemp] = useState(0);
    const [user, setUser] = useState();
    const [seller, setSeller] = useState();
    const [sellerBlock, setSellerBlock] = useState();
    const [isBlocked, setIsBlocked] = useState();
    const [blockedBy, setBlockedBy] = useState();

    const [viewImage, setViewImage] = useState(false);
    const [viewImageUrl, setViewImageUrl] = useState('');





    // const navigation = useNavigation()

    // const { providerID } = route.params
    const SellerData = props.navigation.state.params.sellerDetail
    const providerID = props.navigation.state.params.sellerDetail.id
    const chatRoomId = `${global.userId}-${providerID}`


    console.log("SellerData", providerID)
    console.log("SellerData", SellerData)

    useEffect(() => {

        props.navigation.addListener(
            'willFocus',
            () => {
                handleAndroidBackButton(() => props.navigation.goBack())
            })


        Storage.get('loginData').then(loginData => {
            var userData = JSON.parse(loginData)
            if (userData != null) {
                setUser(userData.user)

            }
        })

        EventRegister.emit('loader', true)
        checkIfChatroomExists().then(exist => {
            EventRegister.emit('loader', false)

            console.log("exist", exist)
            if (exist) {
                ChatHelper.listenerOnChatroom(global.userId, chatRoomId).on('value', snapshot => {
                    let arr = []
                    snapshot.forEach(function (childSnapshot) {
                        arr.push(childSnapshot.val())
                    });
                    ChatHelper.clearUnread(global.userId, chatRoomId)
                    // console.log("listenerOnChatroom",arr.reverse())
                    setMessages(arr.reverse())
                })


                setSeller(SellerData)

                ChatHelper.getSellerDetails(global.userId, providerID).then(res => {
                    console.log("getSellerDetails", res)
                    setSellerBlock(res);
                })

                ChatHelper.listenerOnBlock(global.userId, providerID).on('value', snapshot => {
                    let details = snapshot.val()
                    setIsBlocked(details?.isBlocked)
                    setBlockedBy(details?.blockedBy)
                })

                ChatHelper.setOnline(global.userId, providerID, chatRoomId, true).then(res => {
                    console.log(res)
                })
            } else {
                // return null
            }
        })

        return function clean() {
            ChatHelper.listenerOnChatroom(global.userId, chatRoomId).off('value')
            ChatHelper.listenerOnBlock(global.userId, providerID).off('value')
            console.log('clean')
            ChatHelper.setOnline(global.userId, providerID, chatRoomId, false).then(res => {
                console.log(res)
            })
        }
    }, [temp])



    function onSendMessage() {
        let localMessage = message

        if (localMessage.length == 0) {
            Toasty.show('Message field can\'t be empty.')
        } else {

            let data = {
                message: message,
                type: 'text',
                image: '',
                from: 'customer',
                createdAt: moment.utc().format()
            }
            let userData = {
                name: user.first_name + ' ' + user.last_name,
                image: user.profile_pic_path,
                notiToken: global.fcmTokennnn
            }

            console.log("SELERRR", seller)

            ChatHelper.sendMessage(chatRoomId, global.userId, data, userData, seller).then(() => {
                sendNotification(chatRoomId, seller, localMessage)
            })
            setMessage('')
        }

    }


    function onSendFile(path, name, type) {
        // LoaderManager.show()
        console.log(path, name, type)
        // StorageHelper.uploadFile(path.uri, global.userId, name).then(downloadUrl => {
        StorageHelper.uploadFile(path, global.userId, name).then(downloadUrl => {
            let data = {
                // message: message,
                message: '',
                link: downloadUrl,
                name: name,
                type: type,
                from: 'customer',
                createdAt: moment.utc().format()
            }

            let userData = {
                name: user.first_name + ' ' + user.last_name,
                image: user.profile_pic_path,
            }

            console.log("sendFile", chatRoomId, global.userId, data, userData, seller)

            ChatHelper.sendMessage(chatRoomId, global.userId, data, userData, seller).then(() => {
                // sendNotification('Image')
            })
        })
    }

    function sendNotification(roomID, sellerrrrrr, message) {
        var data = JSON.stringify({
            'user_id': sellerrrrrr.id,
            'chatroom_id': roomID,
            'other_user_id': user.id,
            'other_user_name': user.first_name + ' ' + user.last_name,
            'other_user_image': user.profile_pic_path,
        })

        console.log(data)

        ApiCaller.call('messages/sendNotification', 'POST', data, true)
            .then((response) => {
                if (response) {
                    console.log("sendNotification ===>>>> ", response)
                }
            })
            .catch((error) => {
                console.log("sendNotification", error);
            })

    }

    function checkIfChatroomExists() {
        return Storage.get('loginData').then(loginData => {
            var userData = JSON.parse(loginData)
            if (userData != null) {

                return ChatHelper.checkChatRoom(chatRoomId).then(isValid => {
                    if (isValid) {
                        console.log('Chatroom exists')
                        return true
                    } else {
                        let data = {
                            name: userData.user.first_name + ' ' + userData.user.last_name
                        }
                        ChatHelper.createChatRoom(chatRoomId, data).then(created => {
                            if (created) {
                                console.log('Chatroom created')
                                setTemp(temp + 1)
                                return true
                            }
                        })
                    }
                })
            }
        })
    }

    function clearChatOnFirebase() {
        ChatHelper.deleteChat(global.userId, chatRoomId)
    }

    function onClearChat() {
        hideMenu()
        console.log("onClearChat")
        setTimeout(() => { clearChatOnFirebase() }, 500);

    }


    function blockUserOnFirebase(status) {
        EventRegister.emit('loader', true)
        ChatHelper.blockEmployer(global.userId, providerID, status).then(() => {
            setTemp(temp + 1)
            if (status) {
                ApiCaller.call('users/block', "POST", JSON.stringify({ id: providerID }), true)
                    .then((response) => {
                        console.log("user is blocked response==>", response)
                        EventRegister.emit('loader', false)
                    })
            } else {
                ApiCaller.call('users/unblock', "POST", JSON.stringify({ id: providerID }), true)
                    .then((response) => {
                        console.log("user is unblocked response==>", response)
                        EventRegister.emit('loader', false)
                    })
            }
        })
    }

    function onBlockUser() {
        hideMenu()
        console.log("onBlockUser")
        setTimeout(() => { blockUserOnFirebase(!isBlocked) }, 500);
    }


    function onReportUser() {
        hideMenu()
        setTimeout(() => {
            setReportUserModal(true)

        }, 500);
    }


    let _menu

    const setMenuRef = ref => {
        _menu = ref;
    };

    const hideMenu = () => {
        _menu.hide();
    };

    const showMenu = () => {
        _menu.show();
    };


    const showActionSheet = () => {
        ActionSheet.showActionSheetWithOptions({
            title: 'Image Picker',
            options: BUTTONS,
            cancelButtonIndex: CANCEL_INDEX,
            chat: GALLERY_INDEX,
            tintColor: '#1E50CE',
        },
            (buttonIndex) => {
                onPressOpen(buttonIndex)
            });
    };


    const onPressOpen = (index) => {
        // { this.setState({ defaultAnimationModal: false }); }
        if (index == 0) {
            check(Platform.OS == 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA)
                .then(result => {
                    switch (result) {
                        case RESULTS.DENIED:
                            request(Platform.OS == 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA).then(result => {
                                if (result == 'granted') {
                                    initCamera()
                                }
                            })
                            break;
                        case RESULTS.GRANTED:
                            initCamera()
                            break;
                        case RESULTS.BLOCKED:
                            Alert.alert(
                                'Permissions Blocked',
                                'Please grant camera permissions from app settings',
                                [
                                    { text: 'Cancel', onPress: () => console.log('OK Pressed') },
                                    { text: 'Settings', onPress: () => { openSettings().catch(() => console.warn('cannot open settings')); } },
                                ],
                                { cancelable: false },
                            );
                            break;
                    }
                })

        }
        if (index == 1) {
            check(Platform.OS == 'android' ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE : PERMISSIONS.IOS.PHOTO_LIBRARY)
                .then(result => {
                    switch (result) {
                        case RESULTS.DENIED:
                            request(Platform.OS == 'android' ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE : PERMISSIONS.IOS.PHOTO_LIBRARY).then(result => {
                                if (result == 'granted') {
                                    initPicker()
                                }
                            })
                            break;
                        case RESULTS.GRANTED:
                            initPicker()
                            break;
                        case RESULTS.BLOCKED:
                            Alert.alert(
                                'Permissions Blocked',
                                'Please grant storage permissions from app settings',
                                [
                                    { text: 'Cancel', onPress: () => console.log('OK Pressed') },
                                    { text: 'Settings', onPress: () => { openSettings().catch(() => console.warn('cannot open settings')); } },
                                ],
                                { cancelable: false },
                            );
                            break;
                    }
                })

        }

    }


    const initCamera = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 300,
            cropping: true,
        }).then(response => {
            let source1 = response.path;
            let source = { uri: response.path };
            onSendFile(source1, response.path.split('/')[response.path.split('/').length - 1], 'image/jpeg');
        });

    }

    const initPicker = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true
        }).then(response => {
            console.log('Response = ', response);
            let source1 = response.path;
            let source = { uri: response.path };
            onSendFile(source1, response.path.split('/')[response.path.split('/').length - 1], 'image/jpeg');
        });
    }




    function backPress() {
        props.navigation.goBack()
    }


    return (
        <SafeAreaView style={ChatStyle.bottomColor}>
            <View style={{ flex: 1 }}>
                <View style={{ width: '100%', paddingTop: 10, paddingBottom: 10, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity style={{ flex: 0.1, paddingLeft: 10 }} activeOpacity={0.9}
                        onPress={() => backPress()}>
                        <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../../assets/images/back_arrow.png')} />
                    </TouchableOpacity>

                    <Text style={{ flex: 0.9, color: 'black', fontSize: 20, textAlign: 'center', fontFamily: 'HelveticaNeueLTStd-Roman' }}>{seller?.name}</Text>

                    {/* <Text style={{ flex: 0.9, color: 'black', fontSize: 20, textAlign: 'center', fontFamily: 'HelveticaNeueLTStd-Roman' }}>{seller?.name} Prada Hair Salon</Text> */}


                    <View style={{ flex: 0.1, width: 120, alignItems: 'center' }}>
                        {isBlocked && blockedBy == 'seller' ?
                            < Menu
                                ref={setMenuRef}
                                style={{ marginTop: 40 }}
                                button={<TouchableOpacity onPress={() => { showMenu() }}>
                                    <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../../assets/images/black_dots.png')} />
                                </TouchableOpacity>}>
                                <MenuItem style={ChatStyle.menuStyle} onPress={onClearChat}>Clear Chat</MenuItem>
                                <MenuDivider />
                                <MenuItem style={ChatStyle.menuStyle} onPress={onReportUser}>Report User</MenuItem>
                                <MenuDivider />
                            </Menu> :
                            <Menu
                                ref={setMenuRef}
                                style={{ marginTop: 40 }}
                                button={<TouchableOpacity onPress={() => { showMenu() }}>
                                    <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../../assets/images/black_dots.png')} />
                                </TouchableOpacity>}>
                                <MenuItem style={ChatStyle.menuStyle} onPress={onClearChat}>Clear Chat</MenuItem>
                                <MenuDivider />
                                <MenuItem style={ChatStyle.menuStyle} onPress={onBlockUser}>{isBlocked ? "Unblock" : "Block"} User</MenuItem>
                                <MenuDivider />
                                <MenuItem style={ChatStyle.menuStyle} onPress={onReportUser}>Report User</MenuItem>
                                <MenuDivider />
                            </Menu>
                        }
                    </View>
                </View>
                <KeyboardAvoidingView behavior={Platform.OS == 'android' ? 'none' : 'padding'} keyboardVerticalOffset={20} style={{ flex: 1 }}>
                    <View style={{ flex: 1, backgroundColor: 'white' }}>

                        {/* <ScrollView showsVerticalScrollIndicator={false}> */}

                        {console.log("hellooo==>>>>", JSON.stringify(messages))}
                        {messages.length > 0 ?
                            <FlatList
                                // contentContainerStyle={[ChatStyle.flatStyle, { flex: 1 }]}
                                style={{ flex: 1 }}
                                data={messages}
                                inverted={true}
                                // keyExtractor={(item) => item.createdAt}
                                renderItem={({ item, index }) => {
                                    if (item.from == 'customer') {
                                        return (
                                            <View style={ChatStyle.viewBlue}>
                                                {console.log("dataaa", item)}
                                                <View style={{ backgroundColor: '#4CC9CA', flexDirection: 'column', height: 'auto', padding: 10, borderRadius: 10, borderTopRightRadius: 0 }}>
                                                    {item.message ? <Text style={[ChatStyle.blueMsg, { paddingLeft: 5, paddingTop: 5 }]}>{item.message}</Text>
                                                        :
                                                        <TouchableOpacity onPress={() => {
                                                            setViewImageUrl(item.link)
                                                            setViewImage(true)
                                                        }} style={{ width: 110, height: 110, borderRadius: 5, marginBottom: 5 }}>
                                                            <Image style={{ width: 110, height: 110, borderRadius: 5 }} source={{ uri: item.link }} />
                                                        </TouchableOpacity>}
                                                    {item.createdAt ? <Text style={[ChatStyle.timeText, { paddingLeft: 5 }]}>{moment(item.createdAt).fromNow(true)}</Text> : null}
                                                </View>
                                            </View>
                                        )
                                    }
                                    else {
                                        return (
                                            <View style={[ChatStyle.viewGrey, { paddingRight: 10, }]}>
                                                {seller.image ? <Image style={{ width: 45, height: 45, borderRadius: 5, marginLeft: 5 }} source={{ uri: seller.image }} />
                                                    :
                                                    <Image style={{ width: 45, height: 45, borderRadius: 5, marginLeft: 5 }} source={require('../../assets/images/ic_placeholder.png')} />}

                                                <View style={ChatStyle.greyMsgView}>
                                                    {item.message ? <Text style={[ChatStyle.greyText]}>{item.message}</Text>
                                                        :
                                                        <TouchableOpacity onPress={() => {
                                                            setViewImageUrl(item.link)
                                                            setViewImage(true)
                                                        }} style={{ width: 110, height: 110, borderRadius: 5, marginBottom: 5 }}>
                                                            <Image style={{ width: 110, height: 110, borderRadius: 5 }} source={{ uri: item.link }} />
                                                        </TouchableOpacity>}
                                                    {item.createdAt ? <Text style={ChatStyle.timeText}>{moment(item.createdAt).fromNow(true)}</Text> : null}
                                                </View>
                                            </View>
                                        )
                                    }

                                }
                                } />

                            :
                            <View style={{ width: '100%', height: viewportHeight - 90, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md' }}>No conversation yet</Text>
                            </View>}

                    </View>
                    {/* </ScrollView> */}

                    {isBlocked ?
                        <View style={{ width: '100%', height: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Text>
                                {blockedBy == 'customer' ? "You have blocked this seller" : "You have been blocked by this seller"}
                            </Text>
                        </View> :

                        <View style={ChatStyle.inputView}>
                            {/* <TouchableOpacity style={{ padding: 10 }} onPress={() => actionSheet.show()}></TouchableOpacity> */}
                            <TouchableOpacity activeOpacity={1} onPress={() => showActionSheet()} >
                                <Image style={ChatStyle.image} source={require('../../assets/images/add_file.png')} />
                            </TouchableOpacity>
                            <View style={{ marginLeft: 5, flex: 1, flexDirection: 'row', backgroundColor: '#d9d9d9', borderRadius: 30, alignItems: 'center' }}>
                                <TextInput style={ChatStyle.textInput}
                                    placeholder="Type your message here"
                                    fontSize={16}
                                    multiline={true}
                                    blurOnSubmit={true}
                                    returnKeyType={'done'}
                                    onChangeText={setMessage}
                                    value={message} />

                                {/* <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => this.onSendMsg()}> */}
                                <TouchableOpacity onPress={onSendMessage} style={{ padding: 10 }}>
                                    <Image style={ChatStyle.imageSend} source={require('../../assets/images/send_icon.png')} />
                                </TouchableOpacity>
                            </View>

                        </View>
                    }


                    {ImageViewer(viewImage, viewImageUrl, () => setViewImage(false))}
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView >
    );
}




