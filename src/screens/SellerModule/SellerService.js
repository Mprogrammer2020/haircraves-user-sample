import React, { Component, Fragment } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity, TextInput, ScrollView, FlatList, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import Toasty from '../../elements/Toasty';
import homeStyle from '../HomeModule/homeStyle'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';


export default class SellerService extends Component {

    constructor() {
        super()
        this.state = {
            email: '',
            message: '',
            chatList: [{ barberImage: require('../../assets/images/ic_placeholder.png'), barber: 'Lucy Kim', time: '10:00 AM', service: 'Stylish haircut', description: "Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the industry's.", products: 'Herbal Essences and 2 others' },
            { barberImage: require('../../assets/images/ic_placeholder.png'), barber: 'Peter Parker', time: '10:00 AM', service: 'Stylish haircut', description: "LLorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the industry's.", products: 'Herbal Essences and 2 others' }]
        }
    }



    componentDidMount() {
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

    onSendMsg() {

    }

    clearFields() {
        setTimeout(() => {
            this.setState({ message: '' })
        }, 1000);
    }

    render() {
        return (
            <Fragment>
                {Platform.OS == 'ios' ? <StatusBar barStyle="dark-content" translucent={true} /> : <StatusBar hidden={false} backgroundColor="#4CC9CA" translucent={false} />}

                <SafeAreaView style={[homeStyle.statusColor]} />
                <SafeAreaView style={homeStyle.bottomColor}>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={[{ flex: 1, }]}>
                            <View style={{ flex: 1, marginBottom: 8 }}>
                                <TouchableOpacity style={{ flex: 1, flexDirection: 'column', padding: 5, alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', width: '100%', marginLeft: 10, alignItems: 'center' }}>
                                        <Image style={{ height: 50, width: 50, borderRadius: 25 }} source={require('../../assets/images/ic_placeholder.png')} />
                                        <View style={{ flex: 1, flexDirection: 'column', marginLeft: 10 }}>
                                            <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt' }}>Mark Smith</Text>
                                            <Text numberOfLines={1} style={{ fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey' }}>10:00 AM</Text>
                                        </View>
                                        <Image style={{ height: 25, width: 25, marginRight: 10 }} source={require('../../assets/images/black_dots.png')} />
                                    </View>
                                    <Image style={{ height: 200, width: '100%', marginTop: 5 }} source={require('../../assets/images/img.png')} />
                                    <Text style={{ fontSize: 16, width: '95%', color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt', marginTop: 20 }}>Stylish haircut</Text>
                                    <Text style={{ fontSize: 14, width: '95%', fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey' }}>Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the industry's.</Text>
                                    <Text numberOfLines={1} style={{ fontSize: 14, width: '95%', fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey' }}>Tag Products: Herbal Essences and 2 others</Text>

                                </TouchableOpacity>


                            </View>

                            <FlatList
                                scrollEnabled={false}
                                data={this.state.chatList}
                                refreshing={this.state.refreshing}
                                renderItem={({ item, index }) =>
                                    <View style={{ flex: 1, borderBottomColor: '#d7dada', borderBottomWidth: 1, marginBottom: 8 }}>
                                        <TouchableOpacity activeOpacity={1} style={{ flex: 1, flexDirection: 'column', padding: 5, alignItems: 'center' }}>
                                            <View style={{ flexDirection: 'row', width: '100%', marginLeft: 10 }}>
                                                <Image style={{ height: 50, width: 50, borderRadius: 5 }} source={item.barberImage} />
                                                <View style={{ flex: 1, flexDirection: 'column', padding: 5, paddingLeft: 15, marginLeft: 5, marginRight: 5, backgroundColor: '#4CC9CA', borderRadius: 20, borderTopLeftRadius: 0, }}>
                                                    <Text style={{ fontSize: 16, color: 'white', fontFamily: 'HelveticaNeueLTStd-Md' }}>{item.barber}</Text>
                                                    <Text style={{ fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'white' }}>{item.description}</Text>
                                                    <Text numberOfLines={1} style={{ fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey', marginTop: 5, marginBottom: 5 }}>{item.time}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>


                                    </View>

                                }
                                keyExtractor={item => item.id}
                            />

                        </View>
                    </ScrollView>

                </SafeAreaView>
            </Fragment>
        )
    }
}

