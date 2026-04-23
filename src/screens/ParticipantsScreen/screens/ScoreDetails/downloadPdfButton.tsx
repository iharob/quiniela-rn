import { useApi } from '@app/context/api';
import { useTheme } from '@app/theme/ThemeContext';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

interface Props {
  readonly userId: number;
}

export const DownloadPdfButton: React.FC<Props> = (
  props: Props,
): React.ReactElement => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const api = useApi();
  const theme = useTheme();

  const { userId } = props;

  const onPress = React.useCallback(async (): Promise<void> => {
    setIsDownloading(true);
    try {
      const path = await api.downloadUserScorePDF(userId);
      if (Platform.OS === 'android') {
        await ReactNativeBlobUtil.android.actionViewIntent(
          path,
          'application/pdf',
        );
      } else {
        await ReactNativeBlobUtil.ios.previewDocument(path);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      Alert.alert('No se pudo abrir el PDF', message);
    } finally {
      setIsDownloading(false);
    }
  }, [api, userId]);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDownloading}
      style={styles.button}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel="Descargar PDF"
    >
      {isDownloading ? (
        <ActivityIndicator color={theme.contrastTextColor} />
      ) : (
        <FontAwesomeIcon
          icon={faFilePdf}
          size={24}
          color={theme.contrastTextColor}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});

const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 };
