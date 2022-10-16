import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import CapturePhoto from '../feature/CapturePhoto';
import ShowMedia from '../feature/ShowMedia';

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen name={'ShowMedia'} component={ShowMedia} />
      <Stack.Screen name={'CapturePhoto'} component={CapturePhoto} />
    </Stack.Navigator>
  );
};

export default AppStack;
