import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, FlatList, Image, TouchableOpacity, Text } from 'react-native';
import MapView from 'react-native-maps';

import {MessageShape} from '../utils/MessageUtils';

MessageList.propTypes = {
    messages: PropTypes.arrayOf(MessageShape).isRequired,
    onPressMessage: PropTypes.func,
};

MessageList.defaultProps = {
    onPressMessage: () => {},
}

const keyExtractor = item => item.id.toString();
function MessageList(props) {

    const { messages,  onPressMessage } = props;

    const renderMessageItem = ({item}) => {
        return (
            <View key={item.id } style={styles.messageRow}>
                <TouchableOpacity onPress={() => onPressMessage(item)}>
                    {renderMessageBody(item)}
                </TouchableOpacity>
            </View>
        );
    };

    const renderMessageBody = ({type, text, uri, coordinate}) => {
        switch (type) {
            case 'text':
                return (
                    <View style={styles.messageBuddle}>
                        <Text style={styles.text}>{text}</Text>
                    </View>
                )
            case 'image':
                return (<Image style={styles.image} source={{uri}}/>)
            case 'location':
                return(
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            ...coordinate,
                            latitudeDelta: 0.08,
                            longitudeDelta: 0.04,
                        }}
                    >
                        <MapView.Marker coordinate={coordinate}/>
                    </MapView>
                )
            default:
                return null;
        }
    };

    return (
        <FlatList 
            style={styles.container}
            inverted
            data={messages}
            keyExtractor={keyExtractor}
            renderItem={renderMessageItem}
            keyboardShouldPersistTaps={'handled'}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'visible',
    },
    messageRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 4,
        marginRight: 10,
        marginLeft: 60,
    },
    messageBuddle: {
        backgroundColor: 'rgb(16, 135, 255)',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    map: {
        width: 250,
        height: 250,
        borderRadius: 10,
    },
})

export default MessageList;