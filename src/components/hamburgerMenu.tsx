import { RulesModal } from '@app/components/RulesModal';
import { SettingsModal } from '@app/components/SettingsModal';
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
import { StackHeaderRightProps } from '@react-navigation/stack';

export const HamburgerMenu = (_: StackHeaderRightProps): React.ReactNode => {
  const [open, setOpen] = React.useState(false);
  const [rulesVisible, setRulesVisible] = React.useState(false);
  const [settingsVisible, setSettingsVisible] = React.useState(false);
  const theme = useTheme();
  const sessionStore = useSessionStore();

  const toggle = React.useCallback((): void => {
    setOpen(v => !v);
  }, []);

  const close = React.useCallback((): void => {
    setOpen(false);
  }, []);

  const handleShowRules = React.useCallback((): void => {
    setOpen(false);
    setRulesVisible(true);
  }, []);

  const handleCloseRules = React.useCallback((): void => {
    setRulesVisible(false);
  }, []);

  const handleShowSettings = React.useCallback((): void => {
    setOpen(false);
    setSettingsVisible(true);
  }, []);

  const handleCloseSettings = React.useCallback((): void => {
    setSettingsVisible(false);
  }, []);

  const handleLogout = React.useCallback((): void => {
    setOpen(false);
    Alert.alert('Cerrar sesión', '¿Estás seguro que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: (): void => {
          void sessionStore.logout();
        },
      },
    ]);
  }, [sessionStore]);

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

      <RulesModal visible={rulesVisible} onClose={handleCloseRules} />
      <SettingsModal visible={settingsVisible} onClose={handleCloseSettings} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
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
