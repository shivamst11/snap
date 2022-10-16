import AsyncStorage from '@react-native-async-storage/async-storage';

export const setAsync = async function (key, data) {
  try {
    if (typeof data !== 'string') {
      data = JSON.stringify(data);
    }
    await AsyncStorage.setItem(key, data);
  } catch (error) {
    console.warn('Async Error set error', error);
  }
};

export const getAsync = async function (key, isParsed = false) {
  try {
    let data = await AsyncStorage.getItem(key);
    if (data && isParsed) {
      data = JSON.parse(data);
    }
    return data;
  } catch (error) {
    console.warn('Async Error get error', error);
  }
};

export const removeAsync = async function (key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn('Async Error remove error', error);
  }
};

export const clearAsync = async function () {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.warn('Async clear remove error', error);
  }
};
