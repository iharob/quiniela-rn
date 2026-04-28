import { queryClient } from '@app/queryClient';
import { handleScoreMessage } from '@app/services/fcm/scoreHandler';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import React from 'react';
import { AppState, AppStateStatus, NativeEventSubscription } from 'react-native';

const SCORES_TOPIC = 'scores';

export const useFcmBootstrap = (): void => {
  React.useEffect((): (() => void) => {
    let alive = true;

    const subscribe = async (): Promise<void> => {
      const auth = await messaging().requestPermission();
      const granted =
        auth === messaging.AuthorizationStatus.AUTHORIZED ||
        auth === messaging.AuthorizationStatus.PROVISIONAL;
      if (!granted || !alive) {
        return;
      }
      await messaging().subscribeToTopic(SCORES_TOPIC);
    };

    subscribe().catch((err: unknown): void => {
      console.warn('FCM bootstrap failed', err);
    });

    const unsubscribeMessage = messaging().onMessage(
      async (msg: FirebaseMessagingTypes.RemoteMessage): Promise<void> => {
        handleScoreMessage(msg);
      },
    );

    const appStateSub: NativeEventSubscription = AppState.addEventListener(
      'change',
      (state: AppStateStatus): void => {
        if (state === 'active') {
          queryClient.invalidateQueries({ queryKey: ['ongoing'] });
        }
      },
    );

    return (): void => {
      alive = false;
      unsubscribeMessage();
      appStateSub.remove();
    };
  }, []);
};
