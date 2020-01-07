import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import {fetch} from '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';

class App extends React.Component{
  state ={
    isTFReady: false,
    isModelReady: false,
  }

   async componentDidMount(){
     await tf.ready();
     this.setState({ isTFReady: true})
     //Load mobilenet model
     this.mobile = await mobilenet.load()
     this.setState({isModelReady: true})
   }

  render(){
   return (
    <View style={styles.container}>
  <Text>TFJS ready? {this.state.isTFReady? <Text>Yes</Text>: <Text>No</Text>}</Text>
  <Text>
    Model ready ? {this.state.isModelReady ? <Text>Yes, model is loaded</Text>: <Text>Loading Model...</Text>}
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