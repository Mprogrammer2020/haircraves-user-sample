import NetInfo from '@react-native-community/netinfo'
import Toast from 'react-native-simple-toast';
import { baseUrl, AppVersion, iosDevice, androidDevice } from "./common";
import { Platform, AsyncStorage } from 'react-native'
import { EventRegister } from 'react-native-event-listeners'
import Toasty from '../elements/Toasty';
import NavigationService from '../routes/NavigationService';
import Storage from './Storage';

export default ApiCaller = {


    call(endpoint, method, bodyData, hastoken) {
        var header
        NetInfo.fetch()
            .then(res => {
                if (res == false) {
                    Toast.show('Internet not available, Cross check your internet connectivity and try again')
                    return Promise.reject(err)
                }
            })
            .catch(err => {
                console.log(err)
            })

        if (hastoken) {

            header = {
                "Authorization": 'Bearer ' + global.token,
                'app-version': AppVersion,
                'device-type': Platform.OS == 'ios' ? iosDevice : androidDevice,
                // 'Accept': 'application/json',
                'Content-Type': 'application/json',
                'device_id': global.fcmTokennnn


            }
        }
        else {
            header = {
                'app-version': AppVersion,
                'device-type': Platform.OS == 'ios' ? iosDevice : androidDevice,
                'Content-Type': 'application/json',
                'device_id': global.fcmTokennnn
            }
        }

        console.log("base_URL", baseUrl + endpoint)
        console.log("header", header)
        console.log("bodyData", bodyData)

        return fetch(baseUrl + endpoint, {
            method: method,
            body: bodyData,
            headers: header,
        })
            .then((response) => {
                console.log("response==>>>>", response)

                if (response.status === 401) {
                    global.token = ''
                    Storage.clear()
                    NavigationService.navigate('Login')
                    // return response.json();

                    response.json().then((response) => {
                        console.log("Serrion Expired =======>>>>>>>>", response)
                        if (response.err) {
                            setTimeout(() => { Toasty.show(response.err) }, 500)
                        }
                    })
                }
                else if (response.status == 200) {
                    return response.json()
                } else {
                    response.json().then((response) => {
                        console.log("Error=======>>>>>>>>", response)
                        if (response.message) {
                            setTimeout(() => { Toasty.show(response.message) }, 500)
                        }
                        else {
                            Toast.show("Something went wrong.");
                        }
                    })
                }
            })
            .then((response) => {

                return response
            })
            .catch((error) => {
                EventRegister.emit('loader', false)
                console.log('Error-->' + error);
            });

    },


    multipartCall(url, method, bodyData) {
        var urlIs = baseUrl + url

        var header = {
            'Accept': "application/json",
            // "Content-Type": "multipart/form-data",
            'app-version': AppVersion,
            'device-type': Platform.OS == 'ios' ? iosDevice : androidDevice,
            "Authorization": 'Bearer ' + global.token,
            'device_id': global.fcmTokennnn


        }
        console.log("urlIs", urlIs)
        console.log("MultipartBody", bodyData)
        console.log("MultipartHeader", header)

        return fetch(urlIs, {
            method: method,
            body: bodyData,
            headers: header,
        })
            .then((response) => {
                console.log("response==>>>>", response)

                if (response.status === 401) {
                    global.token = ''
                    Storage.clear()
                    NavigationService.navigate('Login')
                    // return response.json();

                    response.json().then((response) => {
                        console.log("Session Expired =======>>>>>>>>", response)
                        if (response.err) {
                            setTimeout(() => { Toasty.show(response.err) }, 500)
                        }
                    })
                }
                else if (response.status == 200) {
                    return response.json()
                } else {
                    response.json().then((response) => {
                        console.log("Error=======>>>>>>>>", response)
                        if (response.message) {
                            setTimeout(() => { Toasty.show(response.message) }, 500)
                        }
                        else {
                            Toast.show("Something went wrong.");
                        }
                    })
                }
            })


            .then((response) => {
                return response
            })
            .catch((error) => {
                EventRegister.emit('loader', false)
                console.log('Error-->' + error);
            });
    },

}











// .then((response) => {

//     console.log("response==>>>>", response)


//     if (response.status === 200) {
//         return response.json();
//     } else if (response.status === 401) {
//         EventRegister.emit('navigate', 'LaunchScreen')
//         return response.json();
//     }
//     else if (response.status === 406) {
//         return response.json();
//     }
//     else if (response.status === 400) {
//         return response.json();
//     }
// })