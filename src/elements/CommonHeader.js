import React from 'react';
import { View, Image, Text, TouchableOpacity, Platform } from 'react-native';


export default class CommonHeader extends React.Component {
    render() {
        return (
            <View style={{ width: '100%', paddingTop : 10 , paddingBottom :10 , paddingLeft :5, paddingRight : 5, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity  activeOpacity={0.9}
                    onPress={this.props.action}>
                    <Image style={{ width: 30, height: 30, resizeMode: 'contain'}} source={this.props.drawable} />
                </TouchableOpacity>

                <Text style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 8:0,  color: 'black', fontSize: 20, textAlign: 'center', fontFamily: 'HelveticaNeueLTStd-Roman'}}>{this.props.title}</Text>

                <TouchableOpacity activeOpacity={0.9}
                    onPress={this.props.action2}>
                    <Text style={{ color: 'black', fontSize: 16, fontFamily: 'HelveticaNeueLTStd-Lt'}}>{this.props.title1}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}