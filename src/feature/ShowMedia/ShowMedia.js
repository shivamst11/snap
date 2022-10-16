import {useFocusEffect} from '@react-navigation/native';
import React, {useMemo, useCallback, useState} from 'react';
import {View, StyleSheet, SafeAreaView, Image, Alert} from 'react-native';
import {ASYNC_KEYS, URL} from '../../utility/constant';
import {getAsync, removeAsync, setAsync} from '../../utility/AsyncStorageUtil';
import colorCodes from '../../utility/GlobalStyles';
import ImageList from './ImageList';
import ImageMethod from './ImageMethod';
import {callRemoteMethod} from '../../utility/WebserviceHandler';
import {observer} from 'mobx-react-lite';
import {Store} from '../../store/Stores';
import CustomLoader from '../../reusable/CustomLoader';
var RNFS = require('react-native-fs');

const ShowMedia = ({navigation}) => {
  const [imageList, setImageList] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadIndex, setUploadIndex] = useState(null);
  const {uploadPercentageValue, updateUploaderVisibility, uploaderIsVisible} =
    Store().UploadStore;

  const onPress = useCallback(
    async item => {
      if (item.method === 'capture') {
        navigation.navigate('CapturePhoto', {
          method: 'capture',
        });
      } else if (item.method === 'replace') {
        replace();
      } else if (item.method === 'delete') {
        deletePhoto();
      } else if (item.method === 'upload') {
        uploadPhotos(1);
      }
    },
    [imageList?.length, imagePreview?.name],
  );

  const replace = async () => {
    if (imagePreview.name) {
      navigation.navigate('CapturePhoto', {
        method: 'replace',
        imageName: imagePreview.name,
      });
    }
  };

  const deletePhoto = async () => {
    if (imagePreview.name) {
      const list = await getAsync(ASYNC_KEYS.IMAGE_PATH_LIST, true);
      const updateList = list?.filter(file => file.name !== imagePreview?.name);
      //updating the list in async storage after removing from selected one from array
      await setAsync(ASYNC_KEYS.IMAGE_PATH_LIST, updateList);
      getImageList();
    }
  };

  const uploadPhotos = async index => {
    updateUploaderVisibility(true);
    setUploadIndex(index);
    const fileBody = new FormData();
    fileBody.append('file', {
      name: imageList[index - 1].name,
      uri: imageList[index - 1].path,
      type: `image/type`,
    });
    //uploading photo on server
    const response = await callRemoteMethod(
      `${URL.UPLOAD_PHOTO}/${index}`,
      'POST',
      fileBody,
    );
    if (response) {
      updateUploaderVisibility(false);
      //recursion for sequence upload
      if (index < imageList.length) {
        uploadPhotos(index + 1);
      } else {
        //once all photo is uploaded on server removing all file from folder  clean the async storage and local state

        RNFS.unlink(RNFS.CachesDirectoryPath).then(() => {
          setImagePreview(null);
          setImageList([]);
          removeAsync(ASYNC_KEYS.IMAGE_PATH_LIST);
        });
      }
    } else {
      Alert.alert('Upload Failed');
    }
  };

  useFocusEffect(
    useCallback(() => {
      getImageList();
    }, []),
  );

  const getImageList = async () => {
    const list = await getAsync(ASYNC_KEYS.IMAGE_PATH_LIST, true);
    if (list) {
      setImagePreview(list[0]);
      setImageList(list);
    }
  };

  const onSelectImage = item => {
    setImagePreview(item);
  };

  const imagePath = useMemo(
    () => ({
      uri: imagePreview?.path,
    }),
    [imagePreview?.path],
  );

  return (
    <View style={styles.container}>
      <Image source={imagePath} style={styles.imagePreview} />
      <ImageList
        list={imageList}
        onSelectImage={onSelectImage}
        selectedImage={imagePreview}
      />
      <ImageMethod onPress={onPress} listLength={imageList?.length} />
      {/* custom loader to show upload percentage */}
      <CustomLoader
        show={uploaderIsVisible}
        uploadPercentage={uploadPercentageValue}
        uploadNum={uploadIndex}
        totalUploadNum={imageList.length}
      />
      <SafeAreaView />
    </View>
  );
};
const styles = StyleSheet.create({
  imagePreview: {flex: 1, margin: 10},
  container: {
    flex: 1,
    backgroundColor: colorCodes.white,
  },
});
export default observer(ShowMedia);
