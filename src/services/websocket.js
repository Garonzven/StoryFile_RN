import { baseUrl } from './baseUrl'
export default {
  connect () {
    return new WebSocket('ws://192.168.1.166:8080/StoryFile/storyfile');
  }
}