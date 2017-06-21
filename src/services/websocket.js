import { baseUrl } from './config'
export default {
  connect () {
    return new WebSocket(`ws://${baseUrl}:3000/`);
  }
}
