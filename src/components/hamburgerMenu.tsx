import { useSessionStore } from '@app/mobx/sessionStore';
import { useTheme } from '@app/theme/ThemeContext';
import {
  faBars,
  faGear,
  faRightFromBracket,
  faScaleBalanced,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Alert,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export const HamburgerMenu = (): React.ReactNode => {
  const navigation = useNavigation<any>();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const sessionStore = useSessionStore();

  const toggle = React.useCallback((): void => {
    setOpen((previousValue: boolean): boolean => !previousValue);
  }, []);

  const close = React.useCallback((): void => {
    setOpen(false);
  }, []);

  const handleShowRules = React.useCallback((): void => {
    close();
    navigation.navigate('Rules');
  }, [navigation, close]);

  const handleShowSettings = React.useCallback((): void => {
    close();
    navigation.navigate('Settings');
  }, [navigation, close]);

  const handleLogout = React.useCallback((): void => {
    close();

    Alert.alert('Cerrar sesión', '¿Estás seguro que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async (): Promise<void> => {
          await sessionStore.logout();
        },
      },
    ]);
  }, [sessionStore, close]);

  const statusBarHeight = StatusBar.currentHeight ?? 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.hamburger}
        hitSlop={hitSlop}
        accessibilityRole="button"
        accessibilityLabel="Menú"
        onPress={toggle}
      >
        <FontAwesomeIcon
          icon={faBars}
          size={24}
          color={theme.contrastTextColor}
        />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={close}
      >
        <Pressable style={styles.backdrop} onPress={close}>
          <View style={[styles.menu, { top: statusBarHeight + 12 }]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleShowSettings}
            >
              <FontAwesomeIcon
                icon={faGear}
                size={16}
                color="#1F1F1F"
                style={styles.menuIcon}
              />
              <Text style={styles.menuItemText}>Ajustes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleShowRules}>
              <FontAwesomeIcon
                icon={faScaleBalanced}
                size={16}
                color="#1F1F1F"
                style={styles.menuIcon}
              />
              <Text style={styles.menuItemText}>Reglas</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <FontAwesomeIcon
                icon={faRightFromBracket}
                size={16}
                color="#c00000"
                style={styles.menuIcon}
              />
              <Text style={[styles.menuItemText, styles.logoutText]}>
                Cerrar sesión
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  hamburger: {
    width: 28,
    height: 22,
  },
  backdrop: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    right: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    minWidth: 180,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#1F1F1F',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
    marginHorizontal: 16,
  },
  logoutText: {
    color: '#c00000',
  },
});

const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 };
