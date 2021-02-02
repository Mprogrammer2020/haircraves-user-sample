import { storage } from "react-native-firebase";

export default StorageHelper = {
    uploadFile: function (path, userId, name) {
        const reference = storage().ref(`${userId}/${name}`);
        let task = reference.putFile(path)
        task.on('state_changed', taskSnapshot => {
            console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
        })
        return task.then(res => {
            console.log(res.bytesTransferred)
            return reference.getDownloadURL().then(url => {
                return url
            })
        })
    },
    uploadBlob: function (doc, userId, name) {
        const reference = storage().ref(`${userId}/${name}`);
        let task = reference.put(doc, { cacheControl: 'no-cache' })
        task.on('state_changed', taskSnapshot => {
            console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
        })
        return task.then(res => {
            console.log(res.bytesTransferred)
            return reference.getDownloadURL().then(url => {
                return url
            })
        })
    }
}