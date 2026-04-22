import { Avatar } from '@app/components/Avatar';
import { useProfile } from '@app/hooks/queries';
import { useUpdateProfileMutation } from '@app/hooks/mutations';
import { useTheme } from '@app/theme/ThemeContext';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { BackButton } from '@app/components/BackButton.tsx';

export const SettingsModal: React.FC = (): React.ReactElement => {
  const navigation = useNavigation();
  const theme = useTheme();

  const { data: profile, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfileMutation();

  const [name, setName] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [avatarUri, setAvatarUri] = React.useState<string | null>(null);
  const [newAvatarFile, setNewAvatarFile] = React.useState<{
    readonly uri: string;
    readonly type: string;
    readonly fileName: string;
  } | null>(null);

  React.useEffect((): void => {
    if (profile) {
      setName(profile.name);
      setBio(profile.bio ?? '');
      setAvatarUri(profile.photoUrl);
    }
  }, [profile]);

  React.useEffect((): void => {
    navigation.setOptions({
      headerLeft: BackButton,
      headerRight: null,
      headerLeftContainerStyle: {
        paddingRight: 10,
        paddingLeft: 10,
      },
    });
  }, [navigation]);

  const handlePickImage = React.useCallback(async (): Promise<void> => {
    await launchImageLibrary(
      { mediaType: 'photo', quality: 0.8 },
      (response): void => {
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
      },
    );
  }, []);

  const handleSave = React.useCallback((): void => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío.');
      return;
    }

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

    updateProfileMutation.mutate(formData, {
      onSuccess: () => {
        navigation.goBack();
      },
      onError: () => {
        Alert.alert('Error', 'No se pudieron guardar los cambios.');
      },
    });
  }, [name, bio, newAvatarFile, updateProfileMutation, navigation]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primaryColor} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.avatarSection}>
            <TouchableOpacity
              onPress={handlePickImage}
              style={styles.avatarWrapper}
            >
              <Avatar name={name || '?'} size={96} uri={avatarUri} />
              <View style={styles.cameraOverlay}>
                <FontAwesomeIcon
                  icon={faCamera}
                  size={14}
                  color={theme.primaryColor}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre"
              placeholderTextColor={theme.placeholderTextColor}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={styles.input}
              value={bio}
              onChangeText={setBio}
              placeholder="Algo sobre ti"
              placeholderTextColor={theme.placeholderTextColor}
              maxLength={140}
            />
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending ? (
              <ActivityIndicator color={theme.contrastTextColor} />
            ) : (
              <Text style={styles.saveButtonText}>Guardar</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: 'black',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
