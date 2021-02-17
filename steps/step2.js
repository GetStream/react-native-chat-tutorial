/* eslint-disable react/display-name */
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {LogBox, SafeAreaView, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, useHeaderHeight} from '@react-navigation/stack';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {StreamChat} from 'stream-chat';
import {
  Channel,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  OverlayProvider,
  useAttachmentPickerContext,
} from 'stream-chat-react-native';

LogBox.ignoreAllLogs(true);

const chatClient = StreamChat.getInstance('q95x9hkbyd6p');
const userToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoicm9uIn0.eRVjxLvd4aqCEHY_JRa97g6k7WpHEhxL7Z4K4yTot1c';
const user = {
  id: 'ron',
};

const filters = {
  example: 'example-apps',
  members: {$in: ['ron']},
  type: 'messaging',
};

const sort = {last_message_at: -1};

const ChannelListScreen = ({navigation}) => {
  const {setChannel} = useContext(AppContext);

  const memoizedFilters = useMemo(() => filters, []);

  return (
    <Chat client={chatClient}>
      <View style={StyleSheet.absoluteFill}>
        <ChannelList
          filters={memoizedFilters}
          onSelect={(channel) => {
            setChannel(channel);
            navigation.navigate('Channel');
          }}
          sort={sort}
        />
      </View>
    </Chat>
  );
};

const ChannelScreen = ({navigation}) => {
  const {channel} = useContext(AppContext);
  const headerHeight = useHeaderHeight();
  const {setTopInset} = useAttachmentPickerContext();

  useEffect(() => {
    setTopInset(headerHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerHeight]);

  return (
    <SafeAreaView>
      <Chat client={chatClient}>
        <Channel channel={channel} keyboardVerticalOffset={headerHeight}>
          <View style={StyleSheet.absoluteFill}>
            <MessageList />
            <MessageInput />
          </View>
        </Channel>
      </Chat>
    </SafeAreaView>
  );
};

const Stack = createStackNavigator();

const AppContext = React.createContext();

const App = () => {
  const {bottom} = useSafeAreaInsets();

  const [channel, setChannel] = useState();
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    const setupClient = async () => {
      await chatClient.connectUser(user, userToken);

      setClientReady(true);
    };

    setupClient();
  }, []);

  return (
    <NavigationContainer>
      <AppContext.Provider value={{channel, setChannel}}>
        <OverlayProvider bottomInset={bottom}>
          {clientReady && (
            <Stack.Navigator
              initialRouteName="ChannelList"
              screenOptions={{
                headerTitleStyle: {alignSelf: 'center', fontWeight: 'bold'},
              }}>
              <Stack.Screen
                component={ChannelScreen}
                name="Channel"
                options={() => ({
                  headerBackTitle: 'Back',
                  headerRight: () => <></>,
                  headerTitle: channel?.data?.name,
                })}
              />
              <Stack.Screen
                component={ChannelListScreen}
                name="ChannelList"
                options={{headerTitle: 'Channel List'}}
              />
            </Stack.Navigator>
          )}
        </OverlayProvider>
      </AppContext.Provider>
    </NavigationContainer>
  );
};

export default () => {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
};
