import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#2D3941'
  },
  watson: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    top: 0,
    width: '100%',
    padding: 20,
    position: 'absolute',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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
  },
  hidden:{
    //display: 'none',
    width:0,
    height:0
  }
});
