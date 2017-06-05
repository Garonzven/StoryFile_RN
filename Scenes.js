import {Scene, Router} from 'react-native-router-flux';

class scenes extends React.Component {
  render() {
    return <Router>
      <Scene key="root">
        <Scene key="welcome" component={Welcome} title="Welcome"/>
        <Scene key="amanda" component={Amanda} title="Amanda"/>
      </Scene>
    </Router>
  }
}
