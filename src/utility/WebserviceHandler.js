import NetInfo from '@react-native-community/netinfo';
import UploadStore from '../store/UploadStore';
const axios = require('axios');

const Config = progressEvent => {
  const percentCompleted = Math.round(
    (progressEvent.loaded * 100) / progressEvent.total,
  );
  if (UploadStore.uploaderIsVisible) {
    UploadStore.updateUploadPercentage(percentCompleted);
  }
};

export async function callRemoteMethod(
  endpoint,
  type = 'GET',
  data,
  successKey = true,
) {
  const method = type.toLowerCase();
  try {
    const netStatus = await NetInfo.fetch();
    if (netStatus.isConnected) {
      const options = {
        method,
        url: endpoint,
        onUploadProgress: Config,
        headers: await getRequestHeader(),
      };
      (type === 'POST' ||
        type === 'PUT' ||
        type === 'PATCH' ||
        type === 'DELETE') &&
        (options.data = data);
      console.log('REQUEST: ', JSON.stringify(options));
      const response = await axios(options);
      if (response.status === 200) {
        if (successKey) {
          if (response.data) {
            console.log('RESPONSE!', JSON.stringify(response.data));
            return response.data ? response.data : response;
          }
        }
      }
    } else {
      throw {};
    }
  } catch (err) {
    if (err.response && err.response.status) {
      handleStatus(err.response);
    }
  }
}

function handleStatus(response) {
  console.log(
    'ERROR!',
    JSON.stringify(response.data?.message),
    response.status,
  );

  switch (response.status) {
    case 400:
      console.warn('Bad request', response.data.error);
      break;
    case 401:
      console.warn('Unauthorized Access');
      break;
    case 403:
      console.warn('Forbidden Access');
      break;
    case 404:
      break;
    case 500:
      console.warn('Internal Server Error');
      break;
    default:
      console.warn('Something went wrong! Please try again later.');
  }
}

async function getRequestHeader() {
  const header = {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
  };
  return header;
}
