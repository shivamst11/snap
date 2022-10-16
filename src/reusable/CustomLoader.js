import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {MaterialIndicator} from 'react-native-indicators';
import colorCodes from '../utility/GlobalStyles';
function CustomLoader(props) {
  return props.show ? (
    <View style={[styles.loaderView, StyleSheet.absoluteFill]}>
      <View style={styles.loaderContainer}>
        <MaterialIndicator
          size={94}
          trackWidth={12}
          color={colorCodes.themeBlue}
        />
        <Text style={styles.percentage}>{props.uploadPercentage}%</Text>
      </View>
      <View>
        {props.uploadNum ? (
          <Text style={styles.imageNum}>
            {props.uploadNum}/{props.totalUploadNum}
          </Text>
        ) : null}
      </View>
    </View>
  ) : (
    <View />
  );
}

const styles = StyleSheet.create({
  loaderView: {
    backgroundColor: colorCodes.clearBlack,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loaderContainer: {
    height: 80,
    width: 80,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorCodes.white,
    borderRadius: 50,
  },
  percentage: {
    fontSize: 20,
    fontWeight: '500',
    position: 'absolute',
    color: colorCodes.black,
  },
  imageNum: {
    fontSize: 20,
    fontWeight: '500',
    color: colorCodes.black,
    backgroundColor: colorCodes.themeBlue,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
  },
});

export default CustomLoader;
