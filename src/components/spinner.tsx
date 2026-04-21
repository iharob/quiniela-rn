import { useTheme } from '@app/theme/ThemeContext';
import React from 'react';
import { ActivityIndicator, Modal, StatusBar, StyleSheet, View } from 'react-native';

interface Props {
  readonly visible: boolean;
  readonly size?: number | 'large';
}

export const Spinner: React.FC<Props> = (props: Props): React.ReactElement => {
  const { visible, size = 'large' } = props;
  const theme = useTheme();

  if (!visible) {
    return <></>;
  }

  return (
    <Modal transparent={true}>
      <View style={styles.backdrop}>
        <ActivityIndicator color={theme.contrastTextColor} size={size} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
