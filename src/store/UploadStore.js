import {makeAutoObservable} from 'mobx';
class UploadStore {
  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});
  }

  uploadPercentageValue = 0;
  uploaderIsVisible = false;

  updateUploadPercentage = value => {
    this.uploadPercentageValue = value;
  };

  updateUploaderVisibility = state => {
    this.uploadPercentageValue = 0;
    this.uploaderIsVisible = state;
  };
}
export default new UploadStore();
