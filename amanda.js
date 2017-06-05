/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 * @author Ing. Jeanmarie Gonzalez
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import Button from 'apsl-react-native-button';
export default class Amanda extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Button style={styles.welcomeButton} textStyle={styles.welcomeText}
        onPress={() => {
            console.log('world!')
          }}>
          HOLD TO TALK
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2D3941'
  },
  welcome: {
    fontSize: 40,
    textAlign: 'center',
    color:'#FFFFFF',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  welcomeButton:{
    backgroundColor: '#9E7AC2',
    width: 250,
    position: 'absolute',
    bottom: 40,
    right: 35,
    left:35,
    borderColor:'#9E7AC2',
    borderRadius: 30,

    //borderWidth: 5
  },
  welcomeText: {
    fontSize: 25,
    textAlign: 'center',
    color:'#FFFFFF'
  },
  logo:{
    position: 'absolute',
    top:40,
    width:120,
    height:70
  }
});
