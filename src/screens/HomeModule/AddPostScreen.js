import React, { Component, Fragment } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity, TextInput, ScrollView, Alert, Dimensions, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import Toasty from '../../elements/Toasty';
import homeStyle from './homeStyle'
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-action-sheet';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import { check, openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { EventRegister } from 'react-native-event-listeners';
import ApiCaller from '../../constants/ApiCaller';
import { createThumbnail } from "react-native-create-thumbnail";
import RNVideoHelper from 'react-native-video-helper';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

var CAPTURE_BUTTONS = [
    'Select Picture',
    'Select Video',
    'cancel',
];

var CAPTURE_PICTURE = 0;
var CAPTURE_VIDEO = 1;
var CANCEL_CAPTURE = 2;


var IMAGE_BUTTONS = [
    'Capture image',
    'Choose from library...',
    'cancel',
];

var IMAGE_CAMERA_INDEX = 0;
var IMAGE_GALLERY_INDEX = 1;
var IMAGE_CANCEL_INDEX = 2;


var VIDEO_BUTTONS = [
    'Capture Video',
    'Choose from library...',
    'cancel',
];

var VIDEO_CAMERA_INDEX = 0;
var VIDEO_GALLERY_INDEX = 1;
var VIDEO_CANCEL_INDEX = 2;

export default class AddPostScreen extends Component {

    constructor() {
        super()
        this.state = {
            title: '',
            serviceName: '',
            description: '',
            avatarSource: null,
            categoryList: [],
            selectedUsersID: [],
            selectedProductID: [],
            selectedProductsList: [],
            selectedUsersList: [],
            pickerValue: 0,
            videoThumbnail: ''
        };


    }


    componentDidMount() {
        this.getCategoriesApi()
    }




    handleTitleInputSubmit = () => {
        this.setState({ focusInput: true });
    }


    navigateScreen(screen) {
        this.props.navigation.navigate(screen)
    }

    validate() {
        const { title, serviceName, description } = this.state,
            reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (this.state.avatarSource == null && this.state.videoThumbnail == '') {
            Toasty.show('Please add image/video');
            return false
        }
        else if (title.length === 0) {
            Toasty.show('Title field can\'t be empty ');
            return false
        }
        else if (serviceName.length === 0) {
            Toasty.show('Service name field can\'t be empty');
            return false
        }
        else if (description.length === 0) {
            Toasty.show('Description field can\'t be empty');
            return false
        }
        else if (description.length === 0) {
            Toasty.show('Description field can\'t be empty');
            return false
        } else if (this.state.pickerValue === 0) {
            Toasty.show('Please select category');
            return false
        } else {
            return true
        }

    }

    addPost() {
        const { title, serviceName } = this.state;
        if (this.validate()) {
            this.addPostApiCall()
        }
    }

