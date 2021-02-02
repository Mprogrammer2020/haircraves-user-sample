import React, { Component, Fragment, useState, useEffect } from 'react';
import { View, Image, Text, FlatList, Alert, SafeAreaView, StatusBar, Dimensions, TouchableOpacity, ScrollView, BackHandler } from 'react-native'
import ChatStyle from './ChatStyle';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import moment from 'moment';
import ChatHelper from '../../screens/ChatModule/ChatHelper';
import { EventRegister } from 'react-native-event-listeners';
import { SwipeListView } from 'react-native-swipe-list-view';
import Animated from 'react-native-reanimated';


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default function Chat(props) {
    const [messages, setMessages] = useState([]);


    function openChat(item) {
        console.log(item)
        props.navigation.navigate('SingleChat', { sellerDetail: item.sellerDetails })
    }

    useEffect(() => {

        props.navigation.addListener(
            'willFocus',
            () => {
                handleAndroidBackButton(() => props.navigation.goBack())
            })

        EventRegister.emit('loader', true)
        let listener = ChatHelper.listenerOnMyChatrooms(global.userId).on('value', chats => {
            EventRegister.emit('loader', false)
            let arr = []
            setMessages([])
            chats.forEach(element => {
                if (element.val().lastMessage)
                    arr.push(element.val())
            });
            const sortedArray = arr.sort((a, b) => moment(b.lastMessage.createdAt).format('YYYYMMDDHHmm') - moment(a.lastMessage.createdAt).format('YYYYMMDDHHmm'))
            console.log("fffff", sortedArray)
            setMessages(sortedArray)
        })

        return function clean() {
            ChatHelper.listenerOnMyChatrooms(global.userId).off('value', listener);
        }
    }, [])



    function drawerOpen() {
        props.navigation.toggleDrawer();
    }

    function handleBackButtonClick() {
        props.navigation.goBack();
        return true;
    }

    const removeChat = (data) => {
        ChatHelper.deleteChat(global.userId, data.item.chatRoomId)
    }

    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <View style={{ flex: 1 }}>
                <View style={ChatStyle.barStyle}>
                    <TouchableOpacity style={{ paddingLeft: 10 }} activeOpacity={0.9}
                        onPress={() => drawerOpen()}>
                        <Image style={{ width: 22, height: 22, resizeMode: 'contain' }} source={require('../../assets/images/menu_black.png')} />
                    </TouchableOpacity>

                    <Text style={[ChatStyle.headerText, { paddingTop: Platform.OS === 'ios' ? 8 : 0, marginRight: 15 }]}>Messages</Text>

                </View>


                <View style={ChatStyle.viewMain}>
                    {messages.length > 0 ?
                        <SwipeListView
                            data={messages}
                            extraData={messages}
                            keyExtractor={(item) => item.chatRoomId}
                            contentContainerStyle={{ paddingLeft: 5, paddingRight: 5 }}
                            useNativeDriver={true}
                            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                            rightOpenValue={-58}
                            disableRightSwipe={true}
                            renderItem={({ item }) => {
                                return <View>
                                    <View activeOpacity={1} style={{
                                        flex: 1, elevation: 2, backgroundColor: 'white',
                                        shadowOffset: { width: 1, height: 1 },
                                        shadowOpacity: 0.2,
                                    }}>
                                        <TouchableOpacity activeOpacity={1} onPress={() => { openChat(item) }} style={ChatStyle.viewChat}>

                                            {item.sellerDetails.image ?
                                                <Image style={ChatStyle.barberImage} source={{ uri: item.sellerDetails.image }} />
                                                :
                                                <Image style={ChatStyle.barberImage} source={require('../../assets/images/ic_placeholder.png')} />}

                                            <View style={ChatStyle.viewInternalChat}>
                                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                                    <Text style={ChatStyle.barberSalon}>{item.sellerDetails.name}</Text>
                                                    {item.lastMessage.type == 'text' ?
                                                        <Text numberOfLines={1} style={ChatStyle.messageText}>{item.lastMessage.message}</Text>
                                                        :
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Image style={{ width: 15, height: 15, marginRight: 5 }} source={require('../../assets/images/photo_camera.png')} />
                                                            <Text numberOfLines={1} style={{ fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Roman', color: 'grey' }}>Photo</Text>
                                                        </View>
                                                    }
                                                </View>
                                                <Text style={ChatStyle.timeText}>{moment(item.lastMessage.createdAt).fromNow(true)}</Text>
                                            </View>

                                        </TouchableOpacity>

                                    </View>
                                </View>
                            }}
                            renderHiddenItem={(item) => (
                                <View style={ChatStyle.rowBack}>
                                    <Text></Text>
                                    <Animated.View>
                                        <TouchableOpacity style={{ marginRight: 25 }} activeOpacity={1} onPress={() => removeChat(item)}>
                                            <Image style={{ width: 40, height: 40, resizeMode: 'contain' }} source={require('../../assets/images/dlt_red.png')} />
                                        </TouchableOpacity>
                                    </Animated.View>
                                </View>
                            )}
                            rightOpenValue={-75}
                        />

                        :
                        <View style={{ width: '100%', height: viewportHeight - 90, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Md' }}>No chat found</Text>
                        </View>
                    }

                </View>
            </View >
        </SafeAreaView>
    );
}


{/* {messages.length > 0 ?
                        <FlatList
                            scrollEnabled={false}
                            data={messages}
                            extraData={messages}
                            contentContainerStyle={{ paddingLeft: 5, paddingRight: 5 }}
                            renderItem={({ item, index }) =>
                                <TouchableOpacity activeOpacity={1} onPress={() => { openChat(item) }} style={ChatStyle.viewChat}>
                                    {console.log("messages", item)}

                                    {item.sellerDetails.image ?
                                        <Image style={ChatStyle.barberImage} source={{ uri: item.sellerDetails.image }} />
                                        :
                                        <Image style={ChatStyle.barberImage} source={require('../../assets/images/ic_placeholder.png')} />}
                                    <View style={ChatStyle.viewInternalChat}>
                                        <View style={{ flex: 1, flexDirection: 'column' }}>
                                            <Text style={ChatStyle.barberSalon}>{item.sellerDetails.name}</Text>
                                            {item.lastMessage.type == 'text' ?
                                                <Text numberOfLines={1} style={ChatStyle.messageText}>{item.lastMessage.message}</Text>
                                                :
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Image style={{ width: 15, height: 15, marginRight: 5 }} source={require('../../assets/images/photo_camera.png')} />
                                                    <Text numberOfLines={1} style={{ fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Roman', color: 'grey' }}>Photo</Text>
                                                </View>
                                            }
                                        </View>
                                        <Text style={ChatStyle.timeText}>{moment(item.lastMessage.createdAt).fromNow(true)}</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                            keyExtractor={item => item.id}
                        /> */}