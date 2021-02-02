import React, { Component, Fragment } from 'react';
import { View, ToastAndroid, Dimensions, Animated, Image, Text, TouchableOpacity, TextInput, ScrollView, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import styles from './styles'
import Toasty from '../../elements/Toasty';
import Modal from 'react-native-modal';
import ApiCaller from '../../constants/ApiCaller';
import { LoginManager, AccessToken, GraphRequestManager, GraphRequest } from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import Storage from '../../constants/Storage';
import { EventRegister } from 'react-native-event-listeners'

let { width, height } = Dimensions.get('window');
export default class Login extends Component {

    constructor(props) {
        super(props);
        this.springValue = new Animated.Value(100);
        this.state = { backClickCount: 0, email: '', password: '', forgotEmail: '', modalVisible: false, focusInput: false, loader: false };
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
                BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));
            }
        );
        setTimeout(() => { this.googleID() }, 2000)
    }

    googleID() {
        GoogleSignin.configure({
            scopes: [],
            webClientId: '606447443669-sh7qkt6n6auqccrvav3cg3qgghf92aq2.apps.googleusercontent.com',
            iosClientId: '606447443669-afm6aols3avej3qqpa8vv2b95obabv2c.apps.googleusercontent.com',
            offlineAccess: false,
            hostedDomain: '',
            loginHint: '',
            forceConsentPrompt: true,
            accountName: ''
        });
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


    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    handleTitleInputSubmit = () => {
        this.setState({ focusInput: true });
    }

    initialState() {
        return {
            focusInput: true,
        };
    }


    validate() {
        const { email, password } = this.state,
            reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (email.length === 0) {
            Toasty.show('Email address field can\'t be empty');
            return false
        }
        else if (reg.test(email) === false) {
            Toasty.show('Entered email address is not valid');
            return false
        }
        else if (password.length === 0) {
            Toasty.show('Password field can\'t be empty');
            return false
        }
        else {
            return true
        }
    }

    logIn() {
        const { email, password } = this.state;
        // global.myvar = 'Home'
        // this.props.navigation.navigate('MapScreen')
        // this.props.navigation.navigate('CreateProfile')

        if (this.validate()) {
            this.loginApiCall()
        }
    }



    clearFields = () => {
        this.setState({ email: '', password: '' })
    }

    onPressCall(screen) {
        this.props.navigation.navigate(screen)
    }


    socialLogin(socialEmail, social_id, type, first_name, last_name, photo) {

        var data;
        var socialApi;

        socialApi = type == 'G' ? 'users/googleLogin/' : 'users/facebookLogin/';

        if (type == 'G') {
            data = JSON.stringify({
                "email": socialEmail,
                "gplus_id ": social_id,
            })
        }
        else {
            data = JSON.stringify({
                "email": socialEmail,
                "fb_id ": social_id,
            })
        }

        EventRegister.emit('loader', true)
        ApiCaller.call(socialApi, 'POST', data, false)
            .then((response) => {
                EventRegister.emit('loader', false)
                if (response) {
                    console.log("google==>>>", response)
                    Storage.set('loginData', JSON.stringify(response)).then(res => {

                        console.log('loginResponse', response.user.status == 2);

                        if (response.user.status == 0) {
                            global.token = response.accesstoken
                            this.props.navigation.navigate('CreateProfile', { firstName: first_name, lastName: last_name, profilePic: photo })
                        }
                        else if (response.user.status == 1) {
                            global.token = response.accesstoken
                            this.props.navigation.navigate('PaymentDetail')
                        }
                        else {
                            global.token = response.accesstoken
                            Toasty.show(response.message)
                            global.myvar = 'Home'
                            this.props.navigation.navigate('DrawerNavigator')
                        }

                    })
                }
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }


    fbLogin() {
        let env = this;
        LoginManager.logInWithPermissions(["public_profile", 'email']).then(
            function (result) {
                if (result.isCancelled) {
                    console.log("Login cancelled");
                }
                else {
                    console.log('Login success with permissions: ' + result.grantedPermissions.toString());
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            console.log("facebokkkk token", data)
                            let accessToken = data.accessToken;
                            const responseInfoCallback = (error, result) => {
                                if (error) {
                                    alert('Error fetching data: ' + error.toString());
                                }
                                else {
                                    console.log('Facebook Login Response', result)

                                    console.log('Facebook Login Response', result.picture.data.url)

                                    env.socialLogin(result.email, result.id, 'F', result.first_name, result.last_name, result.picture.data.url);
                                }
                            }
                            const infoRequest = new GraphRequest('/me', {
                                accessToken: accessToken,
                                parameters: {
                                    fields: {
                                        string: 'email,name,first_name,middle_name,last_name,id,picture.type(large)'
                                    }
                                }
                            },
                                responseInfoCallback);
                            new GraphRequestManager().addRequest(infoRequest).start();
                        })
                }
            },
            function (error) {
                console.log("Login fail with error: " + error);
            }
        );

    }



    googleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            });
            const userInfo = await GoogleSignin.signIn();
            console.log('----------->' + JSON.stringify(userInfo))
            // console.log('----------->' + JSON.stringify(userInfo.idToken))

            // this.socialLogin('users/googleLogin/', userInfo.idToken);
            this.socialLogin(userInfo.user.email, userInfo.user.id, 'G', userInfo.user.givenName, userInfo.user.familyName, userInfo.user.photo);

        } catch (error) {
            console.log("google", error.code)
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('User cancelled login');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log(('Signing in'));
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                alert(('Play service not avaiable'));
            } else {
                console.log(error)
                alert(error.message);
            }
        }
    };




    verifyOK() {
        this.setState({ modalVisible: false });
    }


    removeEmojis = (string) => {
        const regex = /\uD83C\uDFF4(?:\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74)\uDB40\uDC7F|\u200D\u2620\uFE0F)|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3]))|\uD83D\uDC69\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83D\uDC69\u200D[\u2695\u2696\u2708])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC68(?:\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])|(?:[#*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDD1-\uDDDD])/g
        return string.replace(regex, '')
    }



    loginApiCall() {

        var data = JSON.stringify({
            "email": this.state.email,
            "password": this.state.password,
            "role": '0',
        })

        EventRegister.emit('loader', true)

        ApiCaller.call('users/login', "POST", data, false)
            .then((response) => {
                console.log(response)

                EventRegister.emit('loader', false)
                if (response) {

                    Storage.set('loginData', JSON.stringify(response)).then(res => {
                        // console.log('loginResponse', response.user.access_token);
                        // console.log('loginResponse', response.user.status == 2);

                        if (response.user.status == 0) {
                            global.token = response.user.access_token
                            this.props.navigation.navigate('CreateProfile', { firstName: '', lastName: '', profilePic: '' })
                        }
                        else if (response.user.status == 1) {
                            global.token = response.user.access_token
                            this.props.navigation.navigate('PaymentDetail')
                        }
                        else {
                            global.token = response.user.access_token
                            Toasty.show(response.message)
                            global.myvar = 'Home'
                            this.props.navigation.navigate('DrawerNavigator')
                        }

                    })

                    this.clearFields()

                }

            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })
    }



    render() {
        return (
            <Fragment>
                {Platform.OS == 'ios' ? <StatusBar barStyle="dark-content" translucent={true} /> : <StatusBar hidden={false} barStyle="dark-content" backgroundColor="white" translucent={false} />}

                <SafeAreaView style={[styles.statusColor]} />
                <SafeAreaView style={styles.bottomColor}>
                    <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'none'}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={[{ flex: 1 }]}>

                                <View style={[styles.viewStyle]}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Image style={styles.appIcon} source={require('../../assets/images/logo_screens.png')} />
                                        <Text style={[styles.welcomeText]}>Discover and Book Your Favorite Products and Services.</Text>
                                    </View>

                                    <View style={[styles.editView]}>
                                        <Text style={styles.editText}>Email Address</Text>
                                        <TextInput
                                            style={styles.inputStyle}
                                            placeholder="Enter Email Address"
                                            keyboardType="email-address"
                                            fontSize={16}
                                            maxLength={40}
                                            blurOnSubmit={true}
                                            placeholderTextColor='black'
                                            onChangeText={(email) => this.setState({ email: this.removeEmojis(email.replace(/\s/g, '')) })}
                                            returnKeyType='next'
                                            onSubmitEditing={() => this.password.focus()}
                                            value={this.state.email} />
                                    </View>


                                    <View style={[styles.editView, { marginTop: 20 }]}>
                                        <Text style={styles.editText}>Password</Text>
                                        <TextInput
                                            style={styles.inputStyle}
                                            placeholder="Enter password"
                                            secureTextEntry={true}
                                            maxLength={30}
                                            placeholderTextColor='black'
                                            blurOnSubmit={true}
                                            onChangeText={value => this.setState({ password: this.removeEmojis(value.replace(/\s/g, '')) })}
                                            returnKeyType='done'
                                            onSubmitEditing={this.handleTitleInputSubmit}
                                            ref={(input) => this.password = input}
                                            value={this.state.password} />
                                    </View>


                                    <TouchableOpacity activeOpacity={0.9} style={{ alignSelf: 'center', marginTop: 25 }}
                                        onPress={() => { this.onPressCall('ForgotPassword'); }}>
                                        <Text style={styles.forgotText}>Forgot Password?</Text>
                                    </TouchableOpacity>


                                    <TouchableOpacity activeOpacity={0.9} style={[styles.buttonStyle, { marginTop: 25 }]}
                                        onPress={() => this.logIn()}>
                                        <Text style={styles.buttonTextStyle}>Sign In</Text>
                                    </TouchableOpacity>


                                    <View style={styles.orMainView}>
                                        <View style={styles.orFirst}></View>
                                        <Text style={[styles.orText, { marginTop: Platform.OS == 'ios' ? 10 : 0 }]}> or </Text>
                                        <View style={styles.orSecond}></View>
                                    </View>


                                    <View style={styles.sociaiconsView}>
                                        <TouchableOpacity activeOpacity={0.9} style={[styles.buttonStyle, { backgroundColor: '#3D5B95' }]}
                                            onPress={() => this.fbLogin()}>
                                            <Text style={styles.buttonTextStyle}>Sign In with Facebook</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity activeOpacity={0.9} style={[styles.buttonStyle, { backgroundColor: '#D4493D' }]}
                                            onPress={() => this.googleLogin()}>
                                            <Text style={styles.buttonTextStyle}>Sign In with Google</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                            <Text style={[styles.signUp, { textAlign: 'center', paddingBottom: 10 }]}>Don't have an account? <Text onPress={() => this.onPressCall('SignUp')} style={[styles.signUp, { fontFamily: 'HelveticaNeueLTStd-Md' }]}>Sign Up</Text></Text>

                        </ScrollView>
                    </KeyboardAvoidingView>
                    <Modal
                        isVisible={this.state.modalVisible === 'slow'}
                        animationInTiming={1000}
                        animationOutTiming={1000}
                        backdropTransitionInTiming={800}
                        backdropTransitionOutTiming={800}>

                        <View style={{ height: 'auto', borderRadius: 20, backgroundColor: 'white', alignItems: 'center', marginLeft: 25, marginRight: 25 }}>

                            <Image style={[styles.appIcon, { marginTop: 20, height: 80 }]} source={require('../../assets/images/email_not.png')} />

                            <Text style={[styles.popText, { marginTop: 10 }]}>Email not verified.</Text>
                            <Text style={styles.popText}>Kindly verify your account.</Text>

                            <TouchableOpacity activeOpacity={1} style={[styles.buttonStyle, { width: 250, marginTop: 20, marginBottom: 25 }]}
                                onPress={() => this.verifyOK()}>
                                <Text style={styles.buttonTextStyle}>Okay</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </SafeAreaView>
            </Fragment>
        )
    }
}

