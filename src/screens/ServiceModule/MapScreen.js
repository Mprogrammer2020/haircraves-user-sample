import React, { Component, Fragment } from 'react';
import { View, Dimensions, Image, Text, TouchableOpacity, TextInput, ScrollView, FlatList, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import Toasty from '../../elements/Toasty';
import serviceStyle from './serviceStyle'
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import CommonHeader from '../../elements/CommonHeader';
import MapView, { Marker } from 'react-native-maps';
import { EventRegister } from 'react-native-event-listeners';
import ApiCaller from '../../constants/ApiCaller';
import Geolocation from '@react-native-community/geolocation';
import RNSettings from 'react-native-settings';
import { openSettings } from 'react-native-permissions';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
// const LATITUDE = 37.78825;
// const LONGITUDE = -122.4324;  

// const LATITUDE = 30.7046;
// const LONGITUDE = 76.7179;

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class MapScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            providerList: [],
            region: {
                latitude: 0.0,
                longitude: 0.0,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            markers: [],
        };
    }


    getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const initialPosition = JSON.stringify('>>>>' + position.coords);

                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    },
                })
                console.log("latitude===>>>", position.coords.latitude)
                console.log("longitude===>>>", position.coords.longitude)


            },
            error => {
                if (error.code == error.TIMEOUT) {

                }
                if (error.code == error.PERMISSION_DENIED) {
                    this.permissionDenied()
                }
                if (error.code == error.POSITION_UNAVAILABLE) {
                    this.showGpsAlert()
                }

                console.log("Geo Loaction Error", error.code, error.POSITION_UNAVAILABLE)

                console.log("Geo Loaction Error", JSON.stringify(error.message))
            },
            { enableHighAccuracy: false, timeout: 20000 }
        );

        // this.watchID = Geolocation.watchPosition(position => {
        //     const lastPosition = JSON.stringify(position.coords);

        // },
        //     error => {
        //         if (error.code == error.TIMEOUT) {

        //         }
        //         if (error.code == error.PERMISSION_DENIED) {
        //             this.permissionDenied()
        //         }
        //         if (error.code == error.POSITION_UNAVAILABLE) {
        //             this.showGpsAlert()
        //         }

        //         console.log('Watch ID Error', JSON.stringify(error.message))
        //     },
        //     { enableHighAccuracy: false, timeout: 20000 }
        // );

    }


    permissionDenied() {
        Alert.alert("Hair Cravtes",
            'Please grant location permissions from app settings',
            [
                {
                    text: 'Cancel', onPress: () => { }
                },
                { text: 'Open Settings', onPress: () => { openSettings().catch(() => console.warn('cannot open settings')); } },
            ],
            { cancelable: false },
        );
    }


    showGpsAlert() {
        console.log('location is disabled ddd');
        Alert.alert(
            'GPS Disabled',
            'Please turn on the GPS',
            [
                {
                    text: 'Cancel', onPress: () => { }
                },
                {
                    text: 'Open Settings', onPress: () => {
                        RNSettings.openSetting(RNSettings.ACTION_LOCATION_SOURCE_SETTINGS).then(
                            result => {
                                if (result === RNSettings.ENABLED) {

                                    console.log('location is enabled');
                                } else {

                                }
                            },
                        );
                    }
                },
            ],
            { cancelable: true },
        );

    }




    componentDidMount() {
        this.providerApiCall()
        this.props.navigation.addListener(
            'willFocus',
            () => {
                this.getCurrentLocation()
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


    providerApiCall() {
        EventRegister.emit('loader', true)
        ApiCaller.call('users/providers?search=', "GET", null, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("providerList ===>>>>", response.providersList)
                    this.setState({ providerList: response.providersList })
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }


    openDetail(marker) {
        console.log(marker)
    }

    render() {
        return (
            <Fragment>

                <SafeAreaView style={[serviceStyle.statusColor]} />
                <SafeAreaView style={serviceStyle.bottomColor}>
                    <View style={{ flex: 1 }}>

                        <CommonHeader
                            drawable={require('../../assets/images/back_arrow.png')}
                            action={() => this.props.navigation.goBack()}
                            title='Hair Service'
                            title1='' />

                        <View style={{ flex: 1 }}>
                            <MapView
                                style={{ flex: 1 }}
                                region={this.state.region}
                                showsUserLocation={true}
                                initialRegion={this.state.region}>
                                {this.state.providerList.map(markers => (
                                    <MapView.Marker
                                        coordinate={{
                                            latitude: markers.user.latitude ? parseFloat(markers.user.latitude) : 0,
                                            longitude: markers.user.longitude ? parseFloat(markers.user.longitude) : 0
                                        }}
                                        title={markers.user.first_name}
                                        tooltip={true}
                                        onCalloutPress={() => this.openDetail(markers)}>

                                        <Image
                                            source={require('../../assets/images/location_marker.png')}
                                            style={{ height: 30, width: 30 }}
                                        />

                                        {Platform.OS == 'ios' ? <MapView.Callout tooltip style={{}} onPress={() => { global.providerID = markers.user.id; this.props.navigation.navigate('SellerProfile')}}>
                                            <TouchableOpacity activeOpacity={1}>
                                                <View style={{ backgroundColor: 'white', alignItems: 'center', width: 200, justifyContent: 'center', padding: 10 }}>
                                                    <Text style={{ fontFamily: 'HelveticaNeueLTStd-Md', fontSize: 14, }}>{markers.user.first_name}</Text>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Image style={{ width: 15, height: 15, resizeMode: 'contain' }} source={require('../../assets/images/location_black.png')} />
                                                        <Text numberOfLines={4} style={{ fontFamily: 'HelveticaNeueLTStd-Lt', fontSize: 12, lineHeight: 16 }}>{markers.businessAddress}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </MapView.Callout> :

                                            <MapView.Callout tooltip style={{ paddingBottom: 10 }} onPress={() => { global.providerID = markers.user.id; this.props.navigation.navigate('SellerProfile')}}>
                                                <TouchableOpacity activeOpacity={1} style={{ width: 260, alignSelf: 'center' }} activeOpacity={1}>
                                                    <View style={{ backgroundColor: 'white', padding: 5, paddingTop: 10, borderRadius: 10 }}>
                                                        <Text style={{ fontFamily: 'HelveticaNeueLTStd-Md', fontSize: 14, textAlign: 'center' }}>{markers.user.first_name}</Text>
                                                        <Text style={{ flexDirection: 'column' }}> <Image style={{ width: 15, height: 15 }} source={require('../../assets/images/location_black.png')} resizeMode="cover" />
                                                            <Text numberOfLines={1} style={{ fontFamily: 'HelveticaNeueLTStd-Lt', fontSize: 12, lineHeight: 16 }}>{markers.businessAddress}</Text></Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </MapView.Callout>

                                        }
                                    </MapView.Marker>
                                ))}
                            </MapView>
                        </View>

                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }
}

