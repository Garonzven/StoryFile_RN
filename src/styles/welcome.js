import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#2D3941'
  },
  welcome: {
    fontSize: 40,
    textAlign: 'center',
    color:'#FFFFFF',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  welcomeButton:{
    backgroundColor: '#9E7AC2',
    width: 250,
    position: 'absolute',
    bottom: 40,
    flex:1,
    borderColor:'#9E7AC2',
    borderRadius: 30,

    //borderWidth: 5
  },
  welcomeText: {
    fontSize: 25,
    textAlign: 'center',
    color:'#FFFFFF'
  },
  logo:{
    position: 'absolute',
    top:40,
    width:120,
    height:70
  }
});