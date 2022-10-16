import React from 'react';
import {View, StyleSheet, Image, FlatList} from 'react-native';
import CustomButton from '../../reusable/CustomButton';
import colorCodes from '../../utility/GlobalStyles';
const ImageList = ({list, onSelectImage, selectedImage}) => {
  const onPressImageCard = item => {
    onSelectImage(item);
  };

  const imageCard = item => {
    return (
      <CustomButton
        onPress={() => onPressImageCard(item)}
        style={styles.cardCont}>
        <Image
          source={{uri: item.path}}
          style={[
            styles.cardImg,
            item.name === selectedImage?.name ? styles.selectedImg : null,
          ]}
        />
      </CustomButton>
    );
  };
  return (
    <View style={styles.listCont}>
      <FlatList
        data={list}
        keyExtractor={item => item.name}
        horizontal
        renderItem={({item}) => imageCard(item)}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  listCont: {
    marginVertical: 10,
  },
  cardImg: {
    height: 100,
    width: 100,
  },
  selectedImg: {
    borderWidth: 5,
    borderColor: colorCodes.red,
  },
  cardCont: {
    marginHorizontal: 10,
    height: 100,
    width: 100,
  },
});
export default ImageList;
