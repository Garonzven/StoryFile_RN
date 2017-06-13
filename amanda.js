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
//import RecordingHandler from './recordingHandler';

//const r = new RecordingHandler();

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
       currentTime: 0.0,
       recording: false,
       stoppedRecording: false,
       finished: false,
       audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
       hasPermission: undefined,
   };

   prepareRecordingPath(audioPath){
     AudioRecorder.prepareRecordingAtPath(audioPath, {
       SampleRate: 22050,
       Channels: 1,
       AudioQuality: "Low",
       AudioEncoding: "aac",
       AudioEncodingBitRate: 32000
     });
   }

   componentDidMount() {
     this._checkPermission().then((hasPermission) => {
       this.setState({ hasPermission });

       if (!hasPermission) return;

       this.prepareRecordingPath(this.state.audioPath);

       AudioRecorder.onProgress = (data) => {
         console.log('progreso')
         console.log(data)
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
         console.log('Permission result:', result);
         return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
       });
   }

   async _stop() {
     if (!this.state.recording) {
       console.warn('Can\'t stop, not recording!');
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

   async _play() {
     if (this.state.recording) {
       console.warn('no hay vida menol')
       //await this._stop();
     }

     // These timeouts are a hacky workaround for some issues with react-native-sound.
     // See https://github.com/zmxv/react-native-sound/issues/89.
     setTimeout(() => {
       var sound = new Sound(this.state.audioPath, '', (error) => {
         if (error) {
           console.warn('failed to load the sound', error);
         }
       });

       setTimeout(() => {
         sound.play((success) => {
           if (success) {
             console.warn('successfully finished playing');
           } else {
             console.warn('playback failed due to audio decoding errors');
           }
         });
       }, 100);
     }, 100);
   }

   async _record() {
     if (this.state.recording) {
       console.warn('Already recording!');
       return;
     }

     if (!this.state.hasPermission) {
       console.warn('Can\'t record, no permission granted!');
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
     console.warn(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
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
    this._play();
  //  r.stopRecording();
  }

  //var ws;




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
