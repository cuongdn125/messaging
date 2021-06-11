import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, FlatList, Dimensions, PixelRatio} from 'react-native';

Grid.propTypes = {
    renderItem: PropTypes.func.isRequired,
    numColumns: PropTypes.number,
    itemMargin: PropTypes.number,
};

Grid.defaultProps = {
    numColumns: 4,
    itemMargin: StyleSheet.hairlineWidth,
}



function Grid(props) {
    const { renderItem, numColumns, itemMargin } = props;

    const renderGridItem = Info => {

        const {index} = Info;
        const {width} = Dimensions.get('window');

        const size = PixelRatio.roundToNearestPixel((width - itemMargin*(numColumns-1))/numColumns);
        const marginLeft = index % numColumns === 0 ? 0 : itemMargin;

        const marginTop = index < numColumns ? 0 : itemMargin;
        return renderItem({...Info, size, marginLeft, marginTop});
    }

    return (
        <FlatList {...props} renderItem={renderGridItem} />
    );
}

export default Grid;