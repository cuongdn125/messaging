import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {BackHandler, LayoutAnimation, Platform, UIManager, View} from 'react-native';
import {isIphoneX } from 'react-native-iphone-x-helper';


if(Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental){
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const INPUT_METHOD = {
    NONE: 'NONE',
    KEYBOARD: 'KEYBOARD',
    CUSTOM: 'CUSTOM',
} 

MessagingContainer.propTypes = {
    containerHeight: PropTypes.number.isRequired,
    contentHeight: PropTypes.number.isRequired,
    keybroadHeight: PropTypes.number.isRequired,
    keybroadVisible: PropTypes.bool.isRequired,
    keybroadWillShow: PropTypes.bool.isRequired,
    keybroadWillHide: PropTypes.bool.isRequired,
    keybroadAnimationDuration: PropTypes.number.isRequired,

    inputMethod: PropTypes.oneOf(Object.values(INPUT_METHOD)).isRequired,
    onChangeInputMethod: PropTypes.func,

    children: PropTypes.node,
    renderInputMethodEditor: PropTypes.func.isRequired,
};

MessagingContainer.defaultProps = {
    children: null,
    onChangeInputMethod: () => {},
}

function MessagingContainer(props) {
    const {
        containerHeight,
        contentHeight,
        keybroadHeight,
        keybroadVisible,
        keybroadWillShow,
        keybroadWillHide,
        keybroadAnimationDuration,
        inputMethod,
        children,
        renderInputMethodEditor,
        onChangeInputMethod
    } = props;
    

    useEffect(() => {
        if(keybroadVisible){
            onChangeInputMethod(INPUT_METHOD.KEYBOARD);
        }
        else if(!keybroadVisible && inputMethod !== INPUT_METHOD.CUSTOM){
            onChangeInputMethod(INPUT_METHOD.NONE);
        }

        const animation = LayoutAnimation.create(
            keybroadAnimationDuration,
            Platform.OS === 'android' ? LayoutAnimation.Types.easeInEaseOut : LayoutAnimation.Types.keyboard,
            LayoutAnimation.Properties.opacity
        );
        LayoutAnimation.configureNext(animation);
    },[props]);
    useEffect(() => {
        const subscriptions = BackHandler.addEventListener('hardwareBackPress', () => {
            if(inputMethod === INPUT_METHOD.CUSTOM) {
                onChangeInputMethod(INPUT_METHOD.NONE);
                return true;
            }
            return false;
        })
        return(() => subscriptions.remove());
    },[]);


    

    const useContentHeight = keybroadWillShow || inputMethod === INPUT_METHOD.KEYBOARD;
    const containerStyle = {
        height: useContentHeight ? contentHeight : containerHeight,
    }
    const showCustomInput = inputMethod === INPUT_METHOD.CUSTOM && !keybroadWillShow;

    const keybroadIsHidden = inputMethod === INPUT_METHOD.NONE && !keybroadWillShow;
    const keybroadIsHiding = inputMethod === INPUT_METHOD.KEYBOARD && keybroadWillHide;

    const inputStyle = {
        height: showCustomInput ? keybroadHeight || 250 : 0,
        marginTop: isIphoneX() && (keybroadIsHidden || keybroadIsHiding) ? 24 : 0,
    }

    
    return (
        <View style={containerStyle}>
            {children}
            <View style={inputStyle}>{renderInputMethodEditor()}</View>
        </View>
    );
}

export default MessagingContainer;