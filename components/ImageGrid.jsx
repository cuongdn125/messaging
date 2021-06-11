import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image, TouchableOpacity} from 'react-native';
// import CameraRoll from "@react-native-community/cameraroll";
// import * as Permissions from 'expo-permissions';

import * as MediaLibrary from 'expo-media-library';

import Grid from './Grid';
const keyExtractor = ({uri}) => uri;




ImageGrid.propTypes = {
    onPressImage: PropTypes.func,
};

ImageGrid.defaultProps = {
    onPressImage: () =>{},
}

function ImageGrid(props) {
    const { onPressImage} = props;

    let loading = false;
    let cursor = null;

    const [images, setImage] = useState([]);
    

    useEffect(() => {
        async function getImages () {
            const {status } = await MediaLibrary.requestPermissionsAsync();

            if(status !== 'granted') {
                console.log('Camera roll permission denied');
                return;
            }
            const data = await MediaLibrary.getAssetsAsync({
                first: 20, 
                mediaType: 'photo'
            });
            const {assets} = data;
            const x = assets.map(item => JSON.parse(`{"uri": "${item.uri}"}`));
            setImage(x);
        }
        getImages();
            
    },[]);

    const renderItem = ({item: {uri}, size, marginLeft, marginTop}) => {
        const style = {
            width: size,
            height: size,
            marginLeft,
            marginTop,
        }

        return (
            <TouchableOpacity 
                key={uri}
                activeOpacity={0.75}
                onPress={() => {onPressImage(uri)}}
                style={style}
            >
                <Image source={{uri}} style={styles.image} />
            </TouchableOpacity>
        )
    }

    const getNextImages = () => {
        if(!cursor) return;
        getImages(cursor);
    }

    const getImages = async (after) => {
        if(!loading) return;
        loading = true;
        const result = await CameraRoll.getPhotos({first: 20, after});
        const {edges, page_info: {has_next_page, end_cursor}} = result;
        const loadImages = edges.map(item => item.node.image);
        setImage(loadImages, () => {
            loading = false;
            cursor = has_next_page ? end_cursor : null;
        })
    }
    return (
        <Grid 
            data={images}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onEndReached={getNextImages}
        />
    );
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
    }
})

export default ImageGrid;