/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
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
  NetInfo,
  Alert
} from 'react-native';
import Button from 'apsl-react-native-button';
import Video from 'react-native-video';
import Sound from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import RNFetchBlob from 'react-native-fetch-blob';
import ws from '../services/websocket'
import base64 from 'base-64'
import FadeInView from './fadeInView';

import styles from '../styles/amanda'
import amandaDefault from '../assets/Videos/amanda_bird_active_listening.mp4'
import microphoneAsset from '../assets/Sprites/micxxhdpi.png'
import loadingImg from '../assets/Sprites/loading_inside.png'
import logoAsset from '../assets/Sprites/Asset 3hdpi.png';
import RotatingComponent from './rotatingComponent';



export default class Amanda extends Component {

  constructor(props) {
     super(props);
     this.onLoad = this.onLoad.bind(this);
     this.onStartShouldSetResponder = this.onStartShouldSetResponder.bind(this);
     this.onResponderRelease = this.onResponderRelease.bind(this);
     this.onEnd = this.onEnd.bind(this);
     this._handleConnectivityChange = this._handleConnectivityChange.bind(this);
  }
  state = {
     rate: 1,
     volume: 1,
     video: null,
     transcript: 'nothing',
     muted: false,
     resizeMode: 'cover',
     duration: 0.0,
     currentTime: 0.0,
     targetOpacity:-1,
     buttonOpacity:1,
     talkText:'HOLD TO TALK',
     square:{
       width: '100%',
       height: 60,
       backgroundColor: '#2AB999',
       bottom:0,
       position:'absolute',
     },circle: {
         width: 40,
         height: 40,
         borderRadius: 50,
         backgroundColor: '#2AB999',
         bottom:40,
         position:'absolute',
       },
       mic_style:styles.mic,
       txt_style:styles.talk,
       recording: false,
       stoppedRecording: false,
       finished: false,
       audioPath: AudioUtils.DocumentDirectoryPath + '/test2.aac',
       hasPermission: undefined,
       style_vid1:styles.backgroundVideo,
       style_vid2:styles.hidden,
       isConnected:null,
       loading:styles.loadingHidden,
       playing:false

   };

   prepareRecordingPath(audioPath){
     AudioRecorder.prepareRecordingAtPath(audioPath, {
       SampleRate: 22050,
       Channels: 1,
       AudioQuality: 'Low',
       AudioEncoding: 'aac'
     });
   }

   componentDidMount() {

     NetInfo.isConnected.addEventListener(
        'change',
        this._handleConnectivityChange
    );

     //Check Network Connection status
     NetInfo.isConnected.fetch().done(
        (isConnected) => {
          console.log('Network Connection: ' + (isConnected ? 'online' : 'offline'));
          this.setState({isConnected});
          if(!isConnected)
          {
            Alert.alert(
                'No Internet Connection',
                "Sorry, no Internet connectivity detected, please reconnect and try again",
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: false }
              );
            this.setState({
                mic_style:styles.mic_blocked,
                txt_style:styles.txt_blocked
            })
          }

        }
    );


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

   componentWillUnmount(){
     NetInfo.isConnected.removeEventListener(
            'change',
            this._handleConnectivityChange
    );
   }

   _handleConnectivityChange(isConnected) {
     console.log("change connection state to: "+isConnected);
     this.setState({
         isConnected
       });
       if(!this.state.isConnected)
       {
         Alert.alert(
             'No Internet Connection',
             "Sorry, no Internet connectivity detected, please reconnect and try again",
             [
               {text: 'OK', onPress: () => console.log('OK Pressed')},
             ],
             { cancelable: false }
           );
           this.setState({
               mic_style:styles.mic_blocked,
               txt_style:styles.txt_blocked
           })
       }else{
         this.setState({
             mic_style:styles.mic,
             txt_style:styles.talk
         })
       }
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
      this.setState({transcript: 'loading...'})

      RNFetchBlob.fs.readStream(filePath, 'base64')
      .then((ifstream) => {
         ifstream.open()
         ifstream.onData((chunk) => {
           console.warn(chunk);
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
         if (message.hasOwnProperty('status'))
         {
           this.ws.close()
           if (message.status) {
               this.setState({
                 transcript: message.transcript,
                 video: { uri : message.videoUrl }
               })
               alert(`
                 transcript: ${message.transcript}
                 video url: ${message.videoUrl}
               `)
           } else {
             alert('no puedo detectar nada :(')
             this.setState({transcript: 'nothing'})
           }
         }
     }
     this.ws.onclose = () => {
       console.warn('connection closed');
     }
   }

  onLoad(data) {
    //  this.setState({duration: data.duration});
    console.warn("video loaded");

    this.setState({
    //  style_vid1: styles.hidden,
      playing:true,
      style_vid2: styles.backgroundVideo,
      targetOpacity: 1,
      loading:styles.loadingHidden
    //  video:{uri: message.server_storyfile.video_url}
    })
   }

   onEnd(){
     console.warn("video ended");
     this.setState({
     playing:false,
      targetOpacity: 0,
       video:null
     })
   }





  //On Press
  onStartShouldSetResponder(){
    console.log("start should set responder");
    if(!this.state.isConnected)
    {
      Alert.alert(
          'No Internet Connection',
          "Sorry, no Internet connectivity detected, please reconnect and try again",
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        );
    }else{
      if(this.state.playing)
      {
          this.onEnd();
      }
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
      talkText:'RELEASE TO LISTEN',
      loading:styles.loadingHidden
      })
    //  r.record();
      this._record();
    }

    return true;
  }
  //On Release
  onResponderRelease(){
    console.log("responder release");
    if(!this.state.isConnected)
    {
      Alert.alert(
          'No Internet Connection',
          "Sorry, no Internet connectivity detected, please reconnect and try again",
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        );
    }else{

      this.setState({
        loading:styles.loading,
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
      talkText:'HOLD TO TALK'})
      this._stop();
    }

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

          <FadeInView targetOpacity={this.state.targetOpacity} style={this.state.style_vid1}>
          <Video
            source={this.state.video}
            style={this.state.style_vid1,this.state.style_vid2}
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
              accessible={true}
              onStartShouldSetResponder={this.onStartShouldSetResponder}
              onResponderRelease={this.onResponderRelease}
        />

        <View style={this.state.square}
              accessible={true}
              onStartShouldSetResponder={this.onStartShouldSetResponder}
              onResponderRelease={this.onResponderRelease}
              >
            <Text style={this.state.txt_style}> {this.state.talkText}</Text>
        </View>
        <Image source={microphoneAsset} style={this.state.mic_style}  />
        <RotatingComponent
          isImage={true}
          source={loadingImg}
          lapDuration={ 2000 }
          style={styles.loading}
          counterClockwise={true}
        />

      </View>
    );
  }
}
