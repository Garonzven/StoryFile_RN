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
import { Actions } from 'react-native-router-flux';


export default class Welcome extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('./Sprites/Asset 2hdpi.png')} style={styles.logo}  ></Image>
        <Text style={styles.welcome}>  Welcome!</Text>
        <Button style={styles.welcomeButton} textStyle={styles.welcomeText}
            onPress={() => {  Actions.amanda();}}>GET STARTED
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
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
    flex:1,
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
