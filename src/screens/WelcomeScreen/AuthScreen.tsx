import { EmailLoginScreen } from '@app/screens/WelcomeScreen/EmailLoginScreen';
import { EmailRegisterScreen } from '@app/screens/WelcomeScreen/EmailRegisterScreen';
import { WelcomeScreen } from '@app/screens/WelcomeScreen/index';
import React from 'react';

type AuthView = 'welcome' | 'register' | 'login';

export const AuthScreen: React.FC = (): React.ReactElement => {
  const [view, setView] = React.useState<AuthView>('welcome');

  const navigateToRegister = React.useCallback((): void => setView('register'), []);
  const navigateToLogin = React.useCallback((): void => setView('login'), []);
  const navigateToWelcome = React.useCallback((): void => setView('welcome'), []);

  switch (view) {
    case 'welcome':
      return (
        <WelcomeScreen
          onNavigateToRegister={navigateToRegister}
          onNavigateToLogin={navigateToLogin}
        />
      );
    case 'register':
      return <EmailRegisterScreen onBack={navigateToWelcome} />;
    case 'login':
      return <EmailLoginScreen onBack={navigateToWelcome} />;
  }
};
