import moment from 'moment';
import { firestore, database } from 'react-native-firebase';

const employeesRef = database().ref('/customers')
const usersCollection = firestore().collection('customers');

export default ChatHelper = {
    sendMessage: function (chatRoomId, userId, data, user, sellerDetails) {
        return database().ref(`/customers/${userId}/myChatrooms/${chatRoomId}/messages`).push().set(data).then(() => {
            return database().ref(`/customers/${userId}/myChatrooms/${chatRoomId}`).update({
                lastMessage: data,
                chatRoomId: chatRoomId,
                customerDetails: {
                    name: user.name,
                    image: user.image,
                    id: userId
                },
                sellerDetails: sellerDetails
            }).then(() => {
                return database().ref(`/sellers/${sellerDetails.id}/myChatrooms/${chatRoomId}`).update({
                    lastMessage: data,
                    chatRoomId: chatRoomId,
                    customerDetails: {
                        name: user.name,
                        image: user.image,
                        id: userId
                    },
                    sellerDetails: sellerDetails
                }).then(() => {
                    return database().ref(`/sellers/${sellerDetails.id}/myChatrooms/${chatRoomId}/messages`).push().set(data).then(() => {
                        database().ref(`/sellers/${sellerDetails.id}/myChatrooms/${chatRoomId}/unreadCount`).transaction(function (unreadCount) {
                            return unreadCount = unreadCount + 1
                        })
                        return true
                    })
                })
            })
        })
    },
    clearUnread: function (userId, chatRoomId) {
        return database().ref(`/customers/${userId}/myChatrooms/${chatRoomId}/unreadCount`).transaction(function (unreadCount) {
            return unreadCount = 0
        })
    },
    setLastSeen: function (userId) {
        return database().ref(`/customers/${userId}`).update({ lastSeen: moment().format() }).then(res => {
            console.log(res)
            return true
        }).catch(err => {
            console.log(err)
            return false
        })
    },
    getSellerDetails: function (userId, employerId) {
        const chatRoomId = `${userId}-${employerId}`
        return database().ref(`/customers/${userId}/myChatrooms/${chatRoomId}/sellerDetails`).once('value').then(res => {
            return res.val()
        })
    },
    setOnline: function (userId, employerId, chatRoomId, isOnline) {
        // return database().ref(`/employees/${userId}/myChatrooms/${chatRoomId}/employeeDetails`).update({ isOnline: isOnline }).then(res => {
        return database().ref(`/customers/${userId}/myChatrooms/${chatRoomId}/customerDetails`).update({ isOnline: isOnline }).then(res => {
            console.log(res)
            return database().ref(`/sellers/${employerId}/myChatrooms/${chatRoomId}/customerDetails`).update({ isOnline: isOnline })
        }).catch(err => {
            console.log(err)
            return false
        })
    },
    listenerOnBlock: function (userId, employerId) {
        const chatRoomId = `${userId}-${employerId}`
        return database().ref(`/customers/${userId}/myChatrooms/${chatRoomId}`)
    },
    blockEmployer: function (userId, employerId, blockStatus) {
        const chatRoomId = `${userId}-${employerId}`
        return database().ref(`/customers/${userId}/myChatrooms/${chatRoomId}`).update({ isBlocked: blockStatus, blockedBy: 'customer' }).then(res => {
            console.log(res)
            return database().ref(`/sellers/${employerId}/myChatrooms/${chatRoomId}`).update({ isBlocked: blockStatus, blockedBy: 'customer' })
        }).catch(err => {
            console.log(err)
            return false
        })
    },
    
    statusListener: function (employerId) {
        return database().ref(`/customers/${employerId}`)
    },
    listenerOnChatroom: function (userId, chatRoomId) {
        return database().ref(`/customers/${userId}/myChatrooms/${chatRoomId}/messages`)
    },
    listenerOnRoom: function () {
        return database().ref(`/rooms`)
    },

    listenerOnMyChatrooms: function (id) {
        return database().ref(`/customers/${id}/myChatrooms`)
    },

    deleteChat: function (userId, chatRoomId) {
        return database().ref(`/customers/${userId}/myChatrooms/${chatRoomId}`).remove().then(value => {
            console.log(value)
            return true
        }).catch(err => {
            console.log(err)
            return false
        })
    },
    checkChatRoom: function (id) {
        return database().ref(`/chatrooms/${id}`).once('value').then(val => {
            if (val.exists()) {
                return true;
            } else {
                return false;
            }
        })
    },
    createChatRoom: function (id, data) {
        return database().ref(`/chatrooms/${id}`).set({
            employeeName: data.name
        }).then(val => {
            return true;
        }).catch(err => {
            console.log(err)
            return false;
        })
    },
    addUser: function (data) {
        return database().ref(`/customers/${data.id}`).set({
            id: data.id,
            image: data.image,
            name: data.name,
            email: data.email,
            myChatrooms: []
        }).then((res) => {
            console.log(res)
        }).catch(err => console.log(err))
    },
    checkUser: function (id) {
        return database().ref(`/customers/${id}`).once('value').then(doc => {
            if (doc.exists()) {
                return true
            } else {
                return false
            }
        }).catch(err => console.log(err))
    }
}