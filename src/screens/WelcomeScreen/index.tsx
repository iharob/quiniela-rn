import { GoogleGLogo } from '@app/components/googleGLogo';
import { Spinner } from '@app/components/spinner';
import { logoHeight, logoWidth } from '@app/constants';
import { useGoogleAuthMutation } from '@app/hooks/mutations';
import { useThemedStyles } from '@app/theme/useThemedStyles';
import { TournamentTheme } from '@app/types/tournamentConfig';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface WelcomeScreenProps {
  readonly onNavigateToRegister: () => void;
  readonly onNavigateToLogin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = (
  props: WelcomeScreenProps,
): React.ReactElement => {
  const { onNavigateToRegister, onNavigateToLogin } = props;
  const themedStyles = useThemedStyles(themedStylesFactory);

  const [error, setError] = React.useState<string | null>(null);

  const googleAuthMutation = useGoogleAuthMutation();

  const handleGoogleSignIn = React.useCallback(async (): Promise<void> => {
    setError(null);
    console.info('[GoogleSignIn] start');
    try {
      console.info('[GoogleSignIn] checking Play Services');
      const hasPlay = await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      console.info(`[GoogleSignIn] Play Services available: ${hasPlay}`);

      console.info('[GoogleSignIn] calling signIn()');
      const signInResponse = await GoogleSignin.signIn();
      if (signInResponse.type === 'success') {
        const userInfo = signInResponse.data;
        const name = userInfo.user?.email ?? 'unknown';
        const hasToken = !!userInfo.idToken;

        console.info(
          `[GoogleSignIn] signIn() ok — user=${name} hasIdToken=${hasToken}`,
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
        googleAuthMutation.mutate(idToken, {
          onSuccess: () => {
            console.info('[GoogleSignIn] session established');
          },
          onError: (e: unknown) => {
            const err = e as { code?: string; message?: string; name?: string };
            setError(
              `No pudimos iniciar sesión con Google${
                err.code ? ` (code ${err.code})` : ''
              }`,
            );
          },
        });
      }
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string; name?: string };
      const code = err.code;
      console.warn(
        `[GoogleSignIn] error code=${code ?? 'n/a'} name=${
          err.name ?? 'n/a'
        } message=${err.message ?? String(e)}`,
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
      setError(
        `No pudimos iniciar sesión con Google${code ? ` (code ${code})` : ''}`,
      );
    }
  }, [googleAuthMutation]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('@app/images/logo.png')}
            style={styles.fullscreenLogo}
          />
          <Text style={styles.tournamentName}>Quiniela Mundial 2026</Text>
        </View>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          disabled={googleAuthMutation.isPending}
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
          <View style={themedStyles.dividerLine} />
          <Text style={themedStyles.dividerText}>o</Text>
          <View style={themedStyles.dividerLine} />
        </View>
        <TouchableOpacity onPress={onNavigateToRegister} activeOpacity={0.7}>
          <Text style={themedStyles.linkText}>Registrarse con email</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNavigateToLogin} activeOpacity={0.7}>
          <Text style={themedStyles.linkText}>Ya tengo cuenta</Text>
        </TouchableOpacity>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Spinner visible={googleAuthMutation.isPending} />
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
    marginLeft: 'auto',
    marginRight: 'auto',
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
  errorText: {
    color: '#c00',
    marginTop: 12,
    textAlign: 'center',
  },
});

const themedStylesFactory = (theme: TournamentTheme) =>
  StyleSheet.create({
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.borderColor,
    },
    dividerText: {
      marginHorizontal: 12,
      fontSize: 13,
      opacity: 0.5,
      color: theme.textColor,
    },
    linkText: {
      fontSize: 14,
      fontWeight: '500',
      marginVertical: 6,
      color: theme.primaryColor,
    },
  });
