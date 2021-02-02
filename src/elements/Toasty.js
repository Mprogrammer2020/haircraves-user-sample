import SimpleToast from "react-native-simple-toast";

export default Toasty = {
    show(message, timeout = 500) {
        setTimeout(() => {
            SimpleToast.show(message)
        }, timeout)
    }
}