//import WebRTC from 'react-native-webrtc';
import {
  WebRTC,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  getUserMedia,
} from 'react-native-webrtc';

export default class RecordingHandler {
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
