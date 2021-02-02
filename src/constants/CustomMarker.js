import React from 'react';
import { StyleSheet, Image } from 'react-native';

class CustomMarker extends React.Component {
  render() {
    return (
      <Image
        style={[styles.image,{resizeMode:'contain'}]}
        source={ this.props.pressed ? require('../assets/images/roundcircle.png') : require('../assets/images/roundcircle.png')}
        resizeMode="contain"
      />
    );
  }
}

const styles = StyleSheet.create({
  image: {
    height: 30,
    width: 30,
  },
});

export default CustomMarker;