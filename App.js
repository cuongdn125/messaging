import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { StyleSheet, Text, View, Alert, Image, TouchableHighlight, BackHandler } from 'react-native';

import Status from './components/Status';
import MessageList from './components/MessageList';
import ToolBar from './components/ToolBar';
import ImageGrid from './components/ImageGrid';

import * as Location from 'expo-location';

import { createTextMessage, createImageMessage, createLocationMessage} from './utils/MessageUtils';

import MeasureLayout from './components/MeasureLayout';
import KeyBroadState from './components/KeyBroadState';
import MessagingContainer, {INPUT_METHOD} from './components/MessagingContainer';

export default function App() {

  const [messages, setMessages] = useState([
    createImageMessage('https://unsplash.it/300/300'),
    createTextMessage('Cuong'),
    createTextMessage('Dang'),
    createLocationMessage({
      latitude: 37.78825,
      longitude: -122.4324,
    })
  ]);

  const [inputMethod, setInputMethod] = useState(INPUT_METHOD.NONE);

  const handleChangeInputMethod = (inputMethod) => {
    setInputMethod(inputMethod);
  }

  const [fullscreenImageId, setFullscreenImageId] = useState(null);

  const dismissFullsreenImage = () => {
    setFullscreenImageId(null);
  }

  const backAction = () => {
    if(fullscreenImageId){
      dismissFullsreenImage();
      return true;
    }
    return false;
  }

  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleChangeFocused = isFocused => {
    setIsInputFocused(isFocused);
  }

  const handleSubmit = text => {
    const newMessages = [createTextMessage(text), ...messages];
    setMessages(newMessages);
  }
  
  const handlePressToolbarCamera = () => {
    setIsInputFocused(false);
    setInputMethod(INPUT_METHOD.CUSTOM);
  }
  const handlePressToolbarLocation = () => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { coords: {latitude, longitude}} = location;
      setMessages([
        createLocationMessage({ latitude, longitude}),
        ...messages,
      ]);
    })();
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  })
  

  const handlePressMessage = ({id, type}) => {
    switch (type) {
      case 'text':
        Alert.alert(
          'Delete message?',
          'Are you sure you want to permanently delete this message?',
          [
            {
              text: 'Cancel',
              type: 'cancel',
            },
            {
              text: 'Delete',
              type: 'destructive',
              onPress: () => {
                const newMessages = messages.filter(message => message.id !== id);
                setMessages(newMessages);
              },
            },
          ],
        );
        break;
      case 'image':
        setFullscreenImageId(id);
        setIsInputFocused(false);
        break;
      default:
        break;
    }
  };


  const renderListMessage = () => (
    <View style={styles.content}>
      <MessageList messages={messages} onPressMessage={handlePressMessage} />
    </View>
  )

  const handlePressImage = uri => {
    setMessages([createImageMessage(uri), ...messages]);
  }
  const renderInputMessage = () => (
    <View style={styles.inputMessage}>
      <ImageGrid  onPressImage={handlePressImage}/>
    </View>
  )
  const renderToolBar = () => (
    <View style={styles.toolBar}>
      <ToolBar 
        isFocused={isInputFocused}
        onSubmit={handleSubmit}
        onChangeFocused={handleChangeFocused}
        onPressCamera={handlePressToolbarCamera}
        onPressLocation={handlePressToolbarLocation}
      />
    </View>
  )

  const renderFullscreenImage = () => {
    if(!fullscreenImageId) return null;
    const image = messages.find(message => message.id === fullscreenImageId);
    if(!image) return null;
    const {uri} = image;
    return (
      <TouchableHighlight style={styles.fullscreenOverlay} onPress={dismissFullsreenImage}>
        <Image style={styles.fullscreenIamge} source={{uri}} />
      </TouchableHighlight>
    )
  }
  return (
    <View style={styles.container}>
      <Status />
      <MeasureLayout>
        {layout => (
          <KeyBroadState layout={layout}>
            {keyboardInfo =>(
              <MessagingContainer 
                {...keyboardInfo} 
                inputMethod={inputMethod} 
                onChangeInputMethod={handleChangeInputMethod} 
                renderInputMethodEditor={renderInputMessage}
              >
                {renderListMessage()}
                {renderToolBar()}
              </MessagingContainer>
            )}
          </KeyBroadState>
        )}
      </MeasureLayout>
      
      {renderFullscreenImage()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputMessage: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolBar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'white',
  },
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 2,
  },
  fullscreenIamge: {
    flex: 1,
    resizeMode: 'contain',
  }
});
