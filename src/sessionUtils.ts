import { UserSession } from '@app/mobx/sessionStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_STORAGE_KEY = '@authToken';

export const saveUserSession = async (data: UserSession): Promise<void> => {
  await AsyncStorage.setItem(AUTH_TOKEN_STORAGE_KEY, JSON.stringify(data));
};

export const deleteUserSession = async (): Promise<void> => {
  await AsyncStorage.clear();
};
