/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 * @author Ing. Jeanmarie Gonzalez
 */

import React, { Component } from 'react';
import {
  AppRegistry
} from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import Welcome from './welcome'
import Amanda from './amanda'
import Scenes from './Scenes'
export default class StoryFile extends Component {
  render() {
    return (
      <Scenes />
    );
  }
}



AppRegistry.registerComponent('StoryFile', () => StoryFile);
