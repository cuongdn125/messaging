import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform, View, Keyboard } from 'react-native';
KeyBroadState.propTypes = {
    layout: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
    }).isRequired,
    children: PropTypes.func.isRequired,
};
const INITIAL_ANIMATION_DURATION = 250;
function KeyBroadState(props) {
    const {layout: {height}} = props;
    const {layout, children} = props;
    const [contentHeight, setContentHeight] = useState(height);
    const [keybroadHeight, setKeyBroadHeight] = useState(0);
    const [keybroadVisible, setKeyBroadVisible] = useState(false);
    const [keybroadWillShow, setKeyBroadWillShow] = useState(false);
    const [keybroadWillHide, setKeyBroadWillHide] = useState(false);
    const [keybroadAnimationDuration, setKeyBroadAnimationDuration] = useState(INITIAL_ANIMATION_DURATION);

    useEffect(() => {
        let subscriptions = [];
        if(Platform.OS === 'ios'){
            subscriptions = [
                Keyboard.addListener('keyboardWillShow', handleKeyboardWillShow),
                Keyboard.addListener('keyboardWillHide', handleKeyboardWillHide),
                Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow),
                Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide),
            ]
        }
        else{
            subscriptions = [
                Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow),
                Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide),
            ]
        }
        return (subscriptions.forEach(subscription => subscription.remove()));
    },[]);

    const handleKeyboardWillShow = event => {
        setKeyBroadWillShow(true);
        measure(event);
    }
    const handleKeyboardDidShow = event => {
        setKeyBroadWillShow(false);
        setKeyBroadVisible(true);
        measure(event);
    }
    const handleKeyboardWillHide = event => {
        setKeyBroadWillHide(true);
        measure(event);
    }
    const handleKeyboardDidHide = () => {
        setKeyBroadWillHide(false);
        setKeyBroadVisible(false);
    }

    const measure = (event) => {
        const {endCoordinates: {height, screenY}, duration = INITIAL_ANIMATION_DURATION} = event;
        setContentHeight(screenY - layout.y);
        setKeyBroadHeight(height);
        setKeyBroadAnimationDuration(duration);
    }
    return children({
        containerHeight: layout.height,
        contentHeight,
        keybroadHeight,
        keybroadVisible,
        keybroadWillShow,
        keybroadWillHide,
        keybroadAnimationDuration
    });
}

export default KeyBroadState;