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
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Button from 'apsl-react-native-button';
import Video from 'react-native-video';
import Sound from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import RNFetchBlob from 'react-native-fetch-blob';
import ws from '../services/websocket'
import base64 from 'base-64'

import styles from '../styles/amanda'
import amandaDefault from '../assets/Videos/amanda_bird_active_listening.mp4'
import microphoneAsset from '../assets/Sprites/micxxhdpi.png'



function _base64ToArrayBuffer(encoded) {
    var binary_string =  base64.decode(encoded);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}


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
     video: amandaDefault,
     watson: 'nothing',
     muted: false,
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
       currentTime: 0.0,
       recording: false,
       stoppedRecording: false,
       finished: false,
       audioPath: AudioUtils.DocumentDirectoryPath + '/test2.aac',
       hasPermission: undefined,
   };

   prepareRecordingPath(audioPath){
     AudioRecorder.prepareRecordingAtPath(audioPath, {
       SampleRate: 22050,
       Channels: 1,
       AudioQuality: "High",
      AudioEncoding: "aac"
     });
   }

   componentDidMount() {
     
     this._checkPermission().then((hasPermission) => {
       this.setState({ hasPermission });

       if (!hasPermission) return;

       this.prepareRecordingPath(this.state.audioPath);

       AudioRecorder.onProgress = (data) => {
         this.setState({currentTime: Math.floor(data.currentTime)});
       };

       AudioRecorder.onFinished = (data) => {
         // Android callback comes in the form of a promise instead.
         if (Platform.OS === 'ios') {
           this._finishRecording(data.status === "OK", data.audioFileURL);
         }
       };
     });
   }

   _checkPermission() {
     if (Platform.OS !== 'android') {
       return Promise.resolve(true);
     }

     const rationale = {
       'title': 'Microphone Permission',
       'message': 'AudioExample needs access to your microphone so you can record audio.'
     };

     return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
       .then((result) => {
         return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
       });
   }

   async _stop() {
     if (!this.state.recording) {
       return;
     }

     this.setState({stoppedRecording: true, recording: false});

     try {
       const filePath = await AudioRecorder.stopRecording();

       if (Platform.OS === 'android') {
         this._finishRecording(true, filePath);
       }
       return filePath;
     } catch (error) {
       console.error(error);
     }
   }

 
   async _record() {
     if (this.state.recording) {
       return;
     }

     if (!this.state.hasPermission) {
       return;
     }

     if(this.state.stoppedRecording){
       this.prepareRecordingPath(this.state.audioPath);
     }

     this.setState({recording: true});

     try {
       const filePath = await AudioRecorder.startRecording();
     } catch (error) {
       console.error(error);
     }
   }

   _finishRecording(didSucceed, filePath) {
     this.setState({ finished: didSucceed });


     this.ws = ws.connect();
     this.ws.onopen = () => {
      console.warn('socket is connect')
      this.setState({watson: 'loading...'})
      RNFetchBlob.fs.readStream(filePath, 'base64')
      .then((ifstream) => {
         ifstream.open()
         ifstream.onData((chunk) => {
           this.ws.send(chunk)
         })
         ifstream.onEnd(() => {
          this.ws.send('finish')
         // this.ws.close()
         })
      })
     }

     this.ws.onmessage = (data) => {
      const message = JSON.parse(data.data)
      console.log('message parse')
      console.log(message)
      if (message.hasOwnProperty('status')) {
        this.ws.close()
        if (message.status) {
          const watsonText = message.server_watson[message.server_watson.length - 1]
                            .alternatives[0]
          this.setState({
            watson: watsonText.transcript,
          //  video:{uri: message.server_storyfile.video_url}
          })
          alert(`
              watson: ${watsonText.transcript}
              video story file: ${message.server_storyfile.video_url}
            `)
        } else {
          alert('no puedo detectar nada :(')
          this.setState({watson: 'nothing'})
        }
      }
     }
      

  
     
   }

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
  //  r.record();
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
  //  r.stopRecording();
  }


  render() {
    var color_talk = '';
    return (
      <View style={styles.container}>
      <View style={styles.watson}>
        <Text> Watson: <Text> {this.state.watson} </Text>  </Text>
      </View>
      <Video source={this.state.video}
      style={styles.backgroundVideo}
    rate={this.state.rate}
    volume={this.state.volume}
    muted={this.state.muted}
    resizeMode={this.state.resizeMode}
    onProgress={this.onProgress}
    playInBackground={true}
    repeat={true}
      />

        <View style={this.state.circle} />

        <View style={this.state.square}
              accessible={true}
              onAccessibilityTap={() => {console.warn("tap");}}
              onStartShouldSetResponder={this.onStartShouldSetResponder}
              onResponderRelease={this.onResponderRelease}
              >
            <Text style={styles.talk}> {this.state.talkText}</Text>
        </View>
        <Image source={microphoneAsset} style={styles.mic}  ></Image>

      </View>
    );
  }
}

