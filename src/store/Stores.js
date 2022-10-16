import React from 'react';
import UploadStore from './UploadStore';
import {configure} from 'mobx';
configure({enforceActions: 'never'});

const GlobalStore = {
  UploadStore,
};

export const StoreContext = React.createContext(GlobalStore);

export const Store = () => React.useContext(StoreContext);
