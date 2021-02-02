import React, { Component, Fragment } from 'react';
import { View, Text, Image, TextInput, FlatList, ScrollView, KeyboardAvoidingView, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
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


const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

var BUTTONS = [
    'Capture Image',
    'Choose from library...',
    'cancel',
];

var CAMERA_INDEX = 0;
var GALLERY_INDEX = 1;
var CANCEL_INDEX = 2;
export default class SingleChat extends Component {

    constructor() {
        super();
        this.state = {
            radio: 0,
            modalVisible: false,
            message: '',
            messagesRev: '',
            userData: null,
            hideTextInput: false,
            providerID: '',
            chatRoomId: 1,
            employerId: 2,
            employer: '',
            chatList: [{ barberImage: require('../../assets/images/ic_placeholder.png'), barber: 'Classic Gentle Barbershop', message: 'Hi Jack How are you?', time: '10:00 AM' },
            { barberImage: require('../../assets/images/ic_placeholder.png'), barber: 'Prada Hair Salon', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', time: '10:15 AM' }]
        }
    }

    _menu = null;

    setMenuRef = ref => {
        this._menu = ref;
    };

    clearChat = () => {
        this._menu.hide();
    };

    blockUser = () => {
        this._menu.hide();
        setTimeout(() => {
            this.setState({ hideTextInput: true });
        }, 500);
    };


    reportUser = () => {
        this._menu.hide();
        setTimeout(() => {
            this.setState({ modalVisible: 'slow' });
        }, 500);

    };


    submitReport(radio) {
        console.log(radio)
        this.setState({ modalVisible: false });
    }

    closeReport() {
        this.setState({ modalVisible: false });
    }

    showMenu = () => {
        this._menu.show();
    };



    getView(item, index) {
        if (index == 1) {
            return (
                <View style={ChatStyle.viewBlue}>
                    <View style={{ backgroundColor: '#4CC9CA', flexDirection: 'column', height: 'auto', padding: 10, borderRadius: 10, borderTopRightRadius: 0 }}>
                        <Text style={[ChatStyle.blueMsg, { paddingLeft: 5 }]}>{item.message}</Text>
                        {item.time ? <Text style={[ChatStyle.timeText, { paddingLeft: 5 }]}>{item.time}</Text> : null}
                    </View>
                </View>

            )
        }
        else {
            return (
                <View style={[ChatStyle.viewGrey, { width: '90%', paddingRight: 10 }]}>
                    <Image style={{ width: 45, height: 45, borderRadius: 5, resizeMode: 'contain' }} source={require('../../assets/images/lucky_kim.png')} />
                    <View style={ChatStyle.greyMsgView}>
                        {item.message ? <Text style={ChatStyle.greyText}>{item.message}</Text> : null}
                        {item.time ? <Text style={ChatStyle.timeText}>{item.time}</Text> : null}
                    </View>
                </View>
            )
        }
    }

    componentDidMount() {
        this.props.navigation.addListener(
            'willFocus',
            () => {
                Storage.get('loginData').then(loginData => {
                    var userData = JSON.parse(loginData)
                    if (userData != null) {
                        this.setState({ userData: userData.user })

                    }
                })
                this.checkIfChatroomExists()
                this.getChat()
                handleAndroidBackButton(() => this.props.navigation.goBack())
            }
        );
    }

    componentWillReceiveProps() {
    }


    componentWillUnmount() {
        removeAndroidBackButtonHandler();
    }


    getChat() {

        // this.checkIfChatroomExists().then(exist => {

        //     console.log("exist", exist)

        var exist = true
        if (exist) {
            console.log("exist", exist)

            ChatHelper.listenerOnChatroom(global.userId, this.state.chatRoomId).on('value', snapshot => {
                let arr = []
                snapshot.forEach(function (childSnapshot) {
                    arr.push(childSnapshot.val())
                });
                ChatHelper.clearUnread(global.userId, this.state.chatRoomId)
                console.log("clearUnread")
                this.setState({ messagesRev: arr.reverse() })

            })

            ChatHelper.getEmployerDetails(global.userId, this.state.employerId).then(res => {
                console.log("employerDetails", res)
                this.setState({ employer: res })
                //   setEmployer(res)
            })

            ChatHelper.setOnline(global.userId, this.state.employerId, this.state.chatRoomId, true).then(res => {
                console.log("setOnline==>>> ", res)
            })
        }

        else {
            // return null
        }

        // })

    }


    clean() {
        ChatHelper.listenerOnChatroom(global.userId, this.state.chatRoomId).off('value')
        console.log('clean')
        ChatHelper.setOnline(global.userId, this.state.employerId, this.state.chatRoomId, false).then(res => {
            console.log('clean===>>>', res)
        })
    }




    checkIfChatroomExists() {
        Storage.get('loginData').then(loginData => {
            var userData = JSON.parse(loginData)
            if (userData != null) {
                ChatHelper.checkChatRoom(this.state.chatRoomId).then(isValid => {
                    if (isValid) {
                        console.log('Chatroom exists')
                        return true
                    } else {
                        let data = {
                            name: userData.user.first_name + ' ' + userData.user.last_name
                        }
                        ChatHelper.createChatRoom(this.state.chatRoomId, data).then(created => {
                            if (created) {
                                console.log('Chatroom created')
                                this.setState({ temp: temp + 1 })
                                // setTemp(temp + 1)
                                return true
                            }
                        })
                    }
                })
            }
        })
    }




    showActionSheet = () => {
        ActionSheet.showActionSheetWithOptions({
            title: 'Image Picker',
            options: BUTTONS,
            cancelButtonIndex: CANCEL_INDEX,
            chat: GALLERY_INDEX,
            tintColor: '#1E50CE',
        },
            (buttonIndex) => {
                this.setState({
                    clicked: this.onPressOpen(buttonIndex),
                });
            });
    };


    onPressOpen = (index) => {
        { this.setState({ defaultAnimationModal: false }); }
        if (index == 0) {
            check(Platform.OS == 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA)
                .then(result => {
                    switch (result) {
                        case RESULTS.DENIED:
                            request(Platform.OS == 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA).then(result => {
                                if (result == 'granted') {
                                    this.initCamera()
                                }
                            })
                            break;
                        case RESULTS.GRANTED:
                            this.initCamera()
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
                                    this.initPicker()
                                }
                            })
                            break;
                        case RESULTS.GRANTED:
                            this.initPicker()
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



    initCamera = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 300,
            cropping: true,
        }).then(response => {
            let source1 = response.path;
            let source = { uri: response.path };

            this.setState({
                avatarSource: source,
                imageUri: source1
            });

            this.onSendFile(source1, 'image/jpeg', 'photo.jpg');

        });

    }

    initPicker = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true
        }).then(response => {
            console.log('Response = ', response);
            let source1 = response.path;
            let source = { uri: response.path };
            this.setState({
                avatarSource: source,
                imageUri: source1
            });

            this.onSendFile(source1, 'image/jpeg', 'photo.jpg');

        });
    }




    clearFields() {
        setTimeout(() => {
            this.setState({ message: '' })
        }, 1000);
    }



    backPress() {
        this.props.navigation.goBack()
    }



    blockUserOnFirebase() {
        ChatHelper.blockEmployer(global.userId, this.state.providerID, true).then(() => {
            // setTemp(temp + 1)
            this.setState({ temp: temp + 1 })
        })
    }

    onSendMsg() {
        let localMessage = this.state.message;
        if (localMessage.length == 0) {
            Toasty.show('Message field can\'t be empty.')
        }
        else {
            let data = {
                message: this.state.message,
                type: 'text',
                image: '',
                from: 'employee',
                createdAt: moment.utc().format()
            }
            let userData = {
                name: this.state.userData.first_name + ' ' + this.state.userData.last_name,
                image: this.state.userData.profile_pic_path,
                notiToken: global.fcmTokennnn
            }


            console.log("data", data, userData)


            // ChatHelper.sendMessage(chatRoomId, global.userId, data, userData, employer).then(() => {
            //     this.sendNotification(localMessage)
            // })
            // setMessage('')
            // this.setState({message : ''})
        }
    }

    onSendFile(path, name, type) {

        console.log(path, name, type)

        StorageHelper.uploadFile(path.uri, global.userId, name).then(downloadUrl => {
            let data = {
                message: this.state.message,
                link: downloadUrl,
                name: name,
                type: type,
                from: 'employee',
                createdAt: moment.utc().format()
            }
            let userData = {
                name: this.state.userData.first_name + ' ' + this.state.userData.last_name,
                image: this.state.userData.profile_pic_path
            }

            ChatHelper.sendMessage(this.state.chatRoomId, global.userId, data, userData, this.state.employer).then(() => {
                sendNotification('Image')
            })
        })
    }

    sendNotification(message) {
        let body = {
            receiver: global.userId,
            // receiver: employerId,
            message: message,
        }
        ApiCaller.call('SendNotification', "POST", body, true)
            .then((response) => {
                if (response) {
                    console.log("send Message notif ====>>>>", response)

                }
            })
            .catch((error) => {
                console.log("send Message", error);
            })
    }



    render() {
        return (
            <Fragment>

                <SafeAreaView style={[ChatStyle.statusColor]} />
                <SafeAreaView style={ChatStyle.bottomColor}>

                    <View style={{ flex: 1 }}>
                        <View style={{ width: '100%', paddingTop: 10, paddingBottom: 10, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity style={{ flex: 0.1, paddingLeft: 10 }} activeOpacity={0.9}
                                onPress={() => this.backPress()}>
                                <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={require('../../assets/images/back_arrow.png')} />
                            </TouchableOpacity>

                            <Text style={{ flex: 0.9, color: 'black', fontSize: 20, textAlign: 'center', fontFamily: 'HelveticaNeueLTStd-Roman' }}>Prada Hair Salon</Text>


                            <View style={{ flex: 0.1, width: 120, alignItems: 'center' }}>
                                <Menu
                                    ref={this.setMenuRef}
                                    style={{ marginTop: 40 }}
                                    button={<TouchableOpacity onPress={this.showMenu}>
                                        <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../../assets/images/black_dots.png')} />
                                    </TouchableOpacity>}>

                                    <MenuItem style={ChatStyle.menuStyle} onPress={this.clearChat}>Clear Chat</MenuItem>
                                    <MenuDivider />
                                    <MenuItem style={ChatStyle.menuStyle} onPress={this.blockUser}>Block User</MenuItem>
                                    <MenuDivider />
                                    <MenuItem style={ChatStyle.menuStyle} onPress={this.reportUser}>Report User</MenuItem>
                                    <MenuDivider />
                                </Menu>
                            </View>
                        </View>



                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ flex: 1, backgroundColor: 'white' }}>
                                <FlatList
                                    contentContainerStyle={ChatStyle.flatStyle}
                                    data={this.state.chatList}
                                    renderItem={({ item, index }) => this.getView(item, index)
                                    } />

                            </View>
                        </ScrollView>
                        {/* <KeyboardAvoidingView style={{}} behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}> */}
                        {/* <ScrollView> */}
                        {this.state.hideTextInput == false ?
                            <View style={ChatStyle.inputView}>
                                <TouchableOpacity activeOpacity={1} onPress={() => this.showActionSheet()} >
                                    <Image style={ChatStyle.image} source={require('../../assets/images/add_file.png')} />
                                </TouchableOpacity>
                                <View style={{ marginLeft: 5, flex: 1, flexDirection: 'row', backgroundColor: '#d9d9d9', borderRadius: 30, alignItems: 'center' }}>
                                    <TextInput style={ChatStyle.textInput}
                                        placeholder="Type your message here"
                                        fontSize={16}
                                        multiline={true}
                                        blurOnSubmit={true}
                                        returnKeyType={'done'}
                                        onChangeText={(message) => this.setState({ message: message })}
                                        value={this.state.message} />

                                    <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => this.onSendMsg()}>
                                        <Image style={ChatStyle.imageSend} source={require('../../assets/images/send_icon.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View> : null}
                        {/* </ScrollView> */}
                        {/* </KeyboardAvoidingView> */}
                    </View>
                    <Modal
                        isVisible={this.state.modalVisible === 'slow'}
                        animationInTiming={1000}
                        animationOutTiming={1000}
                        backdropTransitionInTiming={800}
                        backdropTransitionOutTiming={800}>

                        <View style={ChatStyle.modalView}>

                            <TouchableOpacity style={ChatStyle.crossView} activeOpacity={1} onPress={() => this.closeReport()}>
                                <Image style={ChatStyle.crossImage} source={require('../../assets/images/cross.png')} />
                            </TouchableOpacity>

                            <View style={{ paddingLeft: 10, paddingRight: 10, alignSelf: 'center' }}>

                                <Text style={ChatStyle.reportUser}>Report User</Text>

                                <View style={ChatStyle.reportView}>
                                    <CheckBox
                                        isChecked={this.state.radio == 0}
                                        checkedImage={<Image style={ChatStyle.reportCheckImg} source={require('../../assets/images/checked.png')} />}
                                        unCheckedImage={<Image style={ChatStyle.reportCheckImg} source={require('../../assets/images/unchecked.png')} />}
                                        onClick={() => this.setState({ radio: 0 })} />
                                    <Text style={ChatStyle.reportCheckText}>Service provider profile such as a spam</Text>
                                </View>

                                <View style={ChatStyle.reportView}>
                                    <CheckBox
                                        isChecked={this.state.radio == 1}
                                        checkedImage={<Image style={ChatStyle.reportCheckImg} source={require('../../assets/images/checked.png')} />}
                                        unCheckedImage={<Image style={ChatStyle.reportCheckImg} source={require('../../assets/images/unchecked.png')} />}
                                        onClick={() => this.setState({ radio: 1 })} />
                                    <Text style={ChatStyle.reportCheckText}>Service provider is very rude</Text>
                                </View>

                                <View style={ChatStyle.reportView}>
                                    <CheckBox
                                        isChecked={this.state.radio == 2}
                                        checkedImage={<Image style={ChatStyle.reportCheckImg} source={require('../../assets/images/checked.png')} />}
                                        unCheckedImage={<Image style={ChatStyle.reportCheckImg} source={require('../../assets/images/unchecked.png')} />}
                                        onClick={() => this.setState({ radio: 2 })} />
                                    <Text style={ChatStyle.reportCheckText}>Service provider is inappropriate</Text>
                                </View>

                                <View style={ChatStyle.reportView}>
                                    <CheckBox
                                        isChecked={this.state.radio == 3}
                                        checkedImage={<Image style={ChatStyle.reportCheckImg} source={require('../../assets/images/checked.png')} />}
                                        unCheckedImage={<Image style={ChatStyle.reportCheckImg} source={require('../../assets/images/unchecked.png')} />}
                                        onClick={() => this.setState({ radio: 3 })} />
                                    <Text style={ChatStyle.reportCheckText}>Other</Text>
                                </View>


                                <TouchableOpacity activeOpacity={1} style={ChatStyle.buttonStyle}
                                    onPress={() => this.submitReport(this.state.radio)}>
                                    <Text style={ChatStyle.buttonTextStyle}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </SafeAreaView>
            </Fragment>


        );
    }

}
