import React, { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import {View, Platform, StatusBar, StyleSheet, Text } from'react-native';
import NetInfo from '@react-native-community/netinfo';

function Status(props) {

    const [info, setInfo] = useState('none');
    const isConnected = info !== 'none';

    const backgroundColor = isConnected ? 'white' : 'red';

    
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setInfo(state.type); 
        });
        return unsubscribe;
    },[info]);
    const statusBar = (
        <StatusBar 
            backgroundColor={backgroundColor}
            barStyle={isConnected ? 'dark-content' : 'light-content'}
            animated={false}
        />
    )
    const messageContainer = (
        <View style={styles.messageContainer} pointerEvents={'none'}>
            {statusBar}
            {!isConnected && (
                <View style={styles.buddle}>
                    <Text style={styles.text}>No network connection</Text>
                </View>
            )}
        </View>
    )
    if(Platform.OS === 'ios'){
        return <View style={[styles.status, {backgroundColor}]}>{messageContainer}</View>
    }
    return messageContainer;
}
const statusHeight = (Platform.OS === 'ios' ? Constants.statusBarHeight : 0)

const styles = StyleSheet.create({
    status: {
        zIndex: 1,
        height: statusHeight,
    },
    messageContainer: {
        zIndex: 1,
        position: 'absolute',
        top: statusHeight + 20,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    buddle: {
        paddingHorizontal: 20,
        backgroundColor: 'red',
        paddingVertical: 10,
        borderRadius: 20,
    },
    text: {
        color: 'white',
    }
})

export default Status;