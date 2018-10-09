import {Input, Output, EventEmitter, Component} from "@angular/core";
import {AsyncRestProxy} from "../../../comModule/asynDao/AsyncRestProxy";
import {AppUtils} from "../../../comModule/AppUtils";


/**
 * 图片裁剪公共组件
 * eg:
 *  <zm_img_cropper [label]="'上传图片'" [aspectRatio]="4/3" [requestUrl]="viewData.pageData.requestUrl" (callback)="showImg($event)"></zm_img_cropper>
 */
@Component({
  selector: 'zm_img_cropper',
  template: `
    <div class="pos-r" style="height:100%;width:100%;">
      <zm-btn-small name="{{label}}"></zm-btn-small>
      <!--<div class="cur-hand dib div-upload mg-t-15" *ngIf="!AppearanceButton" >+</div>-->
      <input  type="file" accept="image/png,image/jpeg,image/gif" class="input-upload pos-a cur-hand" (change)="fileChangeEvent($event)"/>
    </div>
    <div *ngIf="imageChangedEvent" class="w-100-p h-100-p pos-f" style="background:rgba(0,0,0,0.5);top:0;left:0;z-index:100">
      <div class="w-50-p pos-a" style="left:0;top:0;right:0;bottom:0;margin:10% 25%;" >
        <zm-card  [header]="'图片裁剪'" [expanded]="true" [withCollapse]="false" >
          <div style="min-height:300px;" class="w-100-p" fxLayout="row"  fxLayoutAlign="center center" fxLayoutGap="40px">
            <div style="width:70%;">
              <image-cropper
                [imageChangedEvent]="imageChangedEvent"
                [maintainAspectRatio]="true"
                [aspectRatio]="1/1"
                [resizeToWidth]="155"
                [onlyScaleDown]="true"
                format="png"
                (imageCroppedBase64)="imageCropped($event)"
                (imageCroppedFile)="croppedFile($event)">
              </image-cropper>
            </div>
            <div style="position:relative;top:-10px;left:0;"><p class="my-0">预览</p><img  [src]="croppedImage" /></div>
          </div>
          <div style="margin-top:20px;" fxLayout="row" fxLayoutAlign="end" fxLayoutGap="20px">
            <zm-btn (click)="cancel()" name="取消"></zm-btn>
            <zm-btn (click)="confirm()" name="上传"></zm-btn>
          </div>
        </zm-card>
        </div>
    </div>
    
`,
  styles: [`
    .cur-hand{
      cursor: pointer;
    }
 
    .input-upload {
      opacity: 0;
      filter: alpha(opacity=0);
      top:0;
      left:0;
      width: 100%;
      height:100%;
      font-size:0;
    }
    
    .pos-r{
      position: relative;
    }
    .cur-hand{
      cursor: pointer;
    }
    .pos-a{
      position: absolute;
    }
    .pos-f{
      position:fixed;
    }
`]
})
export class ZmImgCropper {

  @Input() label: string;
  @Input() requestUrl: string;
  @Output() callback = new EventEmitter();
  @Input() AppearanceButton: boolean = true;
  @Input() aspectRatio: any;

  public imageChangedEvent: any = '';
  public croppedImage: any = '';//预览图片

  private appendKey = "imgs";
  private file: string = "";//上传的文件
  private img: string;//回调图片
  private event: any;

  constructor(private restProxy: AsyncRestProxy) {
  }

  fileChangeEvent(event: any): void {
    if (!event.target.files[0]) {
      return;
    }
    this.imageChangedEvent = event;
    this.event = event;
  }

  imageCropped(image: string) {
    this.croppedImage = image;
  }

  croppedFile(file) {
    this.file = file;
  }

  cancel() {
    this.imageChangedEvent = '';
    this.croppedImage = '';
  }

  confirm() {
    this.uploadImage(this.file);
    this.imageChangedEvent = '';
    this.croppedImage = '';
  }

  uploadImage(file) {
    AppUtils.showMask("正在上传图片，请稍候...");
    let formData = new FormData();
    formData.append(this.appendKey, file);

    this.restProxy.uploadFile(this.requestUrl, formData).then(restResp => {
      if (restResp.code === 200) {
        let data = JSON.parse(restResp.tJson);
        this.img = data.imgPathList[0];
        this.callback.emit(this.img);
        //取消遮罩
        AppUtils.closeMask();
      } else {
        AppUtils.closeMask();
        AppUtils.showError("提示", "上传失败");
        this.callback.emit();
      }
      this.event.target.value = '';//解决重复
    });
  }
}
