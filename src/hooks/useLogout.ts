import { useSessionStore } from '@app/mobx/sessionStore';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { Alert, BackHandler } from 'react-native';

export const useLogout = (
  message: string,
  save?: () => Promise<void>,
  load?: () => Promise<void>,
): boolean => {
  const [loading, setLoading] = React.useState<boolean>(true);

  const sessionStore = useSessionStore();

  React.useEffect((): void => {
    if (load) {
      load().finally((): void => {
        setLoading(false);
      });
    }
  }, [load]);

  useFocusEffect(
    React.useCallback((): (() => void) => {
      const applicationCloseHandler = (): boolean => {
        Alert.alert('Salir de la Aplicación?', message, [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Aceptar',
            style: 'destructive',
            onPress: async (): Promise<void> => {
              await save?.();
              await sessionStore.logout();
            },
          },
        ]);

        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', applicationCloseHandler);
      return (): void => {
        // BackHandler.removeEventListener('hardwareBackPress', applicationCloseHandler);
      };
    }, [message, save, sessionStore]),
  );

  return loading;
};
