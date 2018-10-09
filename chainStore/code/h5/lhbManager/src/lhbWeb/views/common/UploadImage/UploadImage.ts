import {Component,Input,Output,EventEmitter} from "@angular/core";
import {AppUtils} from "../../../comModule/AppUtils";
import {AsyncRestProxy} from "../../../comModule/asynDao/AsyncRestProxy";
@Component({
  selector:'uploadImg-comp',
  template:
  `	
		<div class="pos-r" style="height:100%;width:100%;">
			<button class="btn-upload">上传图片</button>
			<input type="file" accept="image/png,image/jpeg,image/gif" multiple class="input-upload pos-a cur-hand" (change)="getUpload($event)" />
  		</div>
		<!-- <div *ngIf="imgArr.length>0" style="overflow:hidden;width:350px;margin-left:-10px;">
			<div *ngFor="let i of imgArr;let i = index" class="imgDiv disFlex align-center">
				<img [src]="i" alt="" style="width:100%;"/>
			</div>
		</div> -->
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
	.imgDiv{
		height:100px;
		width:100px;
		float:left;
		margin-left:15px;
		margin-top:15px;
	}
  `]
})
export class UploadImage {
    imgArr:string[] = [];
    @Input() requestUrl:string = '';
    @Input() imgLength:number = 0;
    @Output() callback = new EventEmitter();
  	constructor(private restProxy: AsyncRestProxy){}
    getUpload(e):void{
      let $input = e;
   		if(this.imgLength + e.target.files.length > 9){
   			AppUtils.showWarn("提示","最多只能上传9张图片!");
   			return;
   		}
   		if(e.target.files&&e.target.files[0]){
   			var files = e.target.files;
   			for(let i=0;i<files.length;i++){
   				let reader = new FileReader();
   				console.log(reader);
	   			reader.onload = (e:any)=>{
					// this.imgArr.push(e.target.result);//base64用于预览
					this.restProxy.uploadFile(this.requestUrl,this.makeformData(files[i])).then(restResp=> {
					    // let re = restResp.json();
					    if(restResp.code === 200){
					    	let data = JSON.parse(restResp.tJson);
                this.imgArr.push(data.imgPathList[0]);
                if(this.imgArr.length === files.length){
                  this.callback.emit(this.imgArr);
                  this.imgArr = [];
                  $input.target.value = ''; //解决选择同一文件onchange事件不触发的问题
                }
					    }else{
                this.callback.emit('上传图片出错!');
              }
					});
				}
   				reader.readAsDataURL(files[i]);
   			}
   		}
    }
    //blob转formdata
   	makeformData(data){
   		let formData = new FormData();
        if (data instanceof Array) {
            for (let i = 0; i < data.length; i++) {
                formData.append('img', data[i]);
            }
        } else {
            formData.append('img', data);
        }
        return formData;
   	}
   	//base64转blob
    convertBase64UrlToBlob(urlData) {
        var bytes = window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte
        //处理异常,将ascii码小于0的转换为大于0
        var ab = new ArrayBuffer(bytes.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/png' });
    }
}
