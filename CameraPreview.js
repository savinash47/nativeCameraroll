'use strict';
import React, { Component } from 'react';
import { View, Text, Image , StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

export default class CameraPreview extends Component {
  static navigationOptions = () => ({
    header: null
  });

  constructor(props) {
    super(props);
    this.image = this.props.navigation.state.params.imageData;
    this.navigation = this.props.navigation;
    this.goBack = this.goBack.bind(this);
    this.acceptImage = this.acceptImage.bind(this);
  }

  goBack() {
    this.props.navigation.goBack();
  }


  acceptImage() {
    let imageObj = {
      node: {
        image: this.image
      }
    };
    this.navigation.navigate('App', {'selectedImages': [imageObj]});
  }

  render() {
    return (
      <View style={styles.imagePreview}>
        <View style={styles.cameraOptionsHeader}>
          <TouchableOpacity onPress={this.goBack}>
              <Icon style={styles.backButton} name="arrow-back" />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.acceptImage}>
              <Icon style={styles.doneBtn} type="MaterialIcons" name="check" />
          </TouchableOpacity>
        </View>
        <Image style={{width: '100%', height: '100%'}} source={{uri: this.image.uri}} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imagePreview: {
    flex: 1
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
    width: '100%'
  },
  backButton: {
    fontSize: 40,
    color: 'white'
  },
  doneBtn: {
    fontSize: 40,
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
})