    addPostApiCall() {
        EventRegister.emit('loader', true)

        let formdata = new FormData();
        if (this.state.avatarSource != null) {
            var photo = {
                uri: this.state.imageUri,
                type: this.state.mediaName == 'Image' ? 'image/jpeg' : 'video/mp4',
                name: this.state.mediaName == 'Image' ? 'photo.jpg' : 'video.mp4',
            };
            console.log(photo)
            formdata.append('media', photo)
        }
        else {
            var photo = {
                uri: this.state.imageUri,
                type: 'video/mp4',
                name: 'video.mp4',
            };
            formdata.append('media', photo)
            console.log('photo', photo);
        }


        if (this.state.videoThumbnail != '') {
            var thumb = {
                uri: this.state.videoThumbnail,
                type: 'image/jpeg',
                name: 'photo.jpg',
            };
            formdata.append('video_thumb', thumb)
        }
        console.log(this.state.selectedUsersID)
        formdata.append('title', this.state.title)
        formdata.append('service_name', this.state.serviceName)
        formdata.append('description', (this.state.description))
        formdata.append('tagged_users', JSON.stringify(this.state.selectedUsersID))
        formdata.append('tagged_products', JSON.stringify(this.state.selectedProductID))
        formdata.append('service_category_id', this.state.pickerValue)

        console.log(JSON.stringify(formdata))

        ApiCaller.multipartCall('posts', "POST", (formdata), true)
            .then((response) => {
                EventRegister.emit('loader', false)
                console.log("responseeee", response)
                if (response) {
                    Toasty.show(response.message)
                    this.clearFields()
                    global.myvar = 'Home';
                    this.props.navigation.navigate('HomeScreen', { refresh: 'refresh' })
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })

    }

    clearFields = () => {
        this.setState({
            title: '',
            serviceName: '',
            description: '',
            avatarSource: null,
            categoryList: [],
            selectedUsersID: [],
            selectedProductID: [],
            selectedProductsList: [],
            selectedUsersList: [],
            pickerValue: 0,
            videoThumbnail: ''
        })
    }


    drawerOpen() {

    }

    removeEmojis = (string) => {
        const regex = /\uD83C\uDFF4(?:\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74)\uDB40\uDC7F|\u200D\u2620\uFE0F)|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3]))|\uD83D\uDC69\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83D\uDC69\u200D[\u2695\u2696\u2708])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC68(?:\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])|(?:[#*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDD1-\uDDDD])/g
        return string.replace(regex, '')
    }



    componentWillReceiveProps() {
        StatusBar.setBackgroundColor('#ffffff');
        StatusBar.setBarStyle('dark-content');
    }

    showSelectionSheet = () => {
        ActionSheet.showActionSheetWithOptions({
            title: 'Select Option',
            options: CAPTURE_BUTTONS,
            cancelButtonIndex: CANCEL_CAPTURE,
            chat: CAPTURE_PICTURE,
            tintColor: '#1E50CE',
        },
            (buttonIndex) => {
                this.setState({
                    clicked: this.onPressOpen(buttonIndex),
                });
            });
    };


    onPressOpen = (index) => {

        if (index == 0) {
            ActionSheet.showActionSheetWithOptions({
                title: 'Image Picker',
                options: IMAGE_BUTTONS,
                cancelButtonIndex: IMAGE_CANCEL_INDEX,
                chat: IMAGE_GALLERY_INDEX,
                tintColor: '#1E50CE',
            },
                (buttonIndex) => {
                    this.setState({
                        clicked: this.cameraOpen(buttonIndex),
                    });
                });
        }
        else {
            ActionSheet.showActionSheetWithOptions({
                title: 'Video Picker',
                options: VIDEO_BUTTONS,
                cancelButtonIndex: VIDEO_CANCEL_INDEX,
                chat: VIDEO_GALLERY_INDEX,
                tintColor: '#1E50CE',
            },
                (buttonIndex) => {
                    this.setState({
                        clicked: this.videoOpen(buttonIndex),
                    });
                });
        }
    };

    cameraOpen = (index) => {
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


    initCamera() {
        ImagePicker.openCamera({
            width: 500,
            height: 500,
            cropping: true,
        }).then(response => {
            let source1 = response.path;
            let source = { uri: response.path };
            let sourceType = { uri: response.mime };

            this.setState({
                avatarSource: source,
                imageUri: source1,
                typeMedia: sourceType,
                mediaName: 'Image',
                videoThumbnail: ''

            });
        });
    }

    initPicker() {
        ImagePicker.openPicker({
            width: 500,
            height: 500,
            cropping: true
        }).then(response => {
            console.log('Response = ', response);
            let source1 = response.path;
            let source = { uri: response.path };
            let sourceType = { uri: response.mime };

            this.setState({
                avatarSource: source,
                imageUri: source1,
                typeMedia: sourceType,
                mediaName: 'Image',
                videoThumbnail: ''
            });
        });
    }





    videoOpen = (index) => {
        { this.setState({ defaultAnimationModal: false }); }
        if (index == 0) {
            check(Platform.OS == 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA)
                .then(result => {
                    switch (result) {
                        case RESULTS.DENIED:
                            request(Platform.OS == 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA).then(result => {
                                if (result == 'granted') {
                                    this.initVideoCamera()
                                }
                            })
                            break;
                        case RESULTS.GRANTED:
                            this.initVideoCamera()
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
                                    this.initVideoPicker()
                                }
                            })
                            break;
                        case RESULTS.GRANTED:
                            this.initVideoPicker()
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




    initVideoCamera() {
        ImagePicker.openCamera({
            mediaType: 'video',
        }).then(response => {
            console.log('Response = ', response);
            let source1 = response.path;
            let source = { uri: response.path };
            let sourceType = { uri: response.mime };

            createThumbnail({ url: source1, timeStamp: 10000, })
                .then(response => this.setState({ videoThumbnail: response.path, avatarSource: null }))
                .catch(err => console.log({ err }));

            // RNVideoHelper.compress(source1, {
            //     quality: 'medium', // default low, can be medium or high
            //     defaultOrientation: 0 // By default is 0, some devices not save this property in metadata. Can be between 0 - 360
            // }).progress(value => {
            //     console.warn('progress', value); // Int with progress value from 0 to 1
            // }).then(compressedUri => {
            //     console.warn('compressedUri', compressedUri); // String with path to temporary compressed video


            this.setState({
                imageUri: source1,
                typeMedia: sourceType,
                mediaName: 'Video'
            });

            // });
        });
    }

    initVideoPicker() {
        ImagePicker.openPicker({
            mediaType: "video",
        }).then(response => {
            console.log('Response = ', response);
            let source1 = response.path;
            let source = { uri: response.path };
            let sourceType = { uri: response.mime };

            createThumbnail({ url: source1, timeStamp: 10000, })
                .then(response => this.setState({ videoThumbnail: response.path, avatarSource: null }))
                .catch(err => console.log({ err }));

            this.setState({
                imageUri: source1,
                typeMedia: sourceType,
                mediaName: 'Video'
            });

            // RNVideoHelper.compress(source1, {
            //     quality: 'medium', // default low, can be medium or high
            //     defaultOrientation: 0 // By default is 0, some devices not save this property in metadata. Can be between 0 - 360
            // }).progress(value => {
            //     console.warn('progress', value); // Int with progress value from 0 to 1
            // }).then(compressedUri => {
            //     console.warn('compressedUri', compressedUri); // String with path to temporary compressed video

            // });
        });
    }



    onPressTagUser = () => {
        this.props.navigation.navigate('TagPeopleList', {
            selectedUsersList: this.state.selectedUsersList,
            selectedUsersID: this.state.selectedUsersID,
            onGoBack: this.getUserData,
        });
    }

    getUserData = (data, userslist) => {
        console.log("data", data)
        this.setState({ selectedUsersID: data, selectedUsersList: userslist })
    }

    onPressTagProduct = () => {
        this.props.navigation.navigate('TagProductList', {
            selectedProductsList: this.state.selectedProductsList,
            selectedProductID: this.state.selectedProductID,
            onGoBackPro: this.getProductData,
        });
    }

    getProductData = (data, selectedList) => {
        console.log("dataTagProductList", data)
        this.setState({ selectedProductID: data })
        this.setState({ selectedProductsList: selectedList })
    }



    getCategoriesApi() {
        ApiCaller.call('serviceCategories', "GET", null, true)
            .then((response) => {
                if (response) {
                    console.log("service_categories===>>>>", response)

                    let temp = []
                    response.service_categories.map((item) => temp.push({ label: item.name, value: item.id }))
                    this.setState({ categoryList: temp })

                    // this.setState({categoryList : response.service_categories})
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }



    render() {

        const placeholder = {
            label: 'Select a sport...',
            value: null,
            color: '#9EA0A4',
        };

        return (
            <Fragment>
                {Platform.OS == 'ios' ? <StatusBar barStyle="dark-content" translucent={true} /> : <StatusBar hidden={false} barStyle="dark-content" backgroundColor="white" translucent={false} />}

                <SafeAreaView style={[homeStyle.statusColor]} />
                <SafeAreaView style={homeStyle.bottomColor}>
                    <View style={{ flex: 1 }}>
                        <View style={{ width: '100%', paddingTop: 10, paddingBottom: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ flex: 1, color: 'black', fontSize: 20, textAlign: 'center', fontFamily: 'HelveticaNeueLTStd-Roman', paddingTop: Platform.OS === 'ios' ? 8 : 0, marginRight: 15 }}>Add Post</Text>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                            <View style={[{ flex: 1, padding: 10 }]}>

                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: 10, paddingBottom: 10, marginTop: 5 }}>
                                    <TouchableOpacity onPress={() => this.showSelectionSheet()} activeOpacity={1} style={{ alignItems: 'center', justifyContent: 'center', height: 120, width: 120, borderRadius: 60 }}>

                                        {!this.state.avatarSource && !this.state.videoThumbnail ? <Image style={{ height: 120, width: 120, borderRadius: 60 }} source={require('../../assets/images/photo_video.png')} />
                                            : this.state.avatarSource ?
                                                <Image style={{ height: 120, width: 120, borderRadius: 60 }} source={this.state.avatarSource} />
                                                : <Image style={{ height: 120, width: 120, borderRadius: 60 }} source={{ uri: this.state.videoThumbnail }} />}
                                    </TouchableOpacity>
                                    <View style={{ flex: 1, flexDirection: 'column', padding: 10 }}>
                                        <View style={[homeStyle.editView, { borderBottomColor: '#d9d9d9', borderBottomWidth: 1 }]}>
                                            <Text style={{ fontSize: 12, color: '#BBBBBB', fontFamily: 'HelveticaNeueLTStd-Md', textTransform: 'uppercase' }}>Title</Text>
                                            <TextInput
                                                style={homeStyle.inputStyle}
                                                placeholder="Enter Title"
                                                keyboardType="default"
                                                fontSize={18}
                                                maxLength={30}
                                                blurOnSubmit={true}
                                                placeholderTextColor='black'
                                                onChangeText={(title) => this.setState({ title: !this.state.title ? title.replace(/\s/g, '') : title })}
                                                returnKeyType='next'
                                                onSubmitEditing={() => this.serviceName.focus()}
                                                value={this.state.title} />
                                        </View>


                                        <View style={[homeStyle.editView, { borderBottomColor: '#d9d9d9', borderBottomWidth: 1, marginTop: 10 }]}>
                                            <Text style={{ fontSize: 12, color: '#BBBBBB', fontFamily: 'HelveticaNeueLTStd-Md', textTransform: 'uppercase' }}>Service Name</Text>
                                            <TextInput
                                                style={homeStyle.inputStyle}
                                                placeholder="Enter Service Name"
                                                fontSize={18}
                                                placeholderTextColor='black'
                                                blurOnSubmit={true}
                                                maxLength={30}
                                                onChangeText={serviceName => this.setState({ serviceName: !this.state.serviceName ? serviceName.replace(/\s/g, '') : serviceName })}
                                                returnKeyType='next'
                                                onSubmitEditing={() => this.description.focus()}
                                                ref={(input) => this.serviceName = input}
                                                value={this.state.serviceName} />
                                        </View>
                                    </View>
                                </View>

                                <View style={[homeStyle.editView, { paddingRight: 10 }]}>
                                    <Text style={{ fontSize: 12, color: '#BBBBBB', fontFamily: 'HelveticaNeueLTStd-Md', textTransform: 'uppercase' }}>Description</Text>
                                    <TextInput
                                        style={[homeStyle.inputStyle, { height: 110, textAlignVertical: 'top' }]}
                                        placeholder="Enter Description"
                                        keyboardType="default"
                                        fontSize={18}
                                        blurOnSubmit={true}
                                        multiline={true}
                                        maxLength={200}
                                        placeholderTextColor='black'
                                        onChangeText={(description) => this.setState({ description: !this.state.description ? description.replace(/\s/g, '') : description })}
                                        returnKeyType='done'
                                        ref={(input) => this.description = input}
                                        onSubmitEditing={this.handleTitleInputSubmit}
                                        value={this.state.description} />
                                </View>

                                <View style={[homeStyle.editView, { borderTopColor: '#CBCBCB', borderTopWidth: 1, marginTop: 10, paddingTop: 15 }]}>
                                    <Text style={{
                                        textTransform: 'uppercase',
                                        color: '#B3B2B2',
                                        fontSize: 12,
                                        marginTop: Platform.OS === 'ios' ? 20 : 0,
                                        fontFamily: 'HelveticaNeueLTStd-Lt',
                                    }}>Category</Text>
                                    <View style={[homeStyle.SectionStylepicker]}>
                                        <RNPickerSelect
                                            pickerProps={{ mode: "dropdown" }}

                                            placeholder={placeholder}
                                            style={{
                                                inputAndroid: {
                                                    backgroundColor: 'transparent',
                                                    fontFamily: 'HelveticaNeueLTStd-Lt',
                                                    fontSize: 16
                                                },
                                                iconContainer: {
                                                    top: 5,
                                                    right: 5,
                                                },
                                                fontFamily: 'HelveticaNeueLTStd-Lt'

                                            }}
                                            style={{
                                                ...pickerSelectStyles,
                                                iconContainer: {
                                                    top: Platform == 'ios' ? 0 : 10,
                                                    right: 0,
                                                },
                                            }}
                                            useNativeAndroidPickerStyle={false}
                                            onValueChange={(value) => this.setState({ pickerValue: value })}
                                            placeholder={{ label: 'Select Category', value: 0, placeholderTextColor: 'black', }}
                                            placeholderTextColor={"#0000"}
                                            items={this.state.categoryList}
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



                                <TouchableOpacity activeOpacity={1} style={{ paddingTop: 15, paddingBottom: 15, flexDirection: 'row', borderTopColor: '#d9d9d9', borderTopWidth: 2 }} onPress={() => this.onPressTagUser()}>
                                    <Text style={{ flex: 1, textTransform: 'uppercase', fontFamily: 'HelveticaNeueLTStd-Roman', fontSize: 14, paddingTop: Platform.OS === 'ios' ? 8 : 0 }}>Tag People</Text>
                                    <Image style={{ height: 20, width: 20 }} source={require('../../assets/images/right_arrow.png')} />
                                </TouchableOpacity>

                                <TouchableOpacity activeOpacity={1} style={{ paddingTop: 15, paddingBottom: 15, flexDirection: 'row', borderTopColor: '#d9d9d9', borderTopWidth: 2, borderBottomColor: '#d9d9d9', borderBottomWidth: 2, }} onPress={() => this.onPressTagProduct()}>
                                    <Text style={{ flex: 1, textTransform: 'uppercase', fontFamily: 'HelveticaNeueLTStd-Roman', fontSize: 14, paddingTop: Platform.OS === 'ios' ? 8 : 0 }}>Tag Product</Text>
                                    <Image style={{ height: 20, width: 20 }} source={require('../../assets/images/right_arrow.png')} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => this.addPost()} activeOpacity={1} style={[homeStyle.buttonStyle, { marginTop: 40 }]}>
                                    <Text style={styles.buttonTextStyle}>Post</Text>
                                </TouchableOpacity>

                            </View>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </Fragment >
        )
    }
}
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 4,
        color: 'black',
        width: viewportWidth - 40,
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 8,
        paddingVertical: 10,
        paddingLeft: 0,
        width: viewportWidth - 20,
        borderRadius: 8,
        color: 'black',
        fontFamily: 'HelveticaNeueLTStd-Lt',
    },
});