import React, { Component } from 'react';

import { StackNavigator } from 'react-navigation';
import App from './App';
import SelectPhotos from './SelectPhotos';
import Camera from './Camera';
import CameraPreview from './CameraPreview'

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
    },
    CameraPreview: {
      screen: CameraPreview
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
