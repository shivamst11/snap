import React from 'react';
import {TouchableOpacity} from 'react-native';

const CustomButton = ({...props}) => {
  return (
    <TouchableOpacity accessible activeOpacity={0.8} {...props}>
      {props.children}
    </TouchableOpacity>
  );
};
export default CustomButton;
