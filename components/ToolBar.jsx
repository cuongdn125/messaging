import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';

ToolBar.propTypes = {
    isFocused: PropTypes.bool.isRequired,
    onChangeFocused: PropTypes.func,
    onSubmit: PropTypes.func,
    onPressCamera: PropTypes.func,
    onPressLocation: PropTypes.func,
};

ToolBar.defaultProps = {
    onChangeFocused: () => {},
    onSubmit: () => {},
    onPressCamera: () => {},
    onPressLocation: () => {},
}



function ToolBar(props) {
    let input = null;
    const {isFocused, onPressCamera, onPressLocation, onSubmit, onChangeFocused} = props;

    const [text, setText] = useState('');

    const handleChangeText = text => {
        setText(text);
    }

    const handleSubmitEditing = () => {
        if(!text) return;
        onSubmit(text);
        setText('');
    }

    const ToolbarButton = ({title, onPress}) => (
        <TouchableOpacity onPress={onPress} >
            <Text style={styles.button}>{title}</Text>
        </TouchableOpacity>
    )


    const setInputRef = ref => {
        input = ref;
    }

    useEffect(() => {
        if(isFocused)
            input.focus();
        else input.blur();
    },[isFocused]);

    const handleFocus = () => {
        onChangeFocused(true);
    }
    const handleBlur = () => {
        onChangeFocused(false);
    }
    return (
        <View style={styles.toolbar}>
            <ToolbarButton title={'📷'} onPress={onPressCamera}/>
            <ToolbarButton title={'📍'} onPress={onPressLocation} />
            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.input}
                    underlineColorAndroid={'transparent'}
                    placeholder={'Type something'}
                    value={text}
                    onChangeText={handleChangeText}
                    onSubmitEditing={handleSubmitEditing}
                    blurOnSubmit={false}
                    ref={setInputRef}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    toolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        paddingLeft: 16,  
        backgroundColor: 'white',
    },
    button: {
        top: -2,
        marginRight: 12,
        fontSize: 20,
        color: 'gray',
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.04)',
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    input: {
        flex: 1,
        fontSize: 18,
    }
})

export default ToolBar;