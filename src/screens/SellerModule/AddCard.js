import React, { Component, Fragment } from 'react';
import { View, ImageBackground, Image, Text, TouchableOpacity, TextInput, ScrollView, Modal, BackHandler, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import styles from './../SignUpModule/styles'
import Toasty from '../../elements/Toasty';
import { handleAndroidBackButton, removeAndroidBackButtonHandler } from '../../routes/Backer';
import CommonHeader from '../../elements/CommonHeader';
import { EventRegister } from 'react-native-event-listeners';
import ApiCaller from '../../constants/ApiCaller';


export default class AddCard extends Component {

    constructor() {
        super()
        this.state = {
            email: '',
            holderName: '',
            cardNumber: '',
            expiryData: '',
            cvvNumber: '',
            modalVisible: false,
            focusInput: false,
            loader: false,
            cardBacColor: '#4CC9CA',
            cardTextColor: 'white',
            payBacColor: '#DCDADA',
            payTextColor: '#6C6A6A',
            value1: 'CardPayment',
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
                handleAndroidBackButton(() => this.props.navigation.goBack())
            }
        );
    }


    componentWillUnmount() {
        removeAndroidBackButtonHandler();
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
        const { holderName, cardNumber, expiryData, cvvNumber } = this.state
        let regx = /[- #*;,.<>]/;

        if (cardNumber.length === 0) {
            Toasty.show('Card Number field can\'t be empty');
            return false
        }
        // else if (regx.test(cardNumber) === true) {
        //     Toasty.show('Please enter valid card number');
        // }
        else if (holderName.length === 0) {
            Toasty.show('Card holder field can\'t be empty');
            return false
        }
        else if (expiryData.length === 0) {
            Toasty.show('Expiry Date field can\'t be empty');
            return false
        }
        else if (regx.test(expiryData) === true) {
            Toasty.show('Please enter the valid expiry date');
            return false
        }
        else if (cvvNumber.length === 0) {
            Toasty.show('Please enter cvv number');
            return false
        }

        else {

            return true
        }
    }

    addCard() {
        if (this.validate()) {
            this.addCardApiCall()
            //    this.props.navigation.goBack();
        }
    }

    addCardApiCall() {

        var submitCardNumber = this.state.cardNumber.replace(/\s/g, '');
        var monthStr = this.state.expiryData.substring(0, 2);
        var yearStr = this.state.expiryData.substring(3, 5);

        var data = JSON.stringify({
            "card_holder_name": this.state.holderName,
            "number": submitCardNumber,
            "exp_month": monthStr,
            "exp_year": yearStr,
            "cvv": this.state.cvvNumber
        })

        console.log(data)

        EventRegister.emit('loader', true)

        ApiCaller.call('cards', "POST", data, true)
            .then((response) => {
                EventRegister.emit('loader', false)

                console.log("cards", response)

                if (response) {
                    this.props.navigation.goBack();
                }
                this.clearFields()
            })
            .catch((error) => {
                console.log("ErrorLogin", error);
            })


    }

    clearFields = () => {
        this.setState({ email: '', holderName: '', cardNumber: '', expiryData: '', cvvNumber: '' })
    }



    clear = () => {
        this.textInputRef.clear();
    }

    handleCardNumber = (cardNumber) => {
        let formattedText = cardNumber.split(' ').join('');
        if (formattedText.length > 0) {
            formattedText = formattedText.match(new RegExp('.{1,4}', 'g')).join(' ');
        }
        this.setState({ cardNumber: formattedText});
        return formattedText;
    }

    handleChange = (expiryData) => {
        console.log("hellooooo", expiryData)
        let textTemp = expiryData.charAt(expiryData.length - 1);
        let currenText = expiryData;
        if (expiryData.length > this.state.expiryData.length) {
            if (this.state.expiryData.length < 5) {
                if (currenText.length == 1 && textTemp[0] !== '1' && textTemp[0] !== '0') {
                    textTemp = '0' + textTemp + '/';
                }
                else if (currenText.length === 2) {
                    if (parseInt(textTemp.substring(0, 2)) > 12) {
                        textTemp = textTemp[0];
                    } else if (this.state.expiryData.length === 1) {
                        textTemp = currenText + '/';
                    } else {
                        textTemp = textTemp[0];
                    }
                }
                else {
                    textTemp = currenText;
                }
                this.setState({ expiryData: textTemp })
            }
        }
        else {
            this.state.expiryData[this.state.expiryData.length - 1] == '/' ?
                textTemp = this.state.expiryData.substring(0, this.state.expiryData.length - 2)
                :
                textTemp = this.state.expiryData.substring(0, this.state.expiryData.length - 1)
            this.setState({ expiryData: textTemp })
        }
    }

    onClickHomePlace() {
        this.setState({
            cardBacColor: '#4CC9CA',
            cardTextColor: 'white',
            payBacColor: '#DCDADA',
            payTextColor: '#6C6A6A',
            value1: 'CardPayment',
        })
    }

    onClickPromotions() {
        this.setState({
            cardBacColor: '#DCDADA',
            cardTextColor: '#6C6A6A',
            payBacColor: '#4CC9CA',
            payTextColor: 'white',
            value1: 'PayPal',
        })
    }

    validatePay() {
        const { email } = this.state,
            reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (email.length === 0) {
            Toasty.show('Email field can\'t be empty');
            return false
        }
        else if (reg.test(email) === false) {
            Toasty.show(' Entered email is not valid');
            return false
        } else {
            return true
        }
    }

    payPal() {
        if (this.validatePay()) {

        }
    }



    removeEmojis = (string) => {
        const regex = /\uD83C\uDFF4(?:\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74)\uDB40\uDC7F|\u200D\u2620\uFE0F)|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3]))|\uD83D\uDC69\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83D\uDC69\u200D[\u2695\u2696\u2708])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC68(?:\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])|(?:[#*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDD1-\uDDDD])/g
        return string.replace(regex, '')
    }



    render() {
        return (
            <Fragment>

                <SafeAreaView style={[styles.statusColor]} />
                <SafeAreaView style={styles.bottomColor}>

                    <View>
                        <CommonHeader
                            drawable={require('../../assets/images/back_arrow.png')}
                            action={() => this.props.navigation.goBack()}
                            title='Add Card'
                            title1='' />

                        <ScrollView style={{ width: '100%', height: '100%' }} showsVerticalScrollIndicator={false}>
                            <View style={[{ width: '100%', height: '100%', marginBottom: 80 }]}>

                                <View style={[styles.viewStyle, { marginTop: 20 }]}>

                                    <View style={{ width: '100%', height: '100%' }}>
                                        <View style={{ flex: 1 }}>
                                            <View style={[styles.editView]}>
                                                <Text style={styles.editText}>Card Number</Text>
                                                <TextInput
                                                    style={styles.inputStyle}
                                                    placeholder="Enter Card Number"
                                                    keyboardType={"numeric"}
                                                    maxLength={19}
                                                    fontSize={16}
                                                    placeholderTextColor={'black'}
                                                    blurOnSubmit={true}
                                                    onChangeText={this.handleCardNumber}
                                                    returnKeyType='next'
                                                    onSubmitEditing={this.handleTitleInputSubmit}
                                                    value={this.state.cardNumber}
                                                    onSubmitEditing={() => this.cardNumber.focus()} />

                                            </View>


                                            <View style={[styles.editView, { marginTop: 10 }]}>
                                                <Text style={styles.editText}>Card Holder Name</Text>
                                                <TextInput
                                                    style={styles.inputStyle}
                                                    placeholder="Enter Card Holder Name"
                                                    maxLength={30}
                                                    fontSize={16}
                                                    placeholderTextColor={'black'}
                                                    blurOnSubmit={true}
                                                    onChangeText={(holderName) => this.setState({ holderName: !this.state.holderName ? holderName.replace(/\s/g, '') : this.removeEmojis(holderName) })}
                                                    returnKeyType='next'
                                                    value={this.state.holderName}
                                                    ref={(input) => this.cardNumber = input}
                                                    onSubmitEditing={() => this.expiryData.focus()} />
                                            </View>

                                            <View style={[styles.editView, { marginTop: 10 }]}>
                                                <Text style={styles.editText}>Expiry Date</Text>
                                                <TextInput
                                                    style={styles.inputStyle}
                                                    placeholder="Enter Expiry Date (MM/YY)"
                                                    fontSize={16}
                                                    blurOnSubmit={true}
                                                    returnKeyType='next'
                                                    keyboardType={'numeric'}
                                                    value={this.state.expiryData}
                                                    maxLength={5}
                                                    placeholderTextColor={'black'}
                                                    onChangeText={this.handleChange}
                                                    ref={(input) => this.expiryData = input}
                                                    onSubmitEditing={() => this.cvvNumber.focus()} />

                                            </View>

                                            <View style={[styles.editView, { marginTop: 10 }]}>
                                                <Text style={styles.editText}>Cvv Number</Text>
                                                <TextInput
                                                    style={styles.inputStyle}
                                                    placeholder="Enter cvv number"
                                                    fontSize={16}
                                                    secureTextEntry={true}
                                                    blurOnSubmit={true}
                                                    returnKeyType='done'
                                                    keyboardType={'numeric'}
                                                    value={this.state.cvvNumber}
                                                    maxLength={3}
                                                    placeholderTextColor={'black'}
                                                    onChangeText={(cvvNumber) => this.setState({ cvvNumber: !this.state.cvvNumber ? cvvNumber.replace(/\s/g, '') : this.removeEmojis(cvvNumber) })}
                                                    ref={(input) => this.cvvNumber = input}
                                                    onSubmitEditing={this.handleTitleInputSubmit} />
                                            </View>


                                            <TouchableOpacity activeOpacity={1} style={[styles.buttonStyle, { width: '90%', alignSelf: 'center', alignItems: 'center', marginTop: 30 }]}
                                                onPress={() => this.addCard()}>
                                                <Text style={styles.buttonTextStyle}>Submit</Text>
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </Fragment>
        )
    }
}