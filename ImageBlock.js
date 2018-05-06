import React, { Component } from 'react';

import { Icon } from 'native-base';
import { Image, View, TouchableOpacity, StyleSheet } from 'react-native';
let borderColor = '';
export default class ImageBlock extends Component {

  constructor(props) {
    super(props);
    let selected = false;
    if (this.props.selected) {
      selected = this.props.selected(this.props.index)
    }
    this.onClickImage = this.onClickImage.bind(this);
    this.state = {
      borderColor: '#CCC',
      selected: selected
    }
  }

  onClickImage() {
    if (this.state.selected) {
      //unselect
      this.setState({
        borderColor: '#CCC',
        selected: false
      })
      this.props.onClickImage(Object.assign(this.props.image, {index: this.props.index}), false);
    } else {
      this.setState({
        borderColor: 'blue',
        selected: true
      })
      this.props.onClickImage(Object.assign(this.props.image, {index: this.props.index}), true);
    }

  }

  render() {
    return (
      <TouchableOpacity onPress={this.onClickImage}>
        <View style={[{position: 'relative'}, this.props.style]}>

          {this.state.selected ?
            <Icon style={styles.iconStyle} type="MaterialIcons" name="check-circle" />
          : ''}
          <Image style={[this.props.style,{borderColor:  this.state.borderColor, borderWidth: 1}]} source={{uri: this.props.image.node.image.uri }} />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  iconStyle: {
    top: 5,
    right: 2,
    position: 'absolute',
    fontSize: 20,
    zIndex: 5,
    color: 'blue'
  }
})
