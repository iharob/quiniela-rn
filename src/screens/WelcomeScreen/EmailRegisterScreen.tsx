import { Spinner } from '@app/components/spinner';
import { useEmailRegisterMutation } from '@app/hooks/mutations';
import { useTheme } from '@app/theme/ThemeContext';
import { useThemedStyles } from '@app/theme/useThemedStyles';
import { TournamentTheme } from '@app/types/tournamentConfig';
import axios from 'axios';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

interface Props {
  readonly onBack: () => void;
}

export const EmailRegisterScreen: React.FC<Props> = (props: Props): React.ReactElement => {
  const { onBack } = props;
  const theme = useTheme();
  const themedStyles = useThemedStyles(themedStylesFactory);

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const registerMutation = useEmailRegisterMutation();

  const emailRef = React.useRef<TextInput>(null);
  const passwordRef = React.useRef<TextInput>(null);
  const confirmPasswordRef = React.useRef<TextInput>(null);

  const focusEmail = React.useCallback((): void => emailRef.current?.focus(), []);
  const focusPassword = React.useCallback((): void => passwordRef.current?.focus(), []);
  const focusConfirmPassword = React.useCallback(
    (): void => confirmPasswordRef.current?.focus(),
    [],
  );

  const handleRegister = React.useCallback(async (): Promise<void> => {
    setError(null);

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('El correo electrónico no es válido');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    registerMutation.mutate(
      { email: email.trim(), name: name.trim(), password },
      {
        onError: (e: unknown) => {
          if (axios.isAxiosError(e) && e.response?.status === 409) {
            setError(
              'Ya existe una cuenta con ese correo. Si te registraste con Google, usa el botón de Google.',
            );
          } else {
            setError('No pudimos completar el registro. Intenta de nuevo.');
          }
        },
      },
    );
  }, [name, email, password, confirmPassword, registerMutation]);

  return (
    <>
      <ScrollView
        style={themedStyles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Text style={themedStyles.backText}>{'←'} Volver</Text>
        </TouchableOpacity>

        <Text style={themedStyles.title}>Crear cuenta</Text>

        <TextInput
          style={themedStyles.input}
          placeholder="Nombre"
          placeholderTextColor={theme.placeholderTextColor}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          textContentType="name"
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={focusEmail}
        />
        <TextInput
          ref={emailRef}
          style={themedStyles.input}
          placeholder="Correo electrónico"
          placeholderTextColor={theme.placeholderTextColor}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={focusPassword}
        />
        <TextInput
          ref={passwordRef}
          style={themedStyles.input}
          placeholder="Contraseña"
          placeholderTextColor={theme.placeholderTextColor}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="newPassword"
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={focusConfirmPassword}
        />
        <TextInput
          ref={confirmPasswordRef}
          style={themedStyles.input}
          placeholder="Confirmar contraseña"
          placeholderTextColor={theme.placeholderTextColor}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          textContentType="newPassword"
          returnKeyType="go"
          onSubmitEditing={handleRegister}
        />

        <TouchableOpacity
          style={[themedStyles.button, registerMutation.isPending && styles.buttonPending]}
          onPress={handleRegister}
          disabled={registerMutation.isPending}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Spinner visible={registerMutation.isPending} />
      </ScrollView>
    </>
  );
};

const themedStylesFactory = (theme: TournamentTheme) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    backText: {
      fontSize: 15,
      fontWeight: '500',
      color: theme.primaryColor,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 24,
      color: theme.primaryColor,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 8,
      paddingHorizontal: 16,
      marginBottom: 12,
      color: theme.textColor,
      fontSize: 14,
    },
    button: {
      height: 50,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 4,
      backgroundColor: theme.primaryColor,
    },
  });

const styles = StyleSheet.create({
  container: {
    padding: 30,
    paddingTop: 50,
  },
  backButton: {
    marginBottom: 24,
  },
  buttonPending: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
    textTransform: 'uppercase',
  },
  errorText: {
    color: '#c00',
    marginTop: 12,
    textAlign: 'center',
  },
});
