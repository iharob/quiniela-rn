/**
 * @format
 */

import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { handleScoreMessage } from './src/services/fcm/scoreHandler';

messaging().setBackgroundMessageHandler(async (msg) => {
  handleScoreMessage(msg);
});

AppRegistry.registerComponent(appName, () => App);
