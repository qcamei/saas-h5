import {Component, Input, Output, EventEmitter, OnInit, OnDestroy} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
import {AsyncRestProxy} from "../../../comModule/asynDao/AsyncRestProxy";

/**
 * 上传文件公共组件
 * eg:
 * <zm-input-file [maxCount]="9" [limitCount]="6" [label]="'上传图片'" [requestUrl]="requestUrl" [appendKey]="'imgs'" (callback)="uploadCallback($event)"></zm-input-file>
 */
@Component({
  selector:'zm-input-file',
  template:
  `	
    <div class="pos-r " style="height:100%;width:100%;">
      <zm-btn-small *ngIf="AppearanceButton"  name="{{label}}"></zm-btn-small>
		<!--	<button *ngIf="AppearanceButton" class="btn-upload ">{{label}}</button>-->
			<div class="dib div-upload mg-t-15" *ngIf="!AppearanceButton" >+</div>
      <input *ngIf="!AppearanceButton" type="file" accept="image/png,image/jpeg,image/gif" multiple class="input-upload mg-t-15 pos-a cur-hand" (change)="upload($event)"/>
      <input *ngIf="AppearanceButton" type="file" accept="image/png,image/jpeg,image/gif" multiple class="input-upload-btn  pos-a cur-hand" (change)="upload($event)"/>
  	</div>
  	
  `,
  styles:
  [`
  .cur-hand{
    cursor: pointer;
  } 
  .dib{
    display: inline-block;
  } 
  .mg-t-15{
    margin-top:15px;
  }
  .pos-r{
    position: relative;
  }
  .pos-a{
    position: absolute;
  }
	.btn-upload{
		background:#4678fa;
		color:#fff;
		border: none;
	    border-radius: 6px;
	    font-size: 14px;
	    padding: 7px 12px;
	    cursor:pointer;
	}
	.div-upload{
	  width:100px;
	  height:100px;
	  line-height:97px;
	  color:#ced4da;
	  text-align: center;
	  font-size:30px;
	  border:1px dashed #ced4da;
	  
	}
	.input-upload {
        opacity: 0;
        filter: alpha(opacity=0);
        top:0;
        left:0;
        width: 100px;
        height:100px;
        font-size:0;
     }
     .input-upload-btn {
      opacity: 0;
      filter: alpha(opacity=0);
      top:0;
      left:0;
      width: 100%;
      height:100%;
      font-size:0;
   }
  `]
})
export class ZmInputFile implements OnInit,OnDestroy {

  imgArr:string[] = [];
  @Input() label:string;
  @Input() requestUrl:string;
  @Input() appendKey:string;
  @Input() limitCount:number;//本次可以上传数量
  @Input() maxCount:number;//可上传总数 用于提示信息
  @Output() callback = new EventEmitter();
  @Input() AppearanceButton:boolean = true;

  constructor(private restProxy: AsyncRestProxy){}

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }


  upload(e):void{
    if(!e.target.files[0]) {
      return;
    }

    //上传时遮罩
    AppUtils.showMask("正在上传图片，请稍候...");
    // Mask.getInstance().open("正在上传图片，请稍候...");


    var files = e.target.files;
    this.maxCount = this.maxCount>=0?this.maxCount:1;
    this.limitCount = this.limitCount>=0?this.limitCount:0;
    if(files.length > this.limitCount){
      AppUtils.showWarn("提示","最多只能上传"+this.maxCount+"张图片!");
      this.imgArr = [];
      e.target.value = ''; //清空数据
      AppUtils.closeMask();
      return;
    }
    let formData:FormData = this.makeFormData(files);
    this.restProxy.uploadFile(this.requestUrl,formData).then(restResp=> {
      if(restResp.code === 200){
        let data = JSON.parse(restResp.tJson);
        this.imgArr = AppUtils.addAll(this.imgArr,data.imgPathList);
        if(this.imgArr.length === files.length){
          this.callback.emit(this.imgArr);
          //取消遮罩
          AppUtils.closeMask();
        }else{
          AppUtils.closeMask();
          AppUtils.showError("提示","上传失败");
          this.callback.emit([]);
        }
      }else{
        AppUtils.closeMask();
        AppUtils.showError("提示","上传失败");
        this.callback.emit([]);
      }
      this.imgArr = [];
      e.target.value = ''; //清空数据
    });




  }

  /**
   * 转换formData
   * @param files
   * @returns {FormData}
   */
  makeFormData(files):FormData{
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(this.appendKey, files[i]);
    }
    return formData;
  }

}
