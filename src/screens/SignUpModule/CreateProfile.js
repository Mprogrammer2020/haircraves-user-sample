import React, { Component, Fragment, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, TextInput, ScrollView, Alert, Animated, Dimensions, BackHandler, ToastAndroid, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import styles from './styles'
import Toasty from '../../elements/Toasty';
import PhoneInput from 'react-native-phone-input';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import CommonHeader from '../../elements/CommonHeader';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-action-sheet';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import ApiCaller from '../../constants/ApiCaller';
import { EventRegister } from 'react-native-event-listeners'


import { check, openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

var BUTTONS = [
    'Capture Image',
    'Choose from library...',
    'Cancel',
];

var CAMERA_INDEX = 0;
var GALLERY_INDEX = 1;
var CANCEL_INDEX = 2;

let { width, height } = Dimensions.get('window');
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default class CreateProfile extends Component {
    constructor(props) {
        super(props)
        this.springValue = new Animated.Value(100);
        this.state = {
            backClickCount: 0,
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            focusInput: false,
            loader: false,
            avatarSource: null,
            countryCode: "+1",
            value: '',
            isDatePickerVisible: false,
            formattedDate: '',
            location: '',
            date: new Date(),
            currentLatitude: '',
            currentLongitude: '',
            myNumber: '',
            profilePic: '',


        };
    }


    initialState() {
        return {
            focusInput: false,
        };
    }


    componentDidMount() {
        this.props.navigation.addListener(
            'willFocus',
            () => {
                const { navigation } = this.props;
                var first_name = navigation.getParam('firstName');
                var last_name = navigation.getParam('lastName');
                var profile_pic = navigation.getParam('profilePic');
                this.setState({ firstName: first_name, lastName: last_name, profilePic: profile_pic })
                BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
            }
        );
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    }


    handleBackButton = () => {
        this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring();
        return true;
    };


    _spring() {
        ToastAndroid.show('Press back button again to exit', ToastAndroid.SHORT);

        this.setState({ backClickCount: 1 }, () => {
            Animated.sequence([
                Animated.spring(
                    this.springValue,
                    {
                        toValue: -.15 * height,
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

    validate() {
        const { firstName, lastName, phoneNumber, address } = this.state,
            reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let regx = /[- #*;,.<>]/;
        let phone = this.phoneNumber.getValue();
        let isValidPhone = this.phoneNumber.isValidNumber();
        // let valid = false;


        console.log('proFilePri', this.state.profilePic)

        if (this.state.avatarSource == null && this.state.profilePic.length === 0) {
            Toasty.show('Please upload your image');
            return false
        }

        else if (firstName.length === 0) {
            Toasty.show('First name field can\'t be empty');
            return false
        }
        else if (lastName.length === 0) {
            Toasty.show('Last name field can\'t be empty');
            return false
        }
        else if (this.state.formattedDate == '') {
            Toasty.show('DOB field can\'t be empty');
            return false
        }
        else if (this.state.value == '' || this.state.value == 0) {
            Toasty.show('Gender field can\'t be empty');
            return false
        }

        else if (phone.length == 3) {
            Toasty.show('Phone number field can\'t be empty');
        }

        // else if (regx.test(phone) === true) {
        //     Toasty.show('Phone number is not valid');
        // }
        // else if (!isValidPhone) {
        //     Toasty.show('Phone number is not valid');
        // }
        else if (phone.length < 7 || phone.length > 16) {
            Toasty.show('Phone number is not valid');
        }

        else if (this.state.location == '') {
            Toasty.show('Location field can\'t be empty');
            return false
        }

        else if (address.length === 0) {
            Toasty.show('Address field can\'t be empty');
            return false
        }
        else {
            return true
        }
    }

    createProfile() {
        const { firstName, lastName, phoneNumber } = this.state;
        if (this.validate()) {
            // this.props.navigation.navigate('PaymentDetail')
            this.createApiCall()
        }
    }

    createApiCall() {

        console.log("Response===>>>", this.state.imageUri,)

        EventRegister.emit('loader', true)

        let formdata = new FormData();
        if (this.state.avatarSource != null) {
            var photo = {
                uri: this.state.imageUri,
                type: 'image/jpeg',
                name: 'photo.jpg',
            };
            formdata.append('profile_pic', photo)
        }
        else {
            formdata.append('profile_pic_path', this.state.profilePic)
        }

        formdata.append('first_name', this.state.firstName)
        formdata.append('last_name', this.state.lastName)
        formdata.append('dob', this.state.formattedDate)
        formdata.append('latitude', this.state.currentLatitude ? this.state.currentLatitude : '30.7046')
        formdata.append('longitude', this.state.currentLongitude ? this.state.currentLongitude : '76.7179')
        formdata.append('address', this.state.address)
        formdata.append('phone_number', this.state.myNumber)
        formdata.append('gender', this.state.value == 1 ? 'Male' : 'Female')
        formdata.append('location', this.state.location)


        console.log("FormData===>", formdata)

        ApiCaller.multipartCall('users/createProfile', "PUT", formdata, true)
            .then((response) => {
                EventRegister.emit('loader', false)
                console.log("responseeee", response)
                if (response) {
                    Toasty.show(response.message)
                    this.props.navigation.navigate('PaymentDetail')
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }



    onPressFlag(value) {
        const phoneCC = this.phoneNumber.getCountryCode();
        this.setState({ countryCode: '+' + phoneCC });
    }




    clear = () => {
        this.textInputRef.clear();
    }

    sortValueChange = (data, value) => {
        this.setState({ location: data.description, currentLatitude: value.geometry.location.lat, currentLongitude: value.geometry.location.lng })

    }



    showDatePicker() {
        this.setState({ isDatePickerVisible: true })
    };

    hideDatePicker() {
        this.setState({ isDatePickerVisible: false })
    };

    handleConfirm() {
        this.setState({ isDatePickerVisible: false })
        console.warn("A date has been picked: ", date);
    };


    removeEmojis = (string) => {
        const regex = /\uD83C\uDFF4(?:\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74)\uDB40\uDC7F|\u200D\u2620\uFE0F)|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3]))|\uD83D\uDC69\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83D\uDC69\u200D[\u2695\u2696\u2708])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC68(?:\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])|(?:[#*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDD1-\uDDDD])/g
        return string.replace(regex, '')
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

            if (response.path.includes('.jpg') || response.path.includes('.jpeg') || response.path.includes('.png')) {
                this.setState({
                    avatarSource: source,
                    imageUri: source1
                });
            } else {
                Toasty.show("Only PNG and JPEG files format should be acceptable.")
            }

            // this.setState({
            //     avatarSource: source,
            //     imageUri: source1
            // });
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


            if (response.path.includes('.jpg') || response.path.includes('.jpeg') || response.path.includes('.png')) {
                this.setState({
                    avatarSource: source,
                    imageUri: source1
                });
            } else {
                Toasty.show("Only PNG and JPEG files format should be acceptable.")
            }

            // this.setState({
            //     avatarSource: source,
            //     imageUri: source1
            // });
        });
    }



    onTextChange(phoneNumber) {

        var myNumber = phoneNumber;

        console.log("MY NUMber", myNumber)
        this.setState({ myNumber: myNumber })

        if (phoneNumber.length == 3 || phoneNumber.length == 7) {
            this.setState({ phoneNumber: phoneNumber + ' ' })
        }
    }



    render() {
        const placeholder = {
            label: 'Select a sport...',
            value: null,
            color: '#9EA0A4',
        };
        return (
            <Fragment>
                <SafeAreaView style={[styles.statusColor]} />
                <SafeAreaView style={styles.bottomColor}>

                    <View>

                        <CommonHeader
                            title='Create Profile' />
                        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'none'} keyboardVerticalOffset={20}>

                            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                                <View style={[{ width: '100%', height: '100%', marginBottom: 80 }]}>

                                    <View style={[styles.createviewStyle]}>

                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <TouchableOpacity activeOpacity={1} onPress={() => this.showActionSheet()} >
                                                {this.state.avatarSource != null ? < Image style={[styles.createImage]} source={this.state.avatarSource} />
                                                    :
                                                    this.state.profilePic ? <Image style={[styles.createImage]} source={{ uri: this.state.profilePic }} />
                                                        : <Image style={[styles.createImage]} source={require('../../assets/images/ic_placeholder.png')} />
                                                }
                                            </TouchableOpacity>
                                            {/* <TouchableOpacity activeOpacity={1} onPress={() => this.showActionSheet()} >
                                            {this.state.avatarSource == null ? <Image style={[styles.createImage]} source={require('../../assets/images/upload_profile_image.png')} />
                                                : <Image style={[styles.createImage]} source={this.state.avatarSource} />}
                                        </TouchableOpacity> */}
                                            <Text style={[styles.uploadImageText]}>Upload Profile Picture</Text>
                                        </View>



                                        <View style={{ flexDirection: 'row', marginTop: 50 }}>
                                            <View style={[styles.createFirstView, { marginLeft: Platform.OS == 'ios' ? 0 : 2 }]}>
                                                <Text style={[styles.editText, { paddingLeft: Platform.OS == 'ios' ? 0 : 0 }]}>First Name</Text>
                                                <TextInput
                                                    style={[styles.createInputStyle, { paddingLeft: 0 }]}
                                                    placeholder="Enter First Name"
                                                    keyboardType="default"
                                                    maxLength={20}
                                                    blurOnSubmit={true}
                                                    placeholderTextColor='black'
                                                    onChangeText={(firstName) => this.setState({ firstName: this.removeEmojis(firstName.replace(/\s/g, '')) })}
                                                    returnKeyType='next'
                                                    onSubmitEditing={() => this.lastName.focus()}
                                                    value={this.state.firstName} />
                                            </View>


                                            <View style={[styles.createFirstView, { marginLeft: 5 }]}>
                                                <Text style={[styles.editText, { paddingLeft: Platform.OS == 'ios' ? 0 : 0, marginRight: 2 }]}>Last Name</Text>
                                                <TextInput
                                                    style={[styles.createInputStyle, { paddingLeft: 0 }]}
                                                    placeholder="Enter Last Name"
                                                    maxLength={20}
                                                    placeholderTextColor='black'
                                                    blurOnSubmit={true}
                                                    onChangeText={(lastName) => this.setState({ lastName: this.removeEmojis(lastName.replace(/\s/g, '')) })}
                                                    returnKeyType='done'
                                                    onSubmitEditing={this.handleTitleInputSubmit}
                                                    ref={(input) => this.lastName = input}
                                                    value={this.state.lastName} />
                                            </View>

                                        </View>

                                        <View style={[styles.editView, { marginTop: 10 }]}>
                                            <Text style={[styles.editText, { paddingLeft: Platform.OS == 'ios' ? 0 : 0 }]}>Date of birth</Text>
                                            <DateTimePickerModal
                                                isVisible={this.state.isDatePickerVisible}
                                                mode="date"
                                                display='spinner'
                                                date={this.state.date}
                                                onCancel={() => this.hideDatePicker()}
                                                onConfirm={(date) => {
                                                    if (date != undefined) {
                                                        if (this.state.isDatePickerVisible) {
                                                            this.setState({
                                                                isDatePickerVisible: false,
                                                                date: date,
                                                                formattedDate: moment(date).format('DD/MM/YYYY')
                                                            })
                                                        }
                                                    }
                                                    this.setState({ isDatePickerVisible: false, })
                                                }}

                                                maximumDate={moment().subtract(18, 'years').toDate()}
                                            />
                                            <TouchableOpacity activeOpacity={1} onPress={() => this.showDatePicker()} style={[styles.createInputView]}>
                                                <TextInput
                                                    editable={false}
                                                    style={[styles.createInputStyle, { width: '93%', paddingLeft: 0, borderBottomColor: 'white' }]}
                                                    placeholder="Select Date of Birth"
                                                    placeholderTextColor='black'
                                                    value={this.state.formattedDate} />
                                                <Image style={[{ width: 20, height: 20, resizeMode: 'contain' }]} source={require('../../assets/images/date_picker.png')} />

                                            </TouchableOpacity>
                                        </View>

                                        <View style={[styles.editView, { marginTop: 10, }]}>
                                            <Text style={[styles.editText, { paddingLeft: Platform.OS == 'ios' ? 0 : 0 }]}>Gender</Text>
                                            <View style={styles.createInputView}>
                                                <RNPickerSelect
                                                    pickerProps={{ mode: "dropdown" }}
                                                    placeholder={placeholder}
                                                    onValueChange={value => {
                                                        this.setState({
                                                            favSport3: value,
                                                        });
                                                    }}
                                                    style={{
                                                        inputAndroid: {
                                                            backgroundColor: 'transparent',
                                                            flex: 1,
                                                        },
                                                        iconContainer: {
                                                            top: 5,
                                                            right: 15,
                                                            flex: 1
                                                        },
                                                    }}
                                                    style={{
                                                        ...pickerSelectStyles,
                                                        iconContainer: {
                                                            top: Platform == 'ios' ? 0 : 10,
                                                            right: 0,
                                                        },
                                                    }}
                                                    useNativeAndroidPickerStyle={false}
                                                    onValueChange={(value) => this.setState({ value: value })}
                                                    placeholder={{ label: 'Select Gender', value: 0, placeholderTextColor: 'black' }}
                                                    items={[
                                                        { label: 'Male', value: 1, color: 'black' },
                                                        { label: 'Female', value: 2, color: 'black' },
                                                    ]}
                                                    Icon={() => {
                                                        return <Image style={{
                                                            height: 16, width: 16,
                                                            right: 5,
                                                            resizeMode: 'contain', position: 'absolute',
                                                            marginTop: Platform.OS === 'android' ? 12 : null,
                                                            marginTop: Platform.OS == 'ios' ? 0 : 8
                                                        }}
                                                            source={require('../../assets/images/down_arrow.png')} />
                                                            ;
                                                    }}
                                                />
                                            </View>
                                        </View>



                                        <View style={[styles.editView, { marginTop: 10 }]}>
                                            <Text style={[styles.editText, { paddingLeft: Platform.OS == 'ios' ? 0 : 0 }]}>Phone Number</Text>
                                            <View style={[styles.createInputView, { alignItems: 'center' }]}>
                                                <Text style={{ fontSize: 16, fontFamily: 'HelveticaNeueLTStd-Lt' }}>{this.state.countryCode}</Text>

                                                <Image style={[{ width: 10, height: 10, resizeMode: 'contain', marginLeft: 2 }]} source={require('../../assets/images/down_arrow_black.png')} />

                                                <PhoneInput style={{ padding: 10, paddingLeft: 3 }}
                                                    ref={ref => {
                                                        this.phoneNumber = ref;
                                                    }}
                                                    initialCountry="us"
                                                    placeholderTextColor='black'
                                                    placeholder="Phone Number"
                                                    onSelectCountry={(value) => this.onPressFlag(value)}
                                                    onChangePhoneNumber={(value) => this.onTextChange(value)}
                                                    value={this.state.phoneNumber} >
                                                </PhoneInput>

                                            </View>
                                            <Text style={styles.selectFlag}>Please select the flag to change the country</Text>

                                        </View>



                                        <View style={[styles.editView, { marginTop: 10 }]}>
                                            <Text style={[styles.editText, { paddingLeft: Platform.OS == 'ios' ? 0 : 0 }]}>Location</Text>

                                            <GooglePlacesAutocomplete
                                                value={this.state.location}
                                                placeholder='Enter Location'
                                                placeholderTextColor="black"
                                                listViewDisplayed='false'
                                                returnKeyType={'search'}
                                                ref={(instance) => { this.locationRef = instance }}
                                                onSubmitEditing={this.handleTitleInputSubmit}
                                                minLength={1}
                                                autoFocus={this.state.locFocus}
                                                fontFamily="HelveticaNeueLTStd-Lt"
                                                currentLocation={false}
                                                enablePoweredByContainer={false}
                                                onPress={(data, details = null) => {
                                                    this.sortValueChange(data, details)
                                                }}
                                                returnKeyType={'search'}
                                                fetchDetails={true}

                                                styles={{
                                                    textInputContainer: {
                                                        backgroundColor: '#fff',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: '100%',
                                                        height: 50,
                                                        borderTopColor: '#737373',
                                                        borderTopWidth: 0.1,


                                                    },

                                                    container: {
                                                        color: 'blue',

                                                    },
                                                    description: {
                                                        color: '#a2a0a0',
                                                    },
                                                    textInput: {
                                                        width: '100%',
                                                        fontSize: 16,
                                                        paddingLeft: 0,
                                                        fontFamily: 'HelveticaNeueLTStd-Lt',
                                                        alignItems: 'center',
                                                        color: 'black',
                                                        marginLeft: 0
                                                    },
                                                    predefinedPlacesDescription: {
                                                        color: '#6a6a6a'
                                                    },
                                                }}
                                                query={{
                                                    key: 'AIzaSyDAoXX_NnO7iVp7ENOGX-plaQOa5-1AUfs',
                                                    language: 'en',
                                                    types: '(cities)'
                                                }}

                                            />
                                        </View>

                                        <View style={[styles.editView, { marginTop: 10 }]}>
                                            <Text style={[styles.editText, { paddingLeft: Platform.OS == 'ios' ? 0 : 0 }]}>Address</Text>
                                            <View style={[styles.createInputView, { alignItems: 'center', borderBottomColor: 'white' }]}>
                                                <TextInput
                                                    style={[styles.createInputStyle, { paddingLeft: 0 }]}
                                                    placeholder="Enter Address"
                                                    maxLength={100}
                                                    placeholderTextColor='black'
                                                    blurOnSubmit={true}
                                                    onChangeText={(address) => this.setState({ address: !this.state.address ? address.replace(/\s/g, '') : this.removeEmojis(address) })}
                                                    returnKeyType='done'
                                                    onSubmitEditing={this.handleTitleInputSubmit}
                                                    value={this.state.address} />
                                            </View>
                                        </View>

                                        {/* {Platform.OS == 'ios' ? <KeyboardSpacer /> : null} */}


                                        <TouchableOpacity activeOpacity={1} style={[styles.buttonStyle, { marginTop: 30 }]}
                                            onPress={() => this.createProfile()}>
                                            <Text style={styles.buttonTextStyle}>Submit</Text>
                                        </TouchableOpacity>


                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }
}


const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingHorizontal: 5,
        paddingVertical: 8,
        borderRadius: 8,
        color: 'black',
        fontFamily: 'HelveticaNeueLTStd-Lt',
        paddingRight: 30, // to ensure the text is never behind the icon
        width: viewportWidth - 40,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 5,
        paddingVertical: 8,
        paddingLeft: 0,
        borderRadius: 8,
        color: 'black',
        fontFamily: 'HelveticaNeueLTStd-Lt',
        paddingRight: 30, // to ensure the text is never behind the icon
        width: viewportWidth - 40,
    },
});
