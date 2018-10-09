import {Component, Input, OnInit} from "@angular/core";
import {ExcelMgr} from "../../../bsModule/excel/ExcelMgr";
import {ExcelLeaguer} from "../../../bsModule/excel/apiData/ExcelLeaguer";
import {ExcelUpLoadForm} from "../../../bsModule/excel/apiData/ExcelUpLoadForm";
import {ExcelProduct} from "../../../bsModule/excel/apiData/ExcelProduct";
import {ExcelGoods} from "../../../bsModule/excel/apiData/ExcelGoods";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppUtils} from "../../../comModule/AppUtils";

import {setPopup} from "../popup/setPopup";
import {RestResp} from "../../../comModule/RestResp";
import {UploadSuccessPopup} from "../popup/UpLoadSuccessPopup";
import {PromptMsg} from "../../common/Util/PromptMsg";
import {ImportTypeEnum} from "../enum/ImportType";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";

/**上传Excel模板组件**/

@Component({
  selector:"upload_comp",
  template:`    
      <div class="disFlex align-center ">
        <div class="leadcontent">
            <div class="leadhead pos-r"><img src="assets/images/setting/download.png" alt="" class="pos-a" style="top:-45px;left: calc(50% - 45px);transform: rotate(180deg)"><span class="mg-r-10 leadspan">2</span><span class="fz-12 font-c6">上传{{section}}导入模板</span></div>
          <div class="leadfoot">
            <p>上传填写好的{{section}}模板</p>
            <p>文 件，并导入确认</p>
            <div class="pos-r cur-hand" style="height:100%;width:100%;">
              <button class="btn-upload c-btn-blue cur-hand">点击上传</button>
              <input type="file" accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" class="input-upload pos-a cur-hand" (change)="upload($event)"/>
            </div>
          </div>
        </div>
      </div>

  `,
  styleUrls:['./settingComp.scss']
})
export class UpLoadComp implements OnInit{
  @Input() section: string;
  @Input() type:number;

  private service: UpLoadService;
  private moduleType:string;

  constructor(private excelMgr: ExcelMgr,
              private matDialog:MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);
    this.service = new UpLoadService(this.excelMgr);
  }

  ngOnInit(){
    if(this.type == ImportTypeEnum.GOODS){
      this.moduleType = "goods";
    }else if(this.type == ImportTypeEnum.PRODUCT){
      this.moduleType = "product";
    }else if(this.type == ImportTypeEnum.LEAGUER){
      this.moduleType = "leaguer";
    }
  }

  public async upload(e){
    if (!e.target.files[0]) {
      return;
    }
    var file = e.target.files[0];
    e.target.value = '';//解决选择同一文件

    let upForm:ExcelUpLoadForm = this.buildUpForm(file);
    let formData:FormData = this.makeFormData(upForm);
    let restResp:RestResp = await this.service.resolveExcel(upForm,formData);
    this.handleResult(restResp);
  }

  private buildUpForm(file){
    let upForm:ExcelUpLoadForm = new ExcelUpLoadForm();
    upForm.excel = file;
    upForm.moduleId = SessionUtil.getInstance().getStoreId();
    upForm.moduleType = this.moduleType;
    return upForm;
  }

  private makeFormData(upForm):FormData{
    let formData = new FormData();
    formData.append("excel",upForm.excel);
    formData.append("moduleId",upForm.moduleId);
    formData.append("moduleType",upForm.moduleType);
    return formData;
  }


  private handleResult(restResp:RestResp){
      if(restResp.code == 200){
          let targetList = this.buildTargetList(restResp);
          if(targetList.length>0 && targetList.length<=500){
            const activeModal = ZmModalMgr.getInstance().newModal(UploadSuccessPopup);
            activeModal.componentInstance.setContent = "已成功上传"+targetList.length+"条"+this.section+"信息,导入前请核对数量是否正确";
            activeModal.componentInstance.section = this.section;
            activeModal.componentInstance.addListForm = targetList;
          }else{
            if(targetList.length<=0){
              const activeModal = ZmModalMgr.getInstance().newModal(setPopup);
              activeModal.componentInstance.title = "上传成功";
              activeModal.componentInstance.setContent = "未发现有效数据，请检查后重新上传";
              activeModal.componentInstance.btnText = "";
              activeModal.componentInstance.confirmBtn = "确定";
            }
            if(targetList.length>500) {
              let content = "上传数量不得超过500条";
              this.failModal(content)
            }
          }
      }else if(restResp.code == 500){
        let content = PromptMsg.INTERNAL_SERVER_ERROR;
        this.failModal(content)
      }else{
        let content = restResp.tips;
        this.failModal(content)
      }

  }

  private buildTargetList(restResp){
    let targetList = null;
    if(this.type == ImportTypeEnum.LEAGUER){
      targetList = AppUtils.fromJsonToList(ExcelLeaguer,restResp.tListJson);
    }else if(this.type == ImportTypeEnum.PRODUCT){
      targetList = AppUtils.fromJsonToList(ExcelProduct,restResp.tListJson);
    }else if(this.type == ImportTypeEnum.GOODS){
      targetList = AppUtils.fromJsonToList(ExcelGoods,restResp.tListJson);
    }
    return targetList;
  }

  private failModal(content){
    const activeModal = ZmModalMgr.getInstance().newModal(setPopup);
    activeModal.componentInstance.title = "上传失败";
    activeModal.componentInstance.setContent = content;
    activeModal.componentInstance.btnText = "";
    activeModal.componentInstance.confirmBtn = "确定";
  }

}


export class UpLoadService{

  constructor(private excelMgr:ExcelMgr){

  }

  public async resolveExcel(upForm:ExcelUpLoadForm,formData:FormData){
    let moduleType = upForm.moduleType;
    let restResp:RestResp = null;
    if(moduleType == "leaguer"){
      restResp = await this.resolveLeaguer(formData);
    }else if(moduleType == "product"){
      restResp = await this.resolveProduct(formData);
    }else if(moduleType == "goods"){
      restResp = await this.resolveGoods(formData);
    }

    return restResp;
  }


  public async resolveLeaguer(formData:FormData){
      let restResp:RestResp = await this.excelMgr.resolveLeaguer(formData);
      return restResp;
  }

  public async resolveProduct(formData:FormData){
    let restResp:RestResp = await this.excelMgr.resolveProduct(formData);
    return restResp;
  }

  public async resolveGoods(formData:FormData){
    let restResp:RestResp = await this.excelMgr.resolveGoods(formData);
    return restResp;
  }

}
