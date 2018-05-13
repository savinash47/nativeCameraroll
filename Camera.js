'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Icon } from 'native-base';

export default class Camera extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null
  });

  constructor(props) {
    super(props);
    let selected = false;
    this.state = {
      flashMode: RNCamera.Constants.FlashMode.auto,
      flash: 'auto',
      showFlashOptions: false,
      type: RNCamera.Constants.Type.back
    }
    this.goBack = this.goBack.bind(this);
    this.selectFlashMode = this.selectFlashMode.bind(this);
    this.showFlashOptionsBlock = this.showFlashOptionsBlock.bind(this);
    this.switchCamera = this.switchCamera.bind(this);
  }

  takePicture = async function() {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options)
      console.log(data.uri);
      this.props.navigation.navigate('CameraPreview', {'imageData': data});
    }
  };

  goBack() {
    this.props.navigation.goBack();
  }

  selectFlashMode(type) {
    if (type === 'auto') {
      this.setState({
        flashMode: RNCamera.Constants.FlashMode.auto,
        flash: 'auto',
        showFlashOptions: false
      })
    } else if (type === 'off'){
      this.setState({
        flashMode: RNCamera.Constants.FlashMode.off,
        flash: 'off',
        showFlashOptions: false
      })
    } else {
      this.setState({
        flashMode: RNCamera.Constants.FlashMode.on,
        flash: 'on',
        showFlashOptions: false
      })
    }
  }

  showFlashOptionsBlock() {
    this.setState({
      showFlashOptions: true
    })
  }

  switchCamera() {
    if (this.state.type === RNCamera.Constants.Type.back) {
      this.setState({
        type: RNCamera.Constants.Type.front
      })
    } else {
      this.setState({
        type: RNCamera.Constants.Type.back
      })
    }
  }

  render() {
    let autoColor = this.state.flash === 'auto' ? 'yellow': 'white';
    let onColor = this.state.flash === 'on' ? 'yellow': 'white';
    let offColor = this.state.flash === 'off' ? 'yellow': 'white';
    return (
      <View style={styles.container}>
        <View style={styles.cameraOptionsHeader}>
          <TouchableOpacity onPress={this.goBack}>
              <Icon style={styles.backButton} name="arrow-back" />
          </TouchableOpacity>
          {this.state.showFlashOptions ?
            <View style={styles.flashOptionsContainer}>
              <TouchableOpacity  style={{paddingRight: 5}} onPress={() => this.selectFlashMode('auto')}>
                <Text style={[{color: autoColor},styles.flashOptionsText]}>Auto</Text>
              </TouchableOpacity>
              <TouchableOpacity  style={{paddingRight: 5}} onPress={() => this.selectFlashMode('on')}>
                <Text style={[{color: onColor},styles.flashOptionsText]}>On</Text>
              </TouchableOpacity>
              <TouchableOpacity  style={{paddingRight: 5}} onPress={() => this.selectFlashMode('off')}>
                <Text style={[{color: offColor},styles.flashOptionsText]}>Off</Text>
              </TouchableOpacity>
            </View> :
            <TouchableOpacity onPress={this.showFlashOptionsBlock}>
              <Icon style={styles.flashIcon} type="MaterialIcons" name={this.state.flash === 'auto' ? 'flash-auto': this.state.flash === 'on' ? 'flash-on': 'flash-off'} />
            </TouchableOpacity>
          }
        </View>
        <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style = {styles.preview}
            type={this.state.type}
            flashMode={this.state.flashMode}
            mirrorImage={true}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'}
        />
      <View style={styles.cameraClickBlock}>
        <View style={{flex: 1}}>
        </View>
        <TouchableOpacity style={{flex: 1,flexDirection: 'row', justifyContent: 'center'}}
            onPress={this.takePicture.bind(this)}>
            <Icon style={styles.cameraIcon} type="FontAwesome" name="camera" />
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}
            onPress={this.switchCamera}>
            <Icon style={styles.cameraIcon} type="Ionicons" name="reverse-camera" />
        </TouchableOpacity>
        </View>
      </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  cameraOptionsHeader: {
    flexDirection: 'row',
    height: 80,
    zIndex: 100,
    position: 'absolute',
    top: 0,
    justifyContent: 'space-between',
    paddingTop: 30,
    paddingLeft: 15,
    paddingRight: 15,
    width: '100%',
  },
  backButton: {
    fontSize: 40,
    color: 'white',
  },
  flashIcon: {
    fontSize: 30,
    color: 'white',
  },
  preview: {
    flex: 1,
    alignItems: 'center'
  },
  cameraClickBlock: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    bottom: 5,
    position: 'absolute',
    paddingRight: 15
  },
  cameraIcon: {
    fontSize: 45,
    color: 'white',
  },
  flashOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5
  },
  flashOptionsText: {
    fontSize: 14,
    fontWeight: '700'
  },
})
