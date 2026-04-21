import { useThemedStyles } from '@app/theme/useThemedStyles';
import { TournamentTheme } from '@app/types/tournamentConfig';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

interface Message {
  readonly id: string;
  readonly text: string;
  readonly userId: number;
  readonly userName: string;
  readonly timestamp: number;
}

export const Chat: React.FC = (): React.ReactElement => {
  const themedStyles = useThemedStyles(themedStylesFactory);
  const [message, setMessage] = React.useState('');
  const [messages] = React.useState<readonly Message[]>([]);

  const handleSend = React.useCallback((): void => {
    if (message.trim().length === 0) {
      return;
    }
    setMessage('');
  }, [message]);

  const renderItem = React.useCallback((): React.ReactElement => {
    return <View />;
  }, []);

  const keyExtractor = React.useCallback((item: Message): string => item.id, []);

  return (
    <KeyboardAvoidingView
      style={themedStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={themedStyles.messageList}
        inverted={messages.length > 0}
      />
      <View style={themedStyles.inputRow}>
        <TextInput
          style={themedStyles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={themedStyles.placeholder.color}
          multiline
          maxLength={500}
        />
        <Pressable style={themedStyles.sendButton} onPress={handleSend}>
          <FontAwesomeIcon icon={faPaperPlane} color={themedStyles.sendIcon.color} size={18} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const themedStylesFactory = (theme: TournamentTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    messageList: {
      flex: 1,
      paddingHorizontal: 12,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      padding: 8,
      backgroundColor: theme.backgroundColor,
    },
    input: {
      flex: 1,
      minHeight: 40,
      maxHeight: 100,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: '#fff',
      color: theme.textColor,
      fontSize: 15,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 8,
    },
    placeholder: {
      color: theme.placeholderTextColor,
    },
    sendIcon: {
      color: theme.primaryColor,
    },
  });
