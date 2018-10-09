import {Component, ChangeDetectorRef, ChangeDetectionStrategy, OnInit} from "@angular/core";
import {ViewController, IonicPage} from "ionic-angular";
import {ModalCtrl} from "../../zmComUtils/ModalCtrl";
import {AddLabelViewDataMgr} from "./AddLabelViewDataMgr";
import {LeaguerLabel} from "../../../bsModule/storeLeaguerInfo/data/LeaguerLabel";
import {ZmMap, AppUtils} from "../../../comModule/AppUtils";
import {LabelExChangeData} from "./LabelExChangeData";
import {StoreLeaguerInfoMgr} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {LeaguerLabelAddForm} from "../../../bsModule/storeLeaguerInfo/apiData/LeaguerLabelAddForm";
import {StoreLeaguerInfoSynDataHolder} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {StoreLeaguerInfo} from "../../../bsModule/storeLeaguerInfo/data/StoreLeaguerInfo";
import { ViewChild } from '@angular/core';
/**
 * 会员管理-添加标签
 */
@IonicPage({
  name:"addLabel",
  segment:"addLabel"
})
@Component({
  template:`
            <zm-modal-header [operation]="true" [edit]="'保存'"   title="添加标签" (zmbBtnClick)="addLabels()" [cancel]="modalCtrl.cancelFunc()"></zm-modal-header>
            <zm-page-content>
              <div fxLayout="column" fxLayoutAlign="start" fxLayoutGap="15px" style="padding:10px;">
                  <div fxLayout="row wrap" fxLayoutAlign="start center" >
                      <span class="active"  *ngFor="let item of viewData.labelNames;let i=index;" (click)="deleteTag(i)">{{item}}</span>
                      <div style="width:100px;margin-top:5px;padding:3px 2px;height:25px;border:1px solid #ccc;">
                         <input #myInput style="border:none;" w-100 no-margin maxlength="8" placeholder="请输入标签.." type="text" [(ngModel)]="viewData.inputName" (ngModelChange)="filterLabel($event)" (blur)="addTag($event)" />
                      </div>
                  </div>
                  <div style="border-bottom:1px solid #f4f4f4;"></div>
                  <span>所有标签</span>
                  <div fxLayout="row wrap" fxLayoutAlign="start">
                      <span class="labelSpan" [class.active]="checkHas(item)"  *ngFor="let item of viewData.labelList" (click)="toogleTab(item.name)">{{item.name}}</span>
                  </div>
              </div>
            </zm-page-content>
            <!--<ion-footer class="bg-white">-->
               <!--&lt;!&ndash;<zm-btn-small name="保存" (zmbtnClick)="addLabels()"></zm-btn-small>&ndash;&gt;-->
            <!--</ion-footer>-->
`,
  styles:[`
    .labelSpan{
     color:#999;
    margin:5px 5px 0 0 ;
    padding:2px 2px;
    border-radius:5px;
    border:1px solid #999;
    }
    .active{
    color:#4678FA !important;
    margin:5px 5px 0 0 ;
    padding:2px 2px;
    border-radius:5px;
    border:1px solid #4678FA !important;
}
`

  ],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class AddLabelPage{


@ViewChild('myInput') myInput;

  public viewData:AddLabelViewData;
  private service:AddLabelService;
  public modalCtrl:ModalCtrl;
  constructor(private viewCtrl: ViewController,
              private cdRef:ChangeDetectorRef){
    this.modalCtrl = ModalCtrl.newCtrl(viewCtrl);
    this.service = new AddLabelService();
    let initViewData = new AddLabelViewData();
    AddLabelViewDataMgr.getInstance().onDataChange(initViewData, (viewDataP => {
      if (viewDataP) {
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
      }
    }));
  }


  ionViewDidLoad() {
    this.service.buildViewData();
  }

  /**
   * 标签输入监听过滤
   * @param label
   */
  filterLabel(label:string){
    if(!AppUtils.isNullObj(label)){
      label = AppUtils.trimBlank(label);
      if(AppUtils.isNullOrWhiteSpace(label)){
        this.viewData.labelList = this.viewData.allLabelMap.values();
      }else{
        this.viewData.labelList = this.viewData.allLabelMap.values().filter((item:LeaguerLabel)=>{
          if((item.name.indexOf(label) > -1) && !this.hasLabel(item.name)){
            return true;
          }else{
            return false;
          }
        })
      }
    }
  }

  /**
   * 已选择的标签中是否包含
   * @param label
   * @returns {boolean}
   */
  private hasLabel(label:string):boolean{
    let has = false;
    for(let i=0;i<this.viewData.labelNames.length;i++){
      if(this.viewData.labelNames.indexOf(label) > -1){
        has = true;
        break;
      }
    }
    return has;
  }

  /**
   * 失去焦点添加标签
   * @param label
   */
  addTag(event){
    let label = this.viewData.inputName;
    if(AppUtils.isNullObj(label) || AppUtils.isNullOrWhiteSpace(label)){
      AppUtils.showWarn("提示","标签不能为空");
    }else if(label.length>8){
      AppUtils.showWarn("提示","标签最多支持8个字");
    }else{
      if(this.viewData.allLabelMap.contains(label)){//已包含
        if(this.viewData.labelNames.indexOf(label) == -1){
          this.viewData.labelNames.push(label);
        }else{
          let index = this.viewData.labelNames.indexOf(label);
          if(index > -1){
            this.viewData.labelNames.splice(index,1);
            this.viewData.labelNames.push(label);
          }
        }
      }else{
        if(this.viewData.labelNames.indexOf(label) == -1){
          this.viewData.labelNames.push(label);
        }
      }

      this.viewData.inputName = undefined;
      this.viewData.labelList = this.viewData.allLabelMap.values();
      AddLabelViewDataMgr.getInstance().setData(this.viewData);
      this.myInput.nativeElement.focus();
    }
  }

  /**
   * 删除标签
   * @param index
   */
  deleteTag(index:number){
    this.viewData.labelNames.splice(index,1);
  }

  /**
   * 点击历史标签
   * @param label
   */
  toogleTab(label:string){
    if(this.viewData.labelNames.indexOf(label) > -1){//已选标签包含则删除
      this.viewData.labelNames.splice(this.viewData.labelNames.indexOf(label),1);
    }else{//不包含则添加
      this.viewData.labelNames.push(label);
    }
  }

  /**
   * 是否已选择该标签 样式判断
   * @param item
   * @returns {boolean}
   */
  checkHas(item:LeaguerLabel):boolean{
    if(this.viewData.labelNames.indexOf(item.name) > -1){
      return true;
    }else{
      return false;
    }
  }

  /**
   * 保存添加标签列表
   */
  async addLabels(){
    let success:boolean = true;
    let results = this.viewData.labelNames.filter((item)=>{
      if(!this.viewData.allLabelMap.contains(item)){
        return true;
      }
    });
    if(results.length>0){
      success = await this.service.addLabelList(results);
      if(success){
        AppUtils.showSuccess("提示","保存成功");
        let storeLeaguerInfo:StoreLeaguerInfo = await this.service.getStoreLeaguerInfo();
        if(!AppUtils.isNullObj(storeLeaguerInfo)){
          this.viewData.allLabelMap = storeLeaguerInfo.getValidLeaguerLabelNameMap();
          this.viewData.selectedLabelList.splice(0,this.viewData.selectedLabelList.length);
          this.viewData.labelNames.forEach((item)=>{
            this.viewData.selectedLabelList.push(storeLeaguerInfo.getValidLeaguerLabelNameMap().get(item));
          })
        }
      }else{
        AppUtils.showError("提示","保存失败");
      }
    }else{
      this.viewData.selectedLabelList.splice(0,this.viewData.selectedLabelList.length);
      this.viewData.labelNames.forEach((item)=>{
        this.viewData.selectedLabelList.push(this.viewData.allLabelMap.get(item));
      })
    }
    this.modalCtrl.dismiss(null);
  }

}

class AddLabelService{

  public buildViewData(){
    let storeId = SessionUtil.getInstance().getStoreId();
    StoreLeaguerInfoSynDataHolder.getInstance().getData(storeId).then((storeLeaguerInfo:StoreLeaguerInfo)=>{
      if(!AppUtils.isNullObj(storeLeaguerInfo)){
        let viewDataTmp = new AddLabelViewData();
        viewDataTmp.allLabelMap = storeLeaguerInfo.getValidLeaguerLabelNameMap();
        viewDataTmp.labelList = viewDataTmp.allLabelMap.values();
        viewDataTmp.selectedLabelList = LabelExChangeData.getInstance().getSelectedLabelList();
        viewDataTmp.labelNames = viewDataTmp.selectedLabelList.map((item:LeaguerLabel)=>{
          return item.name;
        });
        AddLabelViewDataMgr.getInstance().setData(viewDataTmp);
      }
    })
  }

  /**
   * 获取storeLeaguerInfo
   * @returns {Promise<StoreLeaguerInfo>}
   */
  public getStoreLeaguerInfo():Promise<StoreLeaguerInfo>{
    let storeId = SessionUtil.getInstance().getStoreId();
    return StoreLeaguerInfoSynDataHolder.getInstance().getData(storeId);
  }

  /**
   * 添加标签列表
   * @param labelNames
   * @returns {Promise<boolean>}
   */
  public async addLabelList(labelNames:Array<string>):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let storeLeaguerInfo:StoreLeaguerInfo = await StoreLeaguerInfoSynDataHolder.getInstance().getData(storeId);
    if(!AppUtils.isNullObj(storeLeaguerInfo)){
      let labelIndex = storeLeaguerInfo.labelIndex;
      let leaguerLabelAddForms = labelNames.map((item)=>{
        let leaguerLabelAddForm = new LeaguerLabelAddForm();
        leaguerLabelAddForm.name = item;
        leaguerLabelAddForm.index = (parseInt(labelIndex.toString())+1).toString();
        labelIndex ++;
        return leaguerLabelAddForm;
      });
      return StoreLeaguerInfoMgr.getInstance().addLeaguerLabelList(storeId,leaguerLabelAddForms);
    }else{
      return false;
    }

  }

}

export class AddLabelViewData{
  public labelNames:Array<string> = new Array<string>();//选中的标签name列表
  public selectedLabelList:Array<LeaguerLabel>;//选中的标签
  public allLabelMap: ZmMap<LeaguerLabel>;//所有标签
  public labelList:Array<LeaguerLabel> = new Array<LeaguerLabel>();//历史标签过滤显示列表

  public inputName:string;
}
