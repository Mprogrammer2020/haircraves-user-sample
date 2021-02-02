import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
import AppNavigator from './src/routes/AppNavigator';
import NavigationService from './src/routes/NavigationService';
import { EventRegister } from 'react-native-event-listeners';
import Loader from './src/elements/Loader';


export default class App extends Component {

  constructor() {
    super()
    this.state = {
      loader: false
    }
  }

  componentDidMount() {
    this.listener = EventRegister.addEventListener('loader', (isLoading) => {
      this.setState({
        loader: isLoading
      })
    })
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {Platform.OS == 'ios' ? <StatusBar barStyle="dark-content" translucent={true} /> : <StatusBar hidden={false} barStyle="dark-content" backgroundColor="white" translucent={false} />}
        <Loader visible={this.state.loader} />
        <AppNavigator
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </View>
    )
  }
}
