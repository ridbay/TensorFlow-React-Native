import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { fetch } from '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

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
  }
  getPermissionAsync = async () => {
    if(Constants.platform.ios) {
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if(status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
      }
    }
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