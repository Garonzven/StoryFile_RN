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
import ws from '../services/websocket';
import FadeInView from './fadeInView';

import styles from '../styles/amanda';
import amandaDefault from '../assets/Videos/amanda_bird_active_listening.mp4';
import microphoneAsset from '../assets/Sprites/micxxhdpi.png';
import logoAsset from '../assets/Sprites/Asset 3hdpi.png';



function _base64ToArrayBuffer(encoded) {
    var binary_string =  base64.decode(encoded);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

export default class Amanda extends Component {

  constructor(props) {
     super(props);
     this.onLoad = this.onLoad.bind(this);
     this.onProgress = this.onProgress.bind(this);
     this.onStartShouldSetResponder = this.onStartShouldSetResponder.bind(this);
     this.onResponderRelease = this.onResponderRelease.bind(this);
     this.onEnd = this.onEnd.bind(this);
     this.onBuffer = this.onBuffer.bind(this);
  }
  state = {
     rate: 1,
     volume: 1,
     video: null,
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
       recording: false,
       stoppedRecording: false,
       finished: false,
       audioPath: AudioUtils.DocumentDirectoryPath + '/test2.aac',
       hasPermission: undefined,
       style_vid1:styles.backgroundVideo,
       style_vid2:styles.hidden
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
         //this.ws.send("end");
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
            video:{uri: message.server_storyfile.video_url}
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
    //  this.setState({duration: data.duration});
    console.warn("video loaded");
    this.setState({
    //  style_vid1: styles.hidden,
      style_vid2: styles.backgroundVideo
    //  video:{uri: message.server_storyfile.video_url}
    })
   }

   onEnd(){
     console.warn("video ended");
     this.setState({
       style_vid2: styles.hidden,
    //   style_vid1: styles.backgroundVideo
       video:null
     })
   }

  onProgress(data) {
      this.setState({currentTime: data.currentTime});
  }

  onBuffer(){
    console.warn("buffering..");
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
        <Image source={logoAsset} style={styles.logo} ></Image>
        <Video source={amandaDefault}
        style={this.state.style_vid1}
        rate={this.state.rate}
        volume={this.state.volume}
        muted={this.state.muted}
        resizeMode={this.state.resizeMode}
        playInBackground={true}
        repeat={true}
        />
        <FadeInView targetOpacity={1}>
          <Video
          source={this.state.video}
          style={this.state.style_vid2}
          rate={this.state.rate}
          volume={this.state.volume}
          muted={this.state.muted}
          resizeMode={this.state.resizeMode}
          playInBackground={false}
          repeat={false}
          onLoad={this.onLoad}
          onEnd={this.onEnd}
          />
        </FadeInView>

        <View style={this.state.circle}
              onStartShouldSetResponder={this.onStartShouldSetResponder}
              onResponderRelease={this.onResponderRelease}
        />

        <View style={this.state.square}
              accessible={true}
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
