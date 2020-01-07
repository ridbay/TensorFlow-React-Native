import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import {fetch} from '@tensorflow/tfjs-react-native'

class App extends React.Component{
  state ={
    isReady: false,
  }

   async componentDidMount(){
     await tf.ready()
     this.setState({ isReady: true})
     console.log(this.state.isReady)
   }
  render(){
   return (
    <View style={styles.container}>
  <Text>TFJS ready? {this.state.isReady}? <Text>Yes</Text>: <Text>No</Text></Text>
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