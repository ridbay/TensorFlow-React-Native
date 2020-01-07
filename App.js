import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { fetch } from '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as jpeg from 'jpeg-js';


class App extends React.Component {
  state = {
    isTFReady: false,
    isModelReady: false,
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
    if(Constants.platform.ios) {
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if(status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
      }
    }
  }

  imageToTensor(rawImageData){
    const TO_UNIT8ARRAY = true;
    const {width, height, data} = jpeg.decode(rawImageData, TO_UNIT8ARRAY)

    //drop the alpha channel info for mobileNet
    const buffer = new Uint8Array(width * height * 3);
    let offset = 0;  //Offset into original data
    for (let i =0; i < buffer.length; i +=3){
      buffer[i] = data[offset]
      buffer[i+1] = data[offset +1]
      buffer[i+2] = data[offset +2]
      offset +=4
    }
    return tf.tensor3d(buffer, [height, width, 3])
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>TFJS ready? {this.state.isTFReady ? <Text>Yes</Text> : <Text>No</Text>}</Text>
        <Text>
          Model ready ? {this.state.isModelReady ? <Text>Yes, model is loaded</Text> : <Text>Loading Model...</Text>}
        </Text>
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