import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Platform, View} from 'react-native';
import Constants from 'expo-constants';

MeasureLayout.propTypes = {
    children: PropTypes.func.isRequired,
};

function MeasureLayout(props) {
    const { children } = props;
    const [layout, setLayout] = useState(null);

    const handleLayout = event => {
        const {nativeEvent: {layout}} = event;
        setLayout({...layout, 
            y: layout.y + (Platform.OS==='android' ? Constants.statusBarHeight : 0)});

    }
    if(!layout)
        return(
            <View style={styles.container} onLayout={handleLayout}/>
        )
    return children(layout);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default MeasureLayout;