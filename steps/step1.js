import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {StreamChat} from 'stream-chat';
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  OverlayProvider as ChatOverlayProvider,
} from 'stream-chat-react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const userToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoicm9uIn0.eRVjxLvd4aqCEHY_JRa97g6k7WpHEhxL7Z4K4yTot1c';

const user = {
  id: 'ron',
};

const chatClient = StreamChat.getInstance('q95x9hkbyd6p');
const connectUserPromise = chatClient.connectUser(user, userToken);

const channel = chatClient.channel('messaging', 'channel_id');

const ChannelScreen = () => {
  const {bottom} = useSafeAreaInsets();

  return (
    <ChatOverlayProvider bottomInset={bottom} topInset={0}>
      <SafeAreaView>
        <Chat client={chatClient}>
          {/* Setting keyboardVerticalOffset as 0, since we don't have any header yet */}
          <Channel channel={channel} keyboardVerticalOffset={0}>
            <View style={StyleSheet.absoluteFill}>
              <MessageList />
              <MessageInput />
            </View>
          </Channel>
        </Chat>
      </SafeAreaView>
    </ChatOverlayProvider>
  );
};

export default function App() {
  const [ready, setReady] = useState();

  useEffect(() => {
    const initChat = async () => {
      await connectUserPromise;
      await channel.watch();
      setReady(true);
    };

    initChat();
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ChannelScreen channel={channel} />
    </SafeAreaProvider>
  );
}
