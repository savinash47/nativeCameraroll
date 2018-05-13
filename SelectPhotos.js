import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, CameraRoll, Dimensions, TouchableOpacity } from 'react-native';
import ImageBlock from './ImageBlock';
import { Icon } from 'native-base';
let { height, width } = Dimensions.get('window');

export default class SelectPhotos extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null
  });

  constructor(props) {
    super(props);
    this.state = {
      images : [],
      selectedImages: this.props.navigation.state.params.alreadySelectedImages,
      hasNextPage: false
    };
    this.endCursor = undefined;
    this.onClickImage = this.onClickImage.bind(this);
    this.goBack = this.goBack.bind(this);
    this.doneAdding = this.doneAdding.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.scrollFetchImages = this.scrollFetchImages.bind(this);
  }

  componentDidMount() {
    CameraRoll.getPhotos({
      first: 40,
      after: this.endCursor,
      assetType: 'Photos'
    })
    .then(r => {
      this.setState({images: r.edges, hasNextPage: r.page_info.has_next_page});
      this.endCursor = r.edges[r.edges.length - 1].node.image.uri
    })
  }

  onClickImage(image, add) {
    //if add image
    if (add) {
      //add image to selected images list
      this.setState({
        selectedImages: [...this.state.selectedImages,image]
      });
    } else {
      //remove image from selected images list
      var removedImages = this.state.selectedImages.filter(imageAdded => imageAdded.node.uri !== image.node.uri);
      this.setState({
        selectedImages: removedImages
      });
    }
  }

  goBack() {
    this.props.navigation.navigate('App');
  }

  doneAdding() {
    this.props.navigation.navigate('App', {'selectedImages': this.state.selectedImages});
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

  scrollFetchImages() {
    if (this.state.hasNextPage) {
      CameraRoll.getPhotos({
        first: 40,
        after: this.endCursor,
        assetType: 'Photos'
      })
      .then(r => {
        this.setState({images: [...this.state.images,...r.edges], hasNextPage: r.page_info.has_next_page});
        this.endCursor = r.edges[r.edges.length - 1].node.image.uri;
      })
    }
  }

  render() {
    return (
      <View style={styles.selectPhotosScreen}>
        <View style={styles.selectPhotosHeader}>
          <TouchableOpacity onPress={this.goBack}>
              <Icon style={{fontSize: 34}} name="arrow-back" />
          </TouchableOpacity>
          <Text style={{fontSize: 22, fontWeight: 'bold'}}>All Photos</Text>
          <TouchableOpacity onPress={this.doneAdding}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Done</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.selectPhotosContainer} onMomentumScrollEnd={this.scrollFetchImages}>
          {this.state.images.map((p, i) => {
            return (<ImageBlock index={i} selected={this.isSelected} onClickImage={this.onClickImage} key={i} style={styles.imgOption} image={p} />)
          })}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  selectPhotosScreen: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: 'white'
  },
  imgOption: {
    width: width*.20,
    height: 100
  },
  selectPhotosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  selectPhotosHeader: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15
  }
})
