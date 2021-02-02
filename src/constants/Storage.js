import { AsyncStorage } from 'react-native'

export default Storage = {

    set: async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log(error)
        }
    },

    get: function (key) {
        return AsyncStorage.getItem(key, function (err, value) {
            console.log("get from storage =======>>>>>>>>", value)
            return value
        })
    },
    clear: async () => {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.log(error)
        }
    }
}


