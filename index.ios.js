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
import Welcome from './welcome'
export default class StoryFile extends Component {
  render() {
    return (
      <Welcome />
    );
  }
}



AppRegistry.registerComponent('StoryFile', () => StoryFile);
