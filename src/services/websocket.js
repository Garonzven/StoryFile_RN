import { baseUrl } from './baseUrl'
export default {
  connect () {
    return new WebSocket(`ws://${baseUrl}`);
  }
}