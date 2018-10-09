import {Camera, CameraOptions} from "@ionic-native/camera";
import {ActionSheetUtils} from "./ActionSheetUtils";
import {ImgData} from "../zmComp/form/img/MultiImgUpload";
import {FileTransfer} from "@ionic-native/file-transfer";

/**
 * 使用ionic-native本地接口上传图片
 * 不适用于微信
 */
export class ImgUploadUtils {

  constructor(private transfer: FileTransfer,private camera: Camera) {
  }

  public showBrowserAdd(onSelectFunc:any){
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = "image/x-png,image/gif,image/jpeg";
    input.click();
    input.onchange = () => {
      let imagePath = window.URL.createObjectURL(input.files[0]);
      onSelectFunc(imagePath);
    }
  }

  public showDeviceAdd(onSelectFunc:any){
    new Promise((resolve, reject) => {
        ActionSheetUtils.getInstance().show({
          title: '添加图片',
          buttons: [
            {
              text: '从手机相册选择',
              handler: () => {
              resolve(this.camera.PictureSourceType.PHOTOLIBRARY);
            }
            },
            {
              text: '拍照',
              handler: () => {
              resolve(this.camera.PictureSourceType.CAMERA);
            }
            },
            {
              text: '取消',
              role: 'cancel',
              handler: () => {
              reject();
            }
            }
          ]
        });
      }).then(sourceType => {
          if (!window['cordova'])
              return;
          let options: CameraOptions = {
            quality: 100,
            sourceType: sourceType as number,
            saveToPhotoAlbum: false,
            correctOrientation: true
          };
          this.camera.getPicture(options).then((imagePath) => {
              onSelectFunc(imagePath);
          });
    }).catch(() => {
    });
  }

  public browserUpload(imgData:ImgData,postUrl:string):Promise<any>{
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', imgData.url, true);
      xhr.responseType = 'blob';
      xhr.onload = (e) => {
        if (xhr['status'] != 200) {
          console.error(e, xhr);
          reject(new Error("浏览器不支持blob"));
        } else {
          const blob = xhr['response'];
          let formData: FormData = new FormData();
          let xhr2: XMLHttpRequest = new XMLHttpRequest();
          formData.append('files[]', blob);

          xhr2.onreadystatechange = () => {
            if (xhr2.readyState === 4) {
              if (xhr2.status === 200)
                resolve(JSON.parse(xhr2.response));
              else
                reject(new Error("上传失败 status:"+xhr2.status));
            }
          };

          xhr2.upload.onprogress = (event) => {
            console.log(event.loaded);
            console.log(event.total);
            imgData.uploadingProgress = event.loaded * 100 / event.total;
          };

          xhr2.open('POST', postUrl, true);
          imgData.uploadingHandler = xhr2;

          xhr2.send(formData);
        }
      };
      xhr.send();
    });
  }

  public deviceUpload(imgData:ImgData,postUrl:string):Promise<any>{
    return new Promise<any>((resolve, reject) => {
      let options = {
        fileKey: "files[]",
        fileName: imgData.url,
        chunkedMode: false,
        mimeType: "multipart/form-data",
      };

      const fileTransfer = this.transfer.create();

      fileTransfer.upload(imgData.url, postUrl, options).then(data => {
        resolve(JSON.parse(data.response));
      }).catch((reason) => {
        reject(new Error("上传失败"+reason));
      });

      fileTransfer.onProgress(eventTmp => {
        imgData.uploadingProgress = eventTmp.loaded * 100 / eventTmp.total;
      });

      imgData.uploadingHandler = fileTransfer;
    });
  }

}
