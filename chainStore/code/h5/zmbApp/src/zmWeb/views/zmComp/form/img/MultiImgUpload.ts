import {Component, Input} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {Platform, ViewController, IonicPage} from "ionic-angular";
import {Camera} from "@ionic-native/camera";
import {AppUtils} from "../../../../comModule/AppUtils";
import {ImgUploadUtils} from "../../../zmComUtils/ImgUploadUtils";
import {ModalCtrl} from "../../../zmComUtils/ModalCtrl";
import {FileTransfer} from "@ionic-native/file-transfer";

@IonicPage({
  name:"multiImgUpload",
  segment: 'my/multiImgUpload'
})
@Component({
    selector: 'multi-image-upload',
    template: `
      <!--<zm-page-header title="上传图片"></zm-page-header> -->
      <zm-modal-header title="上传图片" [cancel]="modalCtrl.cancelFunc()"></zm-modal-header>

      <zm-page-content>
            <ion-row>
            
              <ion-col col-4  *ngFor="let imgDataItem of imgDataList">
              
                      <ion-icon class="remove-image" name="close-circle-outline" *ngIf="!isUploading" (click)="removeImage(imgDataItem)"></ion-icon>
                      <div class="image" [style.background-image]="imgDataItem.sanitized">
                        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" [class.uploading]="isUploading" alt=""/>
                        <ion-spinner *ngIf="isUploading && imgDataItem.uploadingProgress < 100"></ion-spinner>
            
                        <ion-icon name="checkmark" color="success" *ngIf="isUploading && imgDataItem.uploadingProgress == 100"></ion-icon>
                        <div *ngIf="isUploading" class="progress-bar">
                          <div class="progress" [style.width]="(imgDataItem.uploadingProgress || 0)+'%'"></div>
                        </div>
                    </div>
                    
              </ion-col>
              <ion-col col-4 class="image-wrapper add-image-btn" *ngIf="!isUploading" (click)="showAddImage()">
              
                    <div class="image">
                      <ion-icon name="add" color="new"></ion-icon>
                      <img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt=""/>
                    </div>
              </ion-col>
            </ion-row>
            <ion-row>
                  <ion-col col-12 > 
                    <button ion-button block (click)="submit()" *ngIf="!uploadFinished" [disabled] = "isUploading && !uploadFinished ">
                        <ion-spinner *ngIf="isUploading"></ion-spinner>
                        确定上传
                    </button>
                    
                    <button ion-button block (click)="modalCtrl.dismiss(imgDataList)" *ngIf="uploadFinished">
                        上传成功
                    </button>
                  </ion-col>
            </ion-row>
      </zm-page-content>
    `,
    providers: [FileTransfer,Camera, Platform],
})

export class MultiImgUpload {

    public isUploading = false;
    public uploadFinished = false;

    // public images: any = [];
    protected imgDataList: Array<ImgData> = new Array<ImgData>();

    @Input() moduleType:string;
    modalCtrl:ModalCtrl;

    //成功上传返回的图片地址
    // private imgSrcList:Array<string>;

    private helper:ImgUploadUtils;
    constructor(private viewCtrl: ViewController,private sanitization: DomSanitizer,transfer: FileTransfer, camera: Camera) {
      this.helper = new ImgUploadUtils(transfer, camera);
      this.modalCtrl = ModalCtrl.newCtrl(viewCtrl);
    }



    submit() {
        if (this.imgDataList.length == 0) {
          AppUtils.showInfo("","请选择图片");
          return;
        }

        this.uploadImages().then((images) => {
          AppUtils.showSuccess("","图片上传成功");
          this.uploadFinished = true;

          this.findImgSrcList(images);
        }).catch(reason => {
          this.isUploading = false;
          AppUtils.showError("图片上传失败",reason);
        });
    }

    private findImgSrcList(data){
      //todo: to be implemted;
    }

    // cancel() {
    //   AlertUtils.getInstance().showOk("","取消上传?",()=>{
    //     this.abort();
    //   });
    // }
    // private abort() {
    //   if (this.isUploading){
    //     this.isUploading = false;
    //     for (let imgTmp:ImgData of this.imgDataList) {
    //       imgTmp.uploadingHandler.abort();
    //     }
    //   }
    // }

    private uploadImages(): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            this.isUploading = true;
            Promise.all(this.imgDataList.map(image => {
                return this.uploadImage(image);
            }))
            .then((data) =>{
                resolve(data);
            }).catch( reason => {
                reject(reason);
            });
        });
    }

    removeImage(imgData:ImgData) {
        if (!this.isUploading){
          AppUtils.removeFromArray(this.imgDataList, imgData);
        }
    }

    showAddImage() {
        let onSelectFunc = (imgPath)=>{
          this.imgDataList.push(ImgData.newImgData(this.sanitization,imgPath));
          // this.images.push(imgPath);
          // this.toTrustImages();
        };

        if (!window['cordova']) {
          this.helper.showBrowserAdd(onSelectFunc);
        } else {
          this.helper.showDeviceAdd(onSelectFunc);
        }
    }


    private uploadImage(imgData:ImgData) {
      if (window['cordova']) {
        return this.helper.deviceUpload(imgData,this.getPostUrl());
      }else{
        return this.helper.browserUpload(imgData,this.getPostUrl());
      }
    }

    private getPostUrl(){
      return "http://jquery-file-upload.appspot.com/";
      // let wunitId:string = SessionUtil.getInstance().getCurWUnitId();
      // return ImgMgr.getInstance().getUploadUrl(wunitId,this.moduleType);
    }

}

export class ImgData{
  url;string;
  sanitized:any;
  uploadingHandler:any;
  uploadingProgress:number = 0;

  public static newImgData(sanitization: DomSanitizer, urlP:string) {
    let data:ImgData = new ImgData();
    data.url = urlP;
    data.sanitized = sanitization.bypassSecurityTrustStyle("url(" + urlP + ")");
    return data;
  }


}
