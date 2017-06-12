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
import RecordingHandler from './recordingHandler';

const r = new RecordingHandler();

export default class Amanda extends Component {

  constructor(props) {
     super(props);
     this.onLoad = this.onLoad.bind(this);
     this.onProgress = this.onProgress.bind(this);
     this.onStartShouldSetResponder = this.onStartShouldSetResponder.bind(this);
     this.onResponderRelease = this.onResponderRelease.bind(this);
  }

  state = {
     rate: 1,
     volume: 1,
     muted: true,
     resizeMode: 'cover',
     duration: 0.0,
     currentTime: 0.0,
     talkText:'HOLD TO TALK',
     square:{
       width: '100%',
       height: 60,
       backgroundColor: '#2AB999',
       bottom:0,
       position:'absolute'
     },circle: {
         width: 40,
         height: 40,
         borderRadius: 50,
         backgroundColor: '#2AB999',
         bottom:40,
         position:'absolute'
       },
   };

  onLoad(data) {
      this.setState({duration: data.duration});
   }

  onProgress(data) {
      this.setState({currentTime: data.currentTime});
  }

  //On Press
  onStartShouldSetResponder(){
    console.log("start should set responder");
    this.setState({square:{
      width: '100%',
      height: 60,
      backgroundColor: '#E74D3D',
      bottom:0,
      position:'absolute'
    },circle: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: '#E74D3D',
        bottom:40,
        position:'absolute'
      },
    talkText:'RELEASE TO LISTEN'})
    r.record();
    this._record();
    return true;
  }
  //On Release
  onResponderRelease(){
    console.log("responder release");
    this.setState({square:{
      width: '100%',
      height: 60,
      backgroundColor: '#2AB999',
      bottom:0,
      position:'absolute'
    },circle: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: '#2AB999',
        bottom:40,
        position:'absolute'
      },
    talkText:'HOLD TO TALK'})

      this._stop();

    r.stopRecording();

  }

  prepareRecordingPath(audioPath){
     AudioRecorder.prepareRecordingAtPath(audioPath, {
       SampleRate: 22050,
       Channels: 1,
       AudioQuality: "Low",
       AudioEncoding: "aac"
       //AudioEncodingBitRate: 32000
     });
   }

  //var ws;

  componentDidMount() {
    console.log( 'connecting..' );
    var ws = new WebSocket('wss://echo.websocket.org/');

    ws.onopen = () => {
      // connection opened
      ws.send('Open!'); // send a message
    };
    ws.onmessage = (e) => {
      // a message was received
      console.log(e.data);
    };
    ws.onerror = (e) => {
      // an error occurred
      console.log(e.message);
    };
    ws.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
    };

    let audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';
    this.prepareRecordingPath(audioPath);
    AudioRecorder.onProgress = (data) => {
      console.warn('currentTime: '+Math.floor(data.currentTime));
      //this.setState({currentTime: Math.floor(data.currentTime)});
    };
    AudioRecorder.onFinished = (data) => {
    //  this.setState({finished: data.finished});
      console.log('Finished recording: ${data.finished}');
    };
  }
  /*componentWillUnmount() {
    ws.close()
    console.log( 'closed ws connection' );
  }*/

  _stop() {
      if (this.state.recording) {
        AudioRecorder.stopRecording();
        //this.setState({stoppedRecording: true, recording: false});
      } else if (this.state.playing) {
        AudioRecorder.stopPlaying();
      //  this.setState({playing: false, stoppedPlaying: true});
      }
    }

    _record() {
      if(this.state.stoppedRecording){
        let audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';
      //  this.prepareRecordingPath(audioPath);
      }
      AudioRecorder.startRecording();
    //  this.setState({recording: true, playing: false});
    }


  render() {
    var color_talk = '';
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
    repeat={true}
      />



        <View style={this.state.circle} />

        <View style={this.state.square}
              accessible={true}
              onAccessibilityTap={() => {console.warn("tap");}}
              onStartShouldSetResponder={this.onStartShouldSetResponder}
              onMoveShouldSetResponder={() => {console.warn("move should set responder");}}
              onResponderRelease={this.onResponderRelease}
              onMagicTap={() => {console.warn("MagicTap");}}
              >
            <Text style={styles.talk}> {this.state.talkText}</Text>
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
