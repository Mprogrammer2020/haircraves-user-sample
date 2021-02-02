import React, { Component, Fragment } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity, TextInput, ScrollView, FlatList, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import Toasty from '../../elements/Toasty';
import sellerStyle from './sellerStyle'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import StarRating from 'react-native-star-rating';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';


export default class Seller extends Component {

    constructor() {
        super()
        this.state = {
            email: '',
            availabilityList: [{ availabilityDay: 'Monday', time: '10:00AM to 09:00 PM' },
            { availabilityDay: 'Tuesday', time: '10:00AM to 09:00 PM' },
            { availabilityDay: 'Wednesday', time: '10:00AM to 09:00 PM' },
            { availabilityDay: 'Thursday', time: '10:00AM to 09:00 PM' },
            { availabilityDay: 'Friday', time: '10:00AM to 09:00 PM' },
            { availabilityDay: 'Saturday', time: '10:00AM to 09:00 PM' },
            { availabilityDay: 'Sunday', time: '10:00AM to 09:00 PM' }],


            portfolioList: [{ portfolio: require('../../assets/images/img.png'), service: 'Stylish haircut', description: "Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the industry's." },
            { portfolio: require('../../assets/images/portfolio_2.png'), service: 'Stylish haircut', description: "Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the industry's." }],


            productList: [{ productImage: require('../../assets/images/imgggg.png'), service: 'Vedix Hair Solution', rating: 5, description: "Vedix is India's first and only first ayurvedic hair care regimen.", price: '10', number: '97' },
            { productImage: require('../../assets/images/imgggg.png'), service: 'Tea Tree Hair Color', rating: 5, description: "Vedix is India's first and only first ayurvedic hair care regimen.", price: '15', number: '97' }],


            serviceList: [{ serviceImage: require('../../assets/images/hair_cut.png'), serviceName: 'Hair Cut', time: '1 hr', price: '10' },
            { serviceImage: require('../../assets/images/hair.png'), serviceName: 'Hair Braiding', time: ' hr', price: '55' },
            { serviceImage: require('../../assets/images/sewin.png'), serviceName: 'Sewin', time: '2 hr', price: '10' },
            { serviceImage: require('../../assets/images/natural.png'), serviceName: 'Natural Hair Treatment', time: '3 hr', price: '17' },
            { serviceImage: require('../../assets/images/coloring.png'), serviceName: 'Coloring', time: '2 hr', price: '10' },
            { serviceImage: require('../../assets/images/deep.png'), serviceName: 'Deep Condition Treatment', time: '1 hr', price: '55' }]

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



    render() {
        return (
            <Fragment>
                {Platform.OS == 'ios' ? <StatusBar barStyle="dark-content" translucent={true} /> : <StatusBar hidden={false} backgroundColor="#4CC9CA" translucent={false} />}

                <SafeAreaView style={[sellerStyle.statusColor]} />
                <SafeAreaView style={sellerStyle.bottomColor}>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={[{ flex: 1, padding: 10 }]}>

                            <FlatList
                                scrollEnabled={false}
                                data={this.state.serviceList}
                                refreshing={this.state.refreshing}
                                renderItem={({ item, index }) =>
                                    <View style={{ flex: 1, borderBottomColor: '#d7dada', borderBottomWidth: 1, marginBottom: 8 }}>
                                        <TouchableOpacity style={{ flex: 1, flexDirection: 'column', padding: 5, alignItems: 'center', paddingBottom: 10, paddingTop: 10 }}>
                                            <View style={{ flexDirection: 'row', width: '100%', marginLeft: 10, alignItems: 'center' }}>
                                                <Image style={{ height: 50, width: 50, borderRadius: 25 }} source={item.serviceImage} />
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ paddingLeft: 20, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt' }}>{item.serviceName}</Text>
                                                    <Text style={{ paddingLeft: 20, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt' }}>${item.price}</Text>
                                                    <Text style={{ paddingLeft: 20, fontSize: 16, color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt' }}>{item.time}</Text>

                                                </View>

                                                <TouchableOpacity activeOpacity={1} style={{ alignItems: 'center', backgroundColor: 'red', width: 65, borderRadius: 20, padding: 5 }}>
                                                    <Text style={{ textAlign: 'center', fontSize: 14, width: '95%', marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'white' }}>Add</Text>
                                                </TouchableOpacity>
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



{/* <FlatList
    scrollEnabled={false}
    data={this.state.portfolioList}
    refreshing={this.state.refreshing}
    renderItem={({ item, index }) =>
        <TouchableOpacity style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>

            <Image style={{ height: 200, width: '100%', marginTop: 5 }} source={item.portfolio} />
            <Text style={{ fontSize: 16, width: '95%', color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt', marginTop: 5 }}>{item.service}</Text>
            <Text style={{ fontSize: 14, width: '95%', fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey' }}>{item.description}</Text>

        </TouchableOpacity>

    }
    keyExtractor={item => item.id}
/> */}


{/* <FlatList
                                scrollEnabled={false}
                                data={this.state.availabilityList}
                                refreshing={this.state.refreshing}
                                renderItem={({ item, index }) =>
                                    <View style={{ flex: 1, padding: 10, flexDirection: 'row', borderBottomColor: '#d7dada', borderBottomWidth: 1, marginBottom: 8 }}>
                                        <Text style={{ flex: 1, fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt' }}>{item.availabilityDay}</Text>
                                        <Text style={{ fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt' }}>{item.time}</Text>
                                    </View>

                                }
                                keyExtractor={item => item.id}
                            /> */}


{/* <View style={{borderBottomColor:'grey', borderBottomWidth :1, paddingTop:10 , paddingBottom :10}}>
                                <Text style={{ flex: 1, fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt' }}>Address</Text>
                                <Text style={{ marginTop:5 , flex: 1, fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt' }}>1234 Chestnut Street, Clearwater, Florida, 34623</Text>
                            </View>

                            <View style={{borderBottomColor:'grey', borderBottomWidth :1, paddingTop:10 , paddingBottom :10}}>
                                <Text style={{ flex: 1,  fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt' }}>Total Experience</Text>
                                <Text style={{ marginTop:5 , flex: 1, fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt' }}>5 Years</Text>
                            </View>

                            <View style={{borderBottomColor:'grey', borderBottomWidth :1, paddingTop:10 , paddingBottom :10}}>
                                <Text style={{flex: 1, fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt' }}>About me</Text>
                                <Text style={{marginTop:5 , flex: 1, fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</Text>
                            </View>
                            <View>
                                <Text style={{ padding: 5, flex: 1, fontSize: 14, fontFamily: 'HelveticaNeueLTStd-Lt' }}>Follow us</Text>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity>
                                        <Image style={{ height: 40, width: 40, margin: 5 }} source={require('../../assets/images/fb.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Image style={{ height: 40, width: 40, margin: 5 }} source={require('../../assets/images/insta.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Image style={{ height: 40, width: 40, margin: 5 }} source={require('../../assets/images/tw.png')} />
                                    </TouchableOpacity>
                                </View>

                            </View> */}




{/* <FlatList
    scrollEnabled={false}
    data={this.state.productList}
    refreshing={this.state.refreshing}
    renderItem={({ item, index }) =>
        <TouchableOpacity style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', padding: 5 }}>
                <View style={{ height: 120, width: 120 }}>
                    <Image style={{ height: 30, width: 30, borderRadius: 10, position: 'absolute', right: 10 }} source={require('../../assets/images/imgggg.png')} />
                    <Image style={{ height: 120, width: 120, borderRadius: 10 }} source={item.productImage} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ fontSize: 16, width: '95%', color: 'black', fontFamily: 'HelveticaNeueLTStd-Lt', marginTop: 5 }}>{item.service}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
                        <StarRating
                            disabled={false}
                            starSize={20}
                            fullStarColor={'#ED8A19'}
                            rating={item.rating}
                        />
                        <Text style={{ fontSize: 14, width: '95%', marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey' }}>{item.number}</Text>
                    </View>
                    <Text style={{ fontSize: 14, width: '95%', fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey' }}>{item.description}</Text>

                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
                        <Text style={{ flex: 1, fontSize: 14, width: '95%', marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'grey' }}>${item.price}</Text>
                        <TouchableOpacity activeOpacity={1} style={{ alignItems: 'center', backgroundColor: 'red', width: 65, borderRadius: 20, padding: 5 }}>
                            <Text style={{ textAlign: 'center', fontSize: 14, width: '95%', marginLeft: 5, fontFamily: 'HelveticaNeueLTStd-Lt', color: 'white' }}>Buy</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>
        </TouchableOpacity>

    }
    keyExtractor={item => item.id}
/> */}
