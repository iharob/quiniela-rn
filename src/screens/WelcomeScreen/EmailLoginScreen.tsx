import { Spinner } from '@app/components/spinner';
import { useEmailLoginMutation } from '@app/hooks/mutations';
import { useTheme } from '@app/theme/ThemeContext';
import axios from 'axios';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

interface Props {
  readonly onBack: () => void;
}

export const EmailLoginScreen: React.FC<Props> = (
  props: Props,
): React.ReactElement => {
  const { onBack } = props;
  const theme = useTheme();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const loginMutation = useEmailLoginMutation();

  const passwordRef = React.useRef<TextInput>(null);

  const focusPassword = React.useCallback(
    (): void => passwordRef.current?.focus(),
    [],
  );

  const handleLogin = React.useCallback(async (): Promise<void> => {
    setError(null);

    if (!email.trim() || !password) {
      setError('Ingrese su correo y contraseña');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('El correo electrónico no es válido');
      return;
    }

    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onError: (e: unknown) => {
          if (axios.isAxiosError(e)) {
            const status = e.response?.status;
            if (status === 401) {
              setError('Correo o contraseña incorrectos');
            } else if (status === 409) {
              setError(
                'Esta cuenta usa Google Sign-In. Usá el botón de Google para iniciar sesión.',
              );
            } else {
              setError(
                'No pudimos iniciar sesión. Intentá de nuevo.',
              );
            }
          } else {
            setError('No pudimos iniciar sesión. Intentá de nuevo.');
          }
        },
      },
    );
  }, [email, password, loginMutation]);

  const inputStyle = React.useMemo(
    (): TextStyle => ({
      height: 50,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 8,
      paddingHorizontal: 16,
      marginBottom: 12,
      color: theme.textColor,
      fontSize: 14,
    }),
    [theme.borderColor, theme.textColor],
  );

  const titleStyle = React.useMemo(
    (): TextStyle => ({
      ...styles.title,
      color: theme.primaryColor,
    }),
    [theme.primaryColor],
  );

  const backTextStyle = React.useMemo(
    (): TextStyle => ({
      ...styles.backText,
      color: theme.primaryColor,
    }),
    [theme.primaryColor],
  );

  const buttonStyle = React.useMemo(
    (): ViewStyle => ({
      ...styles.button,
      backgroundColor: theme.primaryColor,
      opacity: loginMutation.isPending ? 0.5 : 1,
    }),
    [theme.primaryColor, loginMutation.isPending],
  );

  return (
    <>
      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.backgroundColor }]}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={backTextStyle}>{'←'} Volver</Text>
        </TouchableOpacity>

        <Text style={titleStyle}>Iniciar sesi&oacute;n</Text>

        <TextInput
          style={inputStyle}
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
          style={inputStyle}
          placeholder="Contraseña"
          placeholderTextColor={theme.placeholderTextColor}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={handleLogin}
        />

        <TouchableOpacity
          style={buttonStyle}
          onPress={handleLogin}
          disabled={loginMutation.isPending}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Spinner visible={loginMutation.isPending} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    padding: 30,
    paddingTop: 50,
  },
  backButton: {
    marginBottom: 24,
  },
  backText: {
    fontSize: 15,
    fontWeight: '500',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
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
