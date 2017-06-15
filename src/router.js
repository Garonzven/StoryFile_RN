import React, { Component } from 'react';
import {
  AppRegistry
} from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import Welcome from './components/welcome'
import Amanda from './components/amanda'
export default class App extends Component {
  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="welcome" component={Welcome} title="Welcome" initial={true}  hideNavBar={true}/>
          <Scene key="amanda" component={Amanda} title="Amanda" />
        </Scene>
      </Router>
    );
  }
}
