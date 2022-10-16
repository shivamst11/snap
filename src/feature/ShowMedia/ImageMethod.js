import React, {memo} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import CustomButton from '../../reusable/CustomButton';
import colorCodes from '../../utility/GlobalStyles';
const BUTTON_LIST = [
  {id: 1, method: 'capture', label: 'C'},
  {id: 2, method: 'replace', label: 'R'},
  {id: 3, method: 'delete', label: 'D'},
  {id: 4, method: 'upload', label: 'U'},
];

const ImageMethod = ({onPress, listLength}) => {
  const buttonCard = item => {
    if (item.id !== 1 && (listLength === '0' || !listLength)) {
      return;
    }
    return (
      <CustomButton
        key={item.id}
        onPress={() => onPress(item)}
        style={styles.btnCont}>
        <Text style={styles.btnLabel}>{item.label}</Text>
      </CustomButton>
    );
  };

  return (
    <View style={styles.container}>
      {BUTTON_LIST.map(item => buttonCard(item))}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  btnCont: {
    height: 70,
    width: 70,
    borderRadius: 10,
    backgroundColor: colorCodes.themeBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  btnLabel: {
    fontSize: 30,
    color: colorCodes.white,
  },
});
export default memo(ImageMethod);
