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
  Image,
  Dimensions
} from 'react-native';
import Button from 'apsl-react-native-button';
import Video from 'react-native-video';

export default class Amanda extends Component {
  constructor(props) {
     super(props);
     this.onLoad = this.onLoad.bind(this);
     this.onProgress = this.onProgress.bind(this);
  }

  state = {
 rate: 1,
 volume: 1,
 muted: true,
 resizeMode: 'contain',
 duration: 0.0,
 currentTime: 0.0,
   };

  onLoad(data) {
 this.setState({duration: data.duration});
   }

  onProgress(data) {
 this.setState({currentTime: data.currentTime});
  }


  render() {
    return (
      <View style={styles.container}>
      <Video source={require('./Videos/amanda_bird_active_listening.mp4')}
      style={styles.backgroundVideo}
    rate={this.state.rate}
    volume={this.state.volume}
    muted={this.state.muted}
    resizeMode={this.state.resizeMode}
    onLoadStart={() => {console.warn("loading started");}}
    onLoad={() => {console.warn("loading done");}}
    onProgress={this.onProgress}
    playInBackground={true}
    onEnd={() => { this.refs.myVideo.refs.node.seek(0) }} repeat={true}
      />



        <View style={styles.circle} />

        <View style={styles.square} >
            <Text style={styles.talk}>  HOLD TO TALK</Text>
        </View>
        <Image source={require('./Sprites/micxxhdpi.png')} style={styles.mic}  ></Image>

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
  square:{
    width: '100%',
    height: 60,
    backgroundColor: '#2AB999',
    bottom:0,
    position:'absolute'
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#2AB999',
    bottom:40,
    position:'absolute'
  },
  mic:{
    position: 'absolute',
    bottom:42,
    width:30,
    height:30,
    resizeMode: 'contain'
  },
  talk: {
    fontSize: 20,
    textAlign: 'center',
    color:'#FFFFFF',
    top:20
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
});
