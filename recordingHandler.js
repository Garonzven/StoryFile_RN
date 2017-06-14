//import WebRTC from 'react-native-webrtc';
import {
  WebRTC,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaRecorder,
  MediaStream,
  MediaStreamTrack,
  getUserMedia,
} from 'react-native-webrtc';

var mediaRecorder;

export default class RecordingHandler {

  stopRecording () {
    mediaRecorder.stop();
    console.log(mediaRecorder.requestData());
  }
  record () {
    console.log( 'Recording! maybe..' );

    /*var configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
    var pc = new RTCPeerConnection(configuration);*/

    MediaStreamTrack.getSources(sourceInfos => {
      console.log(sourceInfos);
      getUserMedia({
        audio: true,
        video: false
      }, function (stream) {
        console.log('dddd', stream);
        const options = {
          audioBitsPerSecond : 44100,
          mimeType : 'audio/I16'
        }
        mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorder.start();
        //callback(stream);
      }, function (err) {
        console.log('dddd', err);
      });
    });

    /*pc.createOffer(function(desc) {
      pc.setLocalDescription(desc, function () {
        // Send pc.localDescription to peer
      }, function(e) {});
    }, function(e) {});

    pc.onicecandidate = function (event) {
      // send event.candidate to peer
    };*/
  }
  /*logError(error) {
    console.log("logError", error);
  }*/
}
