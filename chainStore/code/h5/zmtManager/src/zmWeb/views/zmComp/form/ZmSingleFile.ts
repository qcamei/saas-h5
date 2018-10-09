import {Component, Input, Output, EventEmitter} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
import {AsyncRestProxy} from "../../../comModule/asynDao/AsyncRestProxy";

/**
 * 上传文件公共组件
 * eg:
 * <zm_input_file [maxCount]="9" [limitCount]="6" [label]="'上传图片'" [requestUrl]="requestUrl" [appendKey]="'imgs'" (callback)="uploadCallback($event)"></zm_input_file>
 */
@Component({
  selector:'zm_single_file',
  template:
    `	
		<div class="pos-r input_file" style="height:100%;width:100%;">
			<button *ngIf="AppearanceButton" class="btn-upload ">{{label}}</button>
			<div class="cur-hand dib div-upload mg-t-15" *ngIf="!AppearanceButton" >+</div>
			<input type="file" accept="image/png,image/jpeg,image/gif" class="input-upload pos-a cur-hand" (change)="upload($event)"/>
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
        width: 100%;
        height:100%;
        font-size:0;
     }
  `]
})
export class ZmSingleFile{

  img:string = "";
  @Input() label:string;
  @Input() requestUrl:string;
  @Input() appendKey:string;
  @Output() callback = new EventEmitter();
  @Input() AppearanceButton:boolean = true;

  constructor(private restProxy: AsyncRestProxy){}

  upload(e):void{
    if(!e.target.files[0]) {
      return;
    }

    //上传时遮罩
    AppUtils.showMask("正在上传图片，请稍候...");

    var file = e.target.files[0];
    let formData = new FormData();
    formData.append(this.appendKey, file);

    this.restProxy.uploadFile(this.requestUrl,formData).then(restResp=> {
      if(restResp.code === 200){
        let data = JSON.parse(restResp.tJson);
        this.img = data.imgPathList[0];
        if(this.img){
          this.callback.emit(this.img);
          //取消遮罩
          AppUtils.closeMask();
        }else{
          AppUtils.closeMask();
          AppUtils.showError("提示","上传失败");
          this.callback.emit();
        }
      }else{
        AppUtils.closeMask();
        AppUtils.showError("提示","上传失败");
        this.callback.emit();
      }
      this.img = "";
      e.target.value = ''; //清空数据
    });
  }

}
