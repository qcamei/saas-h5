import {Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
import {AsyncRestProxy} from "../../../comModule/asynDao/AsyncRestProxy";

/**
 * 上传文件公共组件
 * eg:
 * <zm_input_file [label]="'上传图片'" [requestUrl]="requestUrl" [appendKey]="'imgs'" (callback)="uploadCallback($event)"></zm_input_file>
 */
@Component({
  selector:'zm_input_file',
  template:
  `	
		<div class="pos-r" style="height:100%;width:100%;">
			<button class="btn-upload">{{label}}</button>
			<input type="file" accept="image/png,image/jpeg,image/gif" multiple class="input-upload pos-a cur-hand" (change)="upload($event)"/>
  	</div>
  `,
  styles:
  [`
	.btn-upload{
		background:#4678fa;
		color:#fff;
		border: none;
	    border-radius: 6px;
	    font-size: 14px;
	    padding: 7px 12px;
	    cursor:pointer;
	}
	.input-upload{
		left:0;
		top:0;
		height:100%;
		opacity:0;
		filter:alpha(opacity=0);
	}
  `]
})
export class ZmInputFile implements OnInit,OnDestroy,OnChanges {

  imgArr:string[] = [];
  @Input() label:string;
  @Input() requestUrl:string;
  @Input() appendKey:string;
  @Output() callback = new EventEmitter();
  constructor(private restProxy: AsyncRestProxy){}

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  upload(e):void{
    if(!e.target.files[0]) {
      return;
    }

    var files = e.target.files;
    let formData:FormData = this.makeFormData(files);
    this.restProxy.uploadFile(this.requestUrl,formData).then(restResp=> {
      if(restResp.code === 200){
        let data = JSON.parse(restResp.tJson);
        this.imgArr = AppUtils.addAll(this.imgArr,data.imgPathList);
        if(this.imgArr.length === files.length){
          this.callback.emit(this.imgArr);
        }else{
          AppUtils.showError("提示","上传失败");
          this.callback.emit([]);
        }
      }else{
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
