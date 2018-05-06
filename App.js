import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  CameraRoll,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ScrollView
} from 'react-native';

import ImageBlock from './ImageBlock';

import { Icon } from 'native-base';

export default class App extends Component {
  static navigationOptions = () => ({
    header: null
  });

  constructor(props) {
    super(props);
    let { height, width } = Dimensions.get('window');
    let heightFactor = height > width ? .40 : .45;
    if (height %2 !== 0) {
      height = height+ 1;
    }
    let imagesBlockHeight = Math.ceil(height*heightFactor);
    let imagesDisplayHeight = Math.ceil(imagesBlockHeight - 60) - 5;
    let imagesHeight = (imagesDisplayHeight - 15)*.5;
    this.state = {
      images: [],
      showPhotoBlock: false,
      selectedImages: [],
      height: height,
      imagesBlockHeight: imagesBlockHeight,
      imagesDisplayHeight: imagesDisplayHeight,
      imagesHeight: imagesHeight
    };
    this.hidePhotosBlock = this.hidePhotosBlock.bind(this);
    this.onClickImage = this.onClickImage.bind(this);
    this.browsePhtosAlbum = this.browsePhtosAlbum.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.getSelectedImages = this.getSelectedImages.bind(this);
    this.goToCamera = this.goToCamera.bind(this);
  }

  componentDidMount(){
    if (this.props.navigation.state.params && this.props.navigation.state.params.selectedImages) {
      let selectedImages = [...this.state.selectedImages, ...this.props.navigation.state.params.selectedImages];
      this.setState({
        selectedImages : selectedImages
      })
    }
    Dimensions.addEventListener("change", function (dimensions) {
      let height = dimensions.window.height;
      let width = dimensions.window.width;
      if (height %2 !== 0) {
        height = height+ 1;
      }
      let heightFactor = height > width ? .40 : .45; //to give larger height in landscape
      let imagesBlockHeight = Math.ceil(height*heightFactor);
      let imagesDisplayHeight = Math.ceil(imagesBlockHeight - 60) - 5;
      let imagesHeight = (imagesDisplayHeight - 15)*.5;
      this.setState({
        height: height,
        imagesBlockHeight: imagesBlockHeight,
        imagesDisplayHeight: imagesDisplayHeight,
        imagesHeight: imagesHeight,

      })
    }.bind(this))
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change");
  }

  getSelectedImages(images) {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos'
    })
    .then(r => {
      this.setState({images: r.edges, showPhotoBlock: true});
    })
  }

  hidePhotosBlock() {
    this.setState({
      showPhotoBlock: false
    })
  }

  onClickImage(image, selected) {
    let selectedImages = this.state.selectedImages;
    if (selected) {
      //add image to selected images list
      selectedImages.push(image);
      this.setState({
        selectedImages: selectedImages
      });
    } else {
      //remove image from selected images list
      var removedImages = this.state.selectedImages.filter(imageAdded => imageAdded.index !== image.index);
      this.setState({
        selectedImages: removedImages,
      });
    }
  }

  browsePhtosAlbum() {
    this.props.navigation.navigate('SelectPhotos', {'alreadySelectedImages': this.state.selectedImages});
  }

  isSelected(index) {
    let selected = false;
    if (this.state.selectedImages.length === 0) {
      return false;
    } else {
      this.state.selectedImages.forEach((imageObj) => {if (imageObj.index === index)  selected = true;});
    }
    return selected;
  }

  goToCamera() {
      this.props.navigation.navigate('Camera');
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
        {this.state.selectedImages.map((imageObj,index) => {
          return <Image key={index} style={{width: 50, height: 70}} source={{uri: imageObj.node.image.uri }} />
        })}
      </View>
          <TouchableOpacity onPress={this.getSelectedImages}>
            <View><Text>Photos</Text></View>
          </TouchableOpacity>

        {this.state.showPhotoBlock ?
          <View style={[styles.photosBlock,{ height: this.state.imagesBlockHeight}]}>

              <View style={[styles.imgContainer, {height: this.state.imagesBlockHeight}]}>
                <View style={styles.imgBlkHeader}>
                    <TouchableOpacity onPress={this.openPhotoLibrary}>
                      <Text style={{textAlign: 'center', color: 'black',fontSize: 18}}>Add Photos</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal={true}>
                  <View style={[styles.cameraExplorer, {height: this.state.imagesDisplayHeight}]}>
                    <TouchableOpacity onPress={this.goToCamera} style={[styles.cameraPhotoBlk, {height: this.state.imagesHeight}]}>
                      <Icon name="photo-camera" type="MaterialIcons" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.browsePhtosAlbum} style={[styles.cameraPhotoBlk, {height: this.state.imagesHeight}]}>
                      <Icon name="photo-album" type="MaterialIcons" />
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.imagesDisplay,{height: this.state.imagesDisplayHeight}]}>
                    {this.state.images.map((p, i) => {
                      return (<ImageBlock index={i} selected={this.isSelected} onClickImage={this.onClickImage} key={i} style={[styles.imgOption, {height: this.state.imagesHeight}]} image={p} />)
                    })}
                  </View>
                </ScrollView>
                <View style={styles.imgBlkFooter}>
                  <TouchableOpacity style={{width: '100%'}} onPress={this.hidePhotosBlock}>
                    <Text style={{textAlign: 'center', color: 'blue',fontSize: 16}}>Done</Text>
                  </TouchableOpacity>
                </View>
            </View>
          </View>
        : '' }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  photosBlock: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    marginBottom: 0,
    zIndex: 5,
    backgroundColor: 'white' //to hide anything on the back
  },
  imgContainer: {
    borderColor: '#CCC',
    borderWidth: 1,
  },
  imgBlkHeader: {
    paddingTop: 5,
    paddingBottom: 5,
    height: 30,
    alignItems: 'center',
    borderBottomColor: '#CCC',
    borderBottomWidth: 1
  },
  imagesDisplay: {
    padding: 5,
    flexWrap: 'wrap'
  },
  imgOption: {
    width: 80,
    marginLeft: 2,
    marginTop: 2
  },
  imgBlkFooter: {
    borderTopColor: '#CCC',
    borderTopWidth: 1,
    height: 30,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cameraExplorer: {
    padding: 5,
    width: 80
  },
  cameraPhotoBlk: {
    backgroundColor: '#D3D3D3',
    marginTop: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
