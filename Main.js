import React, { Component } from 'react';

import { StackNavigator } from 'react-navigation';
import App from './App';
import SelectPhotos from './SelectPhotos';
import Camera from './Camera';

const RootStack = StackNavigator(
  {
    App: {
      screen: App,
    },
    SelectPhotos: {
      screen: SelectPhotos
    },
    Camera: {
      screen: Camera
    }
  },
  {
    initialRouteName: 'App',
  }
);


export default class Main extends Component {
  render() {
    return <RootStack />
  }
}
