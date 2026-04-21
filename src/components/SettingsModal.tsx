import { Avatar } from '@app/components/Avatar';
import { useApi } from '@app/context/api';
import { useSessionStore } from '@app/mobx/sessionStore';
import { useTheme } from '@app/theme/ThemeContext';
import { faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { observer } from 'mobx-react';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

interface SettingsModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = observer(
  ({ visible, onClose }): React.ReactElement => {
    const theme = useTheme();
    const api = useApi();
    const sessionStore = useSessionStore();

    const [name, setName] = React.useState('');
    const [bio, setBio] = React.useState('');
    const [avatarUri, setAvatarUri] = React.useState<string | null>(null);
    const [newAvatarFile, setNewAvatarFile] = React.useState<{
      readonly uri: string;
      readonly type: string;
      readonly fileName: string;
    } | null>(null);
    const [saving, setSaving] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    React.useEffect((): void => {
      if (visible) {
        setLoading(true);
        api
          .fetchProfile()
          .then((profile): void => {
            setName(profile.name);
            setBio(profile.bio ?? '');
            setAvatarUri(profile.photoUrl);
            sessionStore.setProfile(profile);
          })
          .catch((): void => {
            const profile = sessionStore.profile;
            if (profile) {
              setName(profile.name);
              setBio(profile.bio ?? '');
              setAvatarUri(profile.photoUrl);
            }
          })
          .finally((): void => setLoading(false));
      }
    }, [visible, api, sessionStore]);

    const handlePickImage = React.useCallback((): void => {
      void launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response): void => {
        if (response.didCancel || response.errorCode) {
          return;
        }
        const asset = response.assets?.[0];
        if (asset?.uri) {
          setAvatarUri(asset.uri);
          setNewAvatarFile({
            uri: asset.uri,
            type: asset.type ?? 'image/jpeg',
            fileName: asset.fileName ?? 'avatar.jpg',
          });
        }
      });
    }, []);

    const handleSave = React.useCallback((): void => {
      if (!name.trim()) {
        Alert.alert('Error', 'El nombre no puede estar vacío.');
        return;
      }

      setSaving(true);
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('bio', bio.trim());
      if (newAvatarFile) {
        formData.append('photo', {
          uri: newAvatarFile.uri,
          type: newAvatarFile.type,
          name: newAvatarFile.fileName,
        } as unknown as Blob);
      }

      api
        .updateProfile(formData)
        .then((profile): void => {
          sessionStore.setProfile(profile);
          onClose();
        })
        .catch((): void => {
          Alert.alert('Error', 'No se pudieron guardar los cambios.');
        })
        .finally((): void => setSaving(false));
    }, [name, bio, newAvatarFile, api, sessionStore, onClose]);

    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
          <View style={[styles.header, { backgroundColor: theme.cardColor }]}>
            <Text style={[styles.title, { color: theme.contrastTextColor }]}>Ajustes</Text>
            <TouchableOpacity onPress={onClose} hitSlop={hitSlop} style={styles.closeButton}>
              <FontAwesomeIcon icon={faTimes} size={20} color={theme.contrastTextColor} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primaryColor} />
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.content}>
              <View style={styles.avatarSection}>
                <TouchableOpacity onPress={handlePickImage} style={styles.avatarWrapper}>
                  <Avatar name={name || '?'} size={96} uri={avatarUri} />
                  <View style={[styles.cameraOverlay, { backgroundColor: theme.cardColor }]}>
                    <FontAwesomeIcon icon={faCamera} size={14} color={theme.contrastTextColor} />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: theme.placeholderTextColor }]}>Nombre</Text>
                <TextInput
                  style={[styles.input, { color: theme.textColor, borderColor: theme.borderColor }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Tu nombre"
                  placeholderTextColor={theme.placeholderTextColor}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: theme.placeholderTextColor }]}>Bio</Text>
                <TextInput
                  style={[styles.input, { color: theme.textColor, borderColor: theme.borderColor }]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Algo sobre ti"
                  placeholderTextColor={theme.placeholderTextColor}
                  maxLength={140}
                />
              </View>

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: theme.cardColor }]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color={theme.contrastTextColor} />
                ) : (
                  <Text style={[styles.saveButtonText, { color: theme.contrastTextColor }]}>
                    Guardar
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </Modal>
    );
  },
);

const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarWrapper: {
    position: 'relative',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  saveButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
