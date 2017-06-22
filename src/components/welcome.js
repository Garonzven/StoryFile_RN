/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 * @author Ing. Jeanmarie Gonzalez
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  Image
} from 'react-native';
import Button from 'apsl-react-native-button';
import { Actions } from 'react-native-router-flux';
import LogoAsset from '../assets/Sprites/Asset 2mdpi.png';
import styles from '../styles/welcome.js';
export default class Welcome extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Image source={LogoAsset} style={styles.logo}  />
        <Text style={styles.welcome}>  Welcome!</Text>
        <Button style={styles.welcomeButton} textStyle={styles.welcomeText}
            onPress={() => {  Actions.amanda();}}>GET STARTED
        </Button>
      </View>
    );
  }
}

