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
      imagesHeight: imagesHeight,
      hasNextPage: false,
      endCursor: ''
    };
    this.hidePhotosBlock = this.hidePhotosBlock.bind(this);
    this.onClickImage = this.onClickImage.bind(this);
    this.browsePhtosAlbum = this.browsePhtosAlbum.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.getSelectedImages = this.getSelectedImages.bind(this);
    this.goToCamera = this.goToCamera.bind(this);
    this.scrollFetchImages = this.scrollFetchImages.bind(this);
  }

  componentDidMount(){
    if (this.props.navigation.state.params && this.props.navigation.state.params.selectedImages) {
      console.log(this.state.selectedImages);
      let selectedImages = [...this.state.selectedImages, ...this.props.navigation.state.params.selectedImages];
      this.setState({
        selectedImages : selectedImages,
      });
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
      this.setState({images: r.edges, showPhotoBlock: true, hasNextPage:
        r.page_info.has_next_page, endCursor: r.page_info.end_cursor});
    })
  }

  hidePhotosBlock() {
    this.setState({
      showPhotoBlock: false
    })
  }

  onClickImage(image, selected) {
    if (selected) {
      //add image to selected images list
      this.setState({
        selectedImages: [...this.state.selectedImages,image]
      });
    } else {
      //remove image from selected images list
      var retrievedImages = this.state.selectedImages.filter(imageAdded => imageAdded.node.image.uri !== image.node.image.uri);
      this.setState({
        selectedImages: retrievedImages,
      });
    }
  }

  browsePhtosAlbum() {
    this.props.navigation.navigate('SelectPhotos', {'alreadySelectedImages': this.state.selectedImages});
  }

  isSelected(image) {
    let selected = false;
    if (this.state.selectedImages.length === 0) {
      return false;
    } else {
      this.state.selectedImages.forEach((imageObj) => {if (imageObj.node.image.uri === image.node.image.uri)  selected = true;});
    }
    return selected;
  }

  goToCamera() {
      this.props.navigation.navigate('Camera', {'alreadySelectedImages': this.state.selectedImages});
  }

  scrollFetchImages() {
    if (this.state.hasNextPage) {
      CameraRoll.getPhotos({
        first: 20,
        after: this.state.endCursor,
        assetType: 'Photos'
      })
      .then(r => {
        this.setState({images: [...this.state.images,...r.edges], hasNextPage: r.page_info.has_next_page, endCursor: r.page_info.end_cursor});
      })
    }
  }

  removeImage(image) {
    var retrievedImages = this.state.selectedImages.filter(imageAdded => imageAdded.node.image.uri !== image.node.image.uri);
    this.setState({
      selectedImages: retrievedImages,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{alignItems: 'center',justifyContent: 'center'}}>
          <TouchableOpacity onPress={this.getSelectedImages}>
            <Icon type="FontAwesome" name="camera" />
          </TouchableOpacity>
        </View>
        <Text>{JSON.stringify(this.state.tempImages)}</Text>
        <View style={{flexDirection: 'row',marginTop: 15}}>
          {this.state.selectedImages.map((imageObj,index) => {
            return (<View key={index} style={{marginRight: 5}}>
                      <Image style={{width: 50, height: 70}} source={{uri: imageObj.node.image.uri }} />
                      {!this.state.showPhotoBlock ?
                        <TouchableOpacity onPress={() => this.removeImage(imageObj)}
                          style={{alignSelf: 'flex-end',position: 'absolute', top: -10,right: -5}}>
                          <Text style={{fontSize: 18}}>X</Text>
                        </TouchableOpacity>
                        : ''}
                    </View>)
          })}
        </View>
        {this.state.showPhotoBlock ?
          <View style={[styles.photosBlock,{ height: this.state.imagesBlockHeight}]}>

              <View style={[styles.imgContainer, {height: this.state.imagesBlockHeight}]}>
                <View style={styles.imgBlkHeader}>
                    <TouchableOpacity onPress={this.openPhotoLibrary}>
                      <Text style={{textAlign: 'center', color: 'black',fontSize: 18}}>Add Photos</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal={true} onMomentumScrollEnd={this.scrollFetchImages} scrollEventThrottle={50}>
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
                      return (<ImageBlock index={i} selected={() => this.isSelected(p)} onClickImage={this.onClickImage} key={i} style={[styles.imgOption, {height: this.state.imagesHeight}]} image={p} />)
                    })}
                  </View>
                </ScrollView>
                <View style={styles.imgBlkFooter}>
                  <TouchableOpacity style={{width: '100%'}} onPress={this.hidePhotosBlock}>
                    <Text style={{textAlign: 'center', fontWeight: '700',fontSize: 16}}>Done</Text>
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
    paddingTop: 30,
    // justifyContent: 'center',
    // alignItems: 'center',
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
