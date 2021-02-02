import React, { Component } from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';

class Loader extends Component {

    render() {
        return (
            <Modal
                transparent={true}
                animationType='fade'
                visible={this.props.visible}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor :'rgba(52, 52, 52, 0.8)'}}> 
                    <ActivityIndicator
                        size='large'
                        color={'#4CC9CA'}
                    />
                </View>
            </Modal>
        )
    }
}

export default Loader