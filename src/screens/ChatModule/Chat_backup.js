import React, { Component, Fragment } from 'react';
import { View, Image, Text, FlatList, Alert, SafeAreaView, StatusBar, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import { Base64 } from '../../constants/common';
import ChatStyle from './ChatStyle';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';



export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatList: [{ barberImage: require('../../assets/images/img_pro.png'), barber: 'Classic Gentle Barbershop', message: 'Hi How are you?', time: '10:00 AM' },
            { barberImage: require('../../assets/images/lucky_kim.png'), barber: 'Prada Hair Salon', message: 'I am looking for haircur and face massage...', time: '11:00 AM' },
            { barberImage: require('../../assets/images/home_image.png'), barber: 'Classic Gentle Barbershop', message: 'What me will be good to come there...', time: '12:00 PM' }]
        }
    }


    componentDidUpdate() {

    }

    componentDidMount() {
        this.props.navigation.addListener(
            'willFocus',
            () => {
                handleAndroidBackButton(() => this.props.navigation.goBack())
                StatusBar.setBackgroundColor('#ffffff');
                StatusBar.setBarStyle('dark-content');
            }
        );
    }

    componentWillUnmount() {
        removeAndroidBackButtonHandler();
    }

    componentWillMount() {

    }

    _onPressSingle(item) {
        this.props.navigation.navigate(item)
    }


    drawerOpen() {
        this.props.navigation.toggleDrawer();
    }

    render() {
        return (
            <Fragment>
                {Platform.OS == 'ios' ? <StatusBar barStyle="dark-content" translucent={true} /> : <StatusBar hidden={false} barStyle="dark-content" backgroundColor="white" translucent={false} />}

                <SafeAreaView style={[ChatStyle.statusColor]} />
                <SafeAreaView style={ChatStyle.bottomColor}>

                    <View style={{ flex: 1 }}>
                        <View style={ChatStyle.barStyle}>
                            <TouchableOpacity style={{ paddingLeft: 10 }} activeOpacity={0.9}
                                onPress={() => this.drawerOpen()}>
                                <Image style={{ width: 22, height: 22, resizeMode: 'contain' }} source={require('../../assets/images/menu_black.png')} />
                            </TouchableOpacity>

                            <Text style={[ChatStyle.headerText, { paddingTop: Platform.OS === 'ios' ? 8 : 0, marginRight: 15 }]}>Messages</Text>

                        </View>

                        <View style={ChatStyle.viewMain}>

                            <FlatList
                                scrollEnabled={false}
                                data={this.state.chatList}
                                contentContainerStyle={{ paddingLeft: 5, paddingRight: 5 }}
                                refreshing={this.state.refreshing}
                                renderItem={({ item, index }) =>
                                    <TouchableOpacity activeOpacity={1} onPress={() => this._onPressSingle('SingleChat')} style={ChatStyle.viewChat}>
                                        <Image style={ChatStyle.barberImage} source={item.barberImage} />
                                        <View style={ChatStyle.viewInternalChat}>
                                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                                <Text style={ChatStyle.barberSalon}>{item.barber}</Text>
                                                <Text numberOfLines={1} style={ChatStyle.messageText}>{item.message}</Text>
                                            </View>
                                            <Text style={ChatStyle.timeText}>{item.time}</Text>
                                        </View>
                                    </TouchableOpacity>
                                }
                                keyExtractor={item => item.id}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </Fragment>
        );
    }
}