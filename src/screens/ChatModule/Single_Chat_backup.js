import React, { Component, Fragment } from 'react';
import { View, Text, Image, TextInput, FlatList, ScrollView,KeyboardAvoidingView, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import ChatStyle from './ChatStyle';
import { removeAndroidBackButtonHandler, handleAndroidBackButton } from '../../routes/Backer';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Modal from 'react-native-modal';
import CheckBox from 'react-native-check-box';

const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0


export default class SingleChat extends Component {

    constructor() {
        super();
        this.state = {
            radio: 0,
            modalVisible: false,
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
            this.setState({ modalVisible: 'slow' });
        }, 500);
        
    };


    submitReport() {
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
        handleAndroidBackButton(() => this.props.navigation.goBack())

        this.props.navigation.addListener(
            'willFocus',
            () => {
                handleAndroidBackButton(() => this.props.navigation.goBack())
            }
        );


    }
    componentWillReceiveProps() {



    }


    componentWillUnmount() {
        removeAndroidBackButtonHandler();
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

    onSendMsg() {

    }

    backPress() {
        this.props.navigation.goBack()
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
                                    <MenuItem style={ChatStyle.menuStyle} onPress={this.blockUser}>Report User</MenuItem>
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
                        <KeyboardAvoidingView style={{
                        }} behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}> 
                            <ScrollView>
                        <View style={ChatStyle.inputView}>
                            <TouchableOpacity activeOpacity={1}>
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
                        </View>
                        </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                    <Modal
                        isVisible={this.state.modalVisible === 'slow'}
                        animationInTiming={1000}
                        animationOutTiming={1000}
                        backdropTransitionInTiming={800}
                        backdropTransitionOutTiming={800}>

                        <View style={ChatStyle.modalView}>

                            <TouchableOpacity style={ChatStyle.crossView} activeOpacity={1} onPress={() => this.submitReport()}>
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
                                    onPress={() => this.submitReport()}>
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
