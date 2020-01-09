import React from 'react';
import { StyleSheet, Text, View, ImagePickerIOS, StatusBar, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { fetch } from '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as jpeg from 'jpeg-js';
import * as Permissions from 'expo-permissions'


class App extends React.Component {
  state = {
    isTFReady: false,
    isModelReady: false,
    predictions: null,
    image: null
  }

  async componentDidMount() {
    await tf.ready();
    this.setState({ isTFReady: true })
    //Load mobilenet model
    this.mobile = await mobilenet.load()
    this.setState({ isModelReady: true })

    //Call the async method created below
    this.getPermissionAsync();
  }
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
      }
    }
  }

  imageToTensor(rawImageData) {
    const TO_UNIT8ARRAY = true;
    const { width, height, data } = jpeg.decode(rawImageData, TO_UNIT8ARRAY)

    //drop the alpha channel info for mobileNet
    const buffer = new Uint8Array(width * height * 3);
    let offset = 0;  //Offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset]
      buffer[i + 1] = data[offset + 1]
      buffer[i + 2] = data[offset + 2]
      offset += 4
    }
    return tf.tensor3d(buffer, [height, width, 3])
  }
  classifyImage = async () => {
    try {
      const imageAssetPath = Image.resolveAssetSource(this.state.image)
      const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
      const rawImageData = await response.arrayBuffer();
      const imageTensor = this.imageToTensor(rawImageData)
      const predictions = await this.model.classify(imageTensor)
      this.setState({ predictions })
      console.log(predictions)
    } catch (error) {
      console.log(error)

    }
  }

  selectImage = async () => {
    try {
      let response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePickerIOS.mediaTypesOptions.All,
        allowsEditing: true,
        aspect: [4, 3]
      })
      if (!response.cancelled) {
        const source = { uri: response.uri }
        this.setState({ image: source })
        this.classifyImage()
      }
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { isTFReady, isModelReady, predictions, image } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' />
        <View style={styles.loadingContainer}>
          <Text style={styles.commontextStyles}>
            TFJS ready ? {this.state.isTFReady ? <Text>✅</Text> : <Text>No</Text>}</Text>
          <View style={styles.loadingModelContainer}>
            <Text style={styles.text}>
              Model ready ? {this.state.isModelReady ? <Text style={styles.text}>Yes, model is loaded ✅</Text> : <ActivityIndicator size='small' />}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.imageWrapper}
          onPress={isModelReady ? this.selectImage : undefined}>
          {image && <Image source={image} style={styles.imageContainer} />}

          {isModelReady && !image && (
            <Text style={styles.transparentText}>Tap to choose Image</Text>
          )}

        </TouchableOpacity>
        <View style={styles.predictionWrapper}>
          {isModelReady && image && (
            <Text style={styles.text}>
              Predictions: {predictions ? '' : 'Predicting...'}
            </Text>
          )}
          {isModelReady && predictions && predictions.map(p => this.renderPrediction(p))}
        </View >
        <View style={styles.footer}>
          <Text style={styles.poweredBy}>Powered by:</Text>
          <Image source={require('./assets/tfjs')} style={styles.tfLogo} />
        </View>



      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default App;