import { GoogleGLogo } from '@app/components/googleGLogo';
import { Spinner } from '@app/components/spinner';
import { barStyleDarkContent, logoHeight, logoWidth } from '@app/constants';
import { Api, useApi } from '@app/context/api';
import { useSessionStore } from '@app/mobx/sessionStore';
import { useTournamentConfig } from '@app/mobx/tournamentConfigStore';
import { useTheme } from '@app/theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import React from 'react';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface WelcomeScreenProps {
  readonly onNavigateToRegister: () => void;
  readonly onNavigateToLogin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = (
  props: WelcomeScreenProps,
): React.ReactElement => {
  const { onNavigateToRegister, onNavigateToLogin } = props;
  const theme = useTheme();
  const api = useApi();
  const sessionStore = useSessionStore();
  const tournamentConfigStore = useTournamentConfig();
  const tournamentName = tournamentConfigStore.config.name;

  const [processing, setProcessing] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleGoogleSignIn = React.useCallback(async (): Promise<void> => {
    setProcessing(true);
    setError(null);
    console.info('[GoogleSignIn] start');
    try {
      console.info('[GoogleSignIn] checking Play Services');
      const hasPlay = await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      console.info(`[GoogleSignIn] Play Services available: ${hasPlay}`);

      console.info('[GoogleSignIn] calling signIn()');
      const userInfo = await GoogleSignin.signIn();
      console.info(
        `[GoogleSignIn] signIn() ok — user=${
          userInfo.user?.email ?? 'unknown'
        } hasIdToken=${!!userInfo.idToken}`,
      );

      const idToken = userInfo.idToken;
      if (!idToken) {
        console.warn(
          '[GoogleSignIn] signIn returned no idToken — check webClientId matches a Web OAuth client',
        );
        setError('No se pudo obtener el token de Google');
        return;
      }

      console.info('[GoogleSignIn] exchanging idToken with backend');
      const session = await api.googleAuth(idToken);
      api.setBearerToken(session.token);
      await AsyncStorage.setItem(Api.BEARER_TOKEN_KEY, session.token);
      sessionStore.setSession(session);
      console.info('[GoogleSignIn] session established');
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string; name?: string };
      const code = err.code;
      console.warn(
        `[GoogleSignIn] error code=${code ?? 'n/a'} name=${err.name ?? 'n/a'} message=${
          err.message ?? String(e)
        }`,
      );
      if (code === statusCodes.SIGN_IN_CANCELLED) {
        console.info('[GoogleSignIn] user cancelled');
        return;
      }
      if (code === statusCodes.IN_PROGRESS) {
        console.info('[GoogleSignIn] sign-in already in progress');
        return;
      }
      if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError('Google Play Services no está disponible');
        return;
      }

      if (code === '10') {
        setError(
          'Error de configuración de Google (DEVELOPER_ERROR): revisa SHA-1, package name y google-services.json',
        );
        return;
      }
      setError(`No pudimos iniciar sesión con Google${code ? ` (code ${code})` : ''}`);
    } finally {
      setProcessing(false);
    }
  }, [api, sessionStore]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('@app/images/logo.png')} style={styles.fullscreenLogo} />
          <Text style={[styles.tournamentName, { color: theme.primaryColor }]}>
            {tournamentName}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          disabled={processing}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Iniciar sesión con Google"
        >
          <View style={styles.googleIconWrap}>
            <GoogleGLogo />
          </View>
          <Text style={styles.googleButtonText}>Iniciar sesión con Google</Text>
        </TouchableOpacity>
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: theme.borderColor }]} />
          <Text style={[styles.dividerText, { color: theme.textColor }]}>o</Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.borderColor }]} />
        </View>
        <TouchableOpacity onPress={onNavigateToRegister} activeOpacity={0.7}>
          <Text style={[styles.linkText, { color: theme.primaryColor }]}>
            Registrarse con email
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNavigateToLogin} activeOpacity={0.7}>
          <Text style={[styles.linkText, { color: theme.primaryColor }]}>Ya tengo cuenta</Text>
        </TouchableOpacity>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Spinner visible={processing} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: 30,
  },
  logoContainer: {
    flex: 1,
    paddingVertical: 100,
  },
  fullscreenLogo: {
    height: logoHeight,
    width: logoWidth,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#747775',
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 60,
    marginBottom: 8,
  },
  googleIconWrap: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleButtonText: {
    color: '#1F1F1F',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
    letterSpacing: 0.25,
  },
  tournamentName: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 16,
    textTransform: 'uppercase',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    opacity: 0.3,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    opacity: 0.5,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
    marginVertical: 6,
  },
  errorText: {
    color: '#c00',
    marginTop: 12,
    textAlign: 'center',
  },
});
