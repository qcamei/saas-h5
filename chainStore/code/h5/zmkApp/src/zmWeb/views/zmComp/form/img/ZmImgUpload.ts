import {Component, Input, Output, EventEmitter} from "@angular/core";
// import {SessionUtil} from "../../../../comModule/session/SessionUtil";
// import {ImgMgr} from "../../../../bsModule/img/ImgMgr";
// import {AppUtils} from "../../../../comModule/AppUtils";
import {Platform} from "ionic-angular";
import {Camera} from "@ionic-native/camera";
import {ImgUploadUtils} from "../../../zmComUtils/ImgUploadUtils";
import {ImgData} from "./MultiImgUpload";
import {DomSanitizer} from "@angular/platform-browser";
// import {AppRouter} from "../../../zmComUtils/AppRouter";
import {FileTransfer} from "@ionic-native/file-transfer";

/**
 * 图片预览公共组件
 * eg:
 * <zm-img-upload [(imgList)]="imgList"></zm-img-upload>
 */
@Component({
  selector:'zm-img-upload',
  template:
  `	
	       <!--<zm-input-file [label]="label" (zmFileSelect)="onImgSelect($event)"></zm-input-file>-->
         <zm-img-preview [(imgList)]="imgList" [showAddFunc]="getShowAddFunc()"></zm-img-preview>

  `,
  styles:
  [`
	
  `],
  providers: [Camera, Platform],

})
export class ZmImgUpload {
  constructor( transfer: FileTransfer,camera:Camera,private sanitization: DomSanitizer){
    this.helper = new ImgUploadUtils(transfer, camera);
  }
  private helper:ImgUploadUtils;

  @Input() label:string = "上传图片";
  @Input() moduleType:string;
  @Input() uploading:boolean = false;

  /**
   * imgList 双向绑定
   */
  private imgListTmp:Array<string>;
  @Output() imgListChange = new EventEmitter();
  @Input()
  get imgList() {
    return this.imgListTmp;
  }
  set imgList(val) {
    this.imgListTmp = val;
    this.imgListChange.emit(this.imgListTmp);
  }

  // showAdd(){
  //   AppRouter.getInstance().goAddImg();
  // }
  getShowAddFunc() {

    let target = this;

    target.uploading = true;
    return ()=>{
      let onSelectFunc = (imgPath)=>{
        let imgData:ImgData = ImgData.newImgData(target.sanitization,imgPath);
        this.uploadImage(imgData)
          .then(data=>{
            target.uploading = false;
          })
          .catch(reason=>{
            target.uploading = false;
          });
      };

      if (!window['cordova']) {
        target.helper.showBrowserAdd(onSelectFunc);
      } else {
        target.helper.showDeviceAdd(onSelectFunc);
      }
    };
  }

  private uploadImage(imgData:ImgData):Promise<any>{
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
