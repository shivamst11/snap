import moment from 'moment';
import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  View,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Image,
  Alert,
  Text,
} from 'react-native';
import {useCameraDevices, Camera} from 'react-native-vision-camera';
import {ASYNC_KEYS} from '../../utility/constant';
import {getAsync, setAsync} from '../../utility/AsyncStorageUtil';
import colorCodes from '../../utility/GlobalStyles';
import ImagePath from '../../utility/ImagePath';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';

//camera take photo option
const takePhotoOptions = {
  photoCodec: 'jpeg',
  qualityPrioritization: 'speed',
  skipMetadata: true,
  quality: 80,
};

//accelerometer time interval in millisecond
setUpdateIntervalForType(SensorTypes.accelerometer, 500);
const CapturePhoto = ({navigation, route}) => {
  //camera selection
  const devices = useCameraDevices('wide-angle-camera');
  const device = devices.back;
  const {method, imageName} = route.params;

  const [cameraPermission, setCameraPermission] = useState();
  const [imageList, setImageList] = useState(null);
  const [disableSnap, setDisableSnap] = useState(false);
  const cameraRef = useRef();
  const isPositionCorrect = useRef(false);
  const [phonePosition, setPhonePosition] = useState({x: 0, y: 0, z: 0});
  var subscription;

  //camera permission
  const requestCameraPermission = async () => {
    const permission = await Camera.requestCameraPermission();
    if (permission === 'denied') await Linking.openSettings();
  };

  //checking phone position
  const checkPhonePosition = () => {
    subscription = accelerometer.subscribe(({x, y, z}) => {
      setPhonePosition({x, y, z});
      if (
        ((x > 2 || x < -2) && (z > 2 || z < -2)) ||
        ((y > 2 || y < -2) && (z > 2 || z < -2))
      ) {
        isPositionCorrect.current = false;
      } else {
        isPositionCorrect.current = true;
      }
    });
  };

  useEffect(() => {
    checkPhonePosition();
    requestCameraPermission();
    fetchRecentPhoto();
    Camera.getCameraPermissionStatus().then(setCameraPermission);
    return () => subscription?.unsubscribe();
  }, []);

  //retrieving image path of array from async storage
  const fetchRecentPhoto = async () => {
    const list = await getAsync(ASYNC_KEYS.IMAGE_PATH_LIST, true);
    if (list) {
      setImageList(list);
    }
  };

  const onPressSnap = async () => {
    //checking phone position
    if (isPositionCorrect.current) {
      try {
        if (cameraRef.current == null) throw new Error('Camera ref is null!');
        setDisableSnap(true);
        //takeing picture
        const photo = await cameraRef.current.takePhoto(takePhotoOptions);
        if (photo?.path) {
          const list = await getAsync(ASYNC_KEYS.IMAGE_PATH_LIST, true);
          //replace case
          if (method === 'replace') {
            const imgDetails = {
              path: `file://${photo.path}`,
              name: imageName,
            };
            // replacing the picture
            const updateList = list.map(item => {
              if (item.name === imageName) {
                return imgDetails;
              }
              return item;
            });
            //saving the updated list in async storage after replacing photo
            await setAsync(ASYNC_KEYS.IMAGE_PATH_LIST, updateList);
            fetchRecentPhoto();
            navigation.goBack();
            Alert.alert('Image Replaced Successfully');
            setDisableSnap(false);
            return;
          }
          const imgDetails = {
            path: `file://${photo.path}`,
            name: moment().format('MMDDYYYYhhmmss') + moment().millisecond(), // using moment for photo name
          };
          const updateList = [imgDetails, ...(list || [])];
          //saving the updated list in async storage after capture photo
          await setAsync(ASYNC_KEYS.IMAGE_PATH_LIST, updateList);
          fetchRecentPhoto();
          setDisableSnap(false);
        }
      } catch (e) {
        console.error('Failed to take photo!', e);
      }
    } else {
      Alert.alert('Hold Phone Straight', 'Only 20 degrees tilt allowed');
    }
  };

  const onPressBack = () => {
    navigation.goBack();
  };

  const source = useMemo(
    () => ({uri: imageList?.[0]?.path}),
    [imageList?.[0]?.path],
  );

  if (device == null) return <View />;
  return (
    <View style={styles.fullFlex}>
      <Camera
        photo
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        focusable
        orientation="portrait"
        enableHighQualityPhotos
      />
      {/* showing the phone position  */}
      <View style={styles.positionCont}>
        <Text>x:{phonePosition.x.toPrecision(3)}</Text>
        <Text>y:{phonePosition.y.toPrecision(3)}</Text>
        <Text>z:{phonePosition.z.toPrecision(3)} </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPressBack}
        style={styles.backBtn}>
        <Image
          source={ImagePath.BACK_ARROW}
          style={styles.backImg}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
      {source?.uri && method !== 'replace' ? (
        <Image style={styles.snCapturePhotoreview} source={source} />
      ) : null}
      <TouchableOpacity
        disabled={disableSnap}
        onPress={onPressSnap}
        style={styles.captureBtn}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtn: {
    height: 70,
    width: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'white',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
  },
  snCapturePhotoreview: {
    height: 100,
    width: 100,
    bottom: 10,
    left: 10,
    position: 'absolute',
    borderColor: colorCodes.white,
    borderWidth: 1,
  },
  backImg: {
    height: 20,
    width: 15,
    marginLeft: 10,
    marginTop: 12,
  },
  backBtn: {position: 'absolute', top: 0, width: 60},
  positionCont: {
    right: 0,
    position: 'absolute',
    backgroundColor: colorCodes.white,
  },
  fullFlex: {flex: 1},
});
export default CapturePhoto;
