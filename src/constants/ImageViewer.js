import React, { useRef, useState, useEffect } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import ReactNativeModal from 'react-native-modal';

export function ImageViewer(isVisible, imageUrl, onBackButtonPress) {

    return <ReactNativeModal isVisible={isVisible}
        useNativeDriver={true}
        onBackButtonPress={onBackButtonPress}
        // backdropColor={colors.appBlue}
        // backdropOpacity={0.9}
        >
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={onBackButtonPress}>
                <Image style={{ height: 30, width: 30, marginVertical: 10, marginStart: 10, resizeMode: 'contain' }} source={require('../assets/images/crossblacknew.png')} />
            </TouchableOpacity>
            <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%', resizeMode: 'contain', flex: 1 }} />
        </View>
    </ReactNativeModal>
}