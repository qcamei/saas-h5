///<reference path="../../../../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Component, Input, Output, EventEmitter, OnInit, OnDestroy} from "@angular/core";
import {AsyncRestProxy} from "../../../../comModule/asynDao/AsyncRestProxy";
import {AppUtils} from "../../../../comModule/AppUtils";
import {BossPayInfoMgr} from "../../../../bsModule/bossPayInfo/BossPayInfoMgr";
import {CertFileUpLoadForm} from "../../../../bsModule/bossPayInfo/apiData/CertFileUpLoadForm";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {RestResp} from "../../../../comModule/RestResp";

/**
 * 上传证书文件组件
 * eg:
 * <uploadCertFile_comp [label]="'上传证书'" (callback)="showFile($event)"></uploadCertFile_comp>
 */
@Component({
  selector:'uploadCertFile_comp',
  template:
  `	
		<div class="pos-r input_file" style="height:100%;width:100%;">
			<button class="btn-upload ">{{label}}</button>
			<input type="file" accept="application/x-pkcs12" multiple class="input-upload pos-a cur-hand" (change)="upload($event)"/>
  	</div>
  `,
  styleUrls:['./uploadCertFileComp.scss']
})
export class UploadCertFileComp implements OnInit,OnDestroy {

  imgArr:string[] = [];
  @Input() label:string;
  @Output() callback = new EventEmitter();

  readonly moduleType:string = "payMS/cert";

  constructor(private restProxy: AsyncRestProxy, private bossPayInfoMgr: BossPayInfoMgr){}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  async upload(e) {
    if(!e.target.files[0]) {
      return;
    }

    //上传时遮罩
    AppUtils.showMask("正在上传，请稍候...");
    // Mask.getInstance().open("正在上传，请稍候...");

    var file = e.target.files[0];
    e.target.value = '';//解决选择同一文件

    let upForm:CertFileUpLoadForm = this.buildUpForm(file);
    let formData:FormData = this.makeFormData(upForm);
    let restResp:RestResp = await this.bossPayInfoMgr.uploadCertFile(formData);
    this.handleResult(restResp);
  }


  private buildUpForm(file):CertFileUpLoadForm{
    let upForm:CertFileUpLoadForm = new CertFileUpLoadForm();
    upForm.file = file;
    upForm.moduleId = SessionUtil.getInstance().getStoreId();
    upForm.moduleType = this.moduleType;
    return upForm;
  }

  private makeFormData(upForm:CertFileUpLoadForm):FormData{
    let formData = new FormData();
    formData.append("file",upForm.file);
    formData.append("moduleId",upForm.moduleId);
    formData.append("moduleType",upForm.moduleType);
    return formData;
  }


  private handleResult(restResp:RestResp){
    if(restResp != null && restResp.code === 200){
      let data = JSON.parse(restResp.tJson);
      this.imgArr = AppUtils.addAll(this.imgArr,data.imgPathList);
      if(this.imgArr.length > 0){
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
  }

}
