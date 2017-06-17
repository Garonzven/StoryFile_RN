import { baseUrl } from './baseUrl'
export default {
  connect () {
    return new WebSocket('ws://10.0.3.2:8080/');
  }
}