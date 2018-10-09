import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {BossPayInfo} from "../../../bsModule/bossPayInfo/data/BossPayInfo";
import {AppCfg} from "../../../comModule/AppCfg";
import {SettingsViewDataMgr} from "../SettingsViewDataMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {BossPayInfoMgr} from "../../../bsModule/bossPayInfo/BossPayInfoMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {RestResp} from "../../../comModule/RestResp";
import {BossPayInfoAddApiForm} from "../../../bsModule/bossPayInfo/apiData/BossPayInfoAddApiForm";
import {Constants} from "../../common/Util/Constants";
import {WxpayModelEnum} from "../../../bsModule/bossPayInfo/data/WxpayModelEnum";

@Component({
  selector:"setBossPayInfo",
  templateUrl:"setBossPayInfo.html",
  styleUrls:['setBossPayInfo.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class SetBossPayInfoPage{

  viewDataSub:any;
  viewData:SetBossPayInfoViewData;
  service:SetBossPayInfoService;

  readonly storeId :string = SessionUtil.getInstance().getStoreId();

  constructor(
              private bossPayInfoMgr: BossPayInfoMgr,
              private settingsViewDataMgr:SettingsViewDataMgr,
              private cdRef:ChangeDetectorRef){
    this.service = new SetBossPayInfoService(this.bossPayInfoMgr,this.settingsViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.settingsViewDataMgr.subscribeSetBossPayInfoVD((viewDataP:SetBossPayInfoViewData)=>{
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData(this.storeId);
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 添加 点击事件
   */
  async add(){
    let addFormData = this.buildFormData();
    let isValid: boolean = this.checkForm(addFormData);
    if(!isValid) return;
    let restResp = await this.service.add(addFormData);
    this.handleResult(restResp);
  }

  /**
   * 修改 点击事件
   */
  async update(id:number){
    let editFormData = this.buildFormData();
    let isValid: boolean = this.checkForm(editFormData);
    if(!isValid) return;
    let restResp = await this.service.update(id.toString(),editFormData);
    this.handleResult(restResp);
  }

  private checkForm(form: BossPayInfoAddApiForm): boolean{
    return this.checkAllForm(form)
      && this.checkWxpayForm(form)
      && this.checkAlipayForm(form);
  }

  private checkAllForm(form: BossPayInfoAddApiForm): boolean{
    if( (AppUtils.isNullObj(form.wxpayModel) || form.wxpayModel == WxpayModelEnum.NONE)
      && AppUtils.isNullOrWhiteSpace(form.wxpayAppId)
      && AppUtils.isNullOrWhiteSpace(form.wxpayMchId)
      && AppUtils.isNullOrWhiteSpace(form.wxpayKey)
      && AppUtils.isNullOrWhiteSpace(form.wxpayCertPath)
      && AppUtils.isNullOrWhiteSpace(form.wxpaySubMchId)
      && AppUtils.isNullOrWhiteSpace(form.alipayAppId)
      && AppUtils.isNullOrWhiteSpace(form.alipayPrivateKey)
      && AppUtils.isNullOrWhiteSpace(form.alipayDevPublicKey)
      && AppUtils.isNullOrWhiteSpace(form.alipayZfbPublicKey)){
      AppUtils.showWarn("提示", "请至少填写一种配置");
      return false;
    }else {
      return true;
    }

  }

  private checkWxpayForm(form: BossPayInfoAddApiForm): boolean {
    let checked:boolean = true;
    switch (form.wxpayModel) {
      case WxpayModelEnum.NONE:
        this.clearWxpayFormForNoneModel(form);
        break;
      case WxpayModelEnum.NORMAL:
        checked = this.checkWxpayFormForNormalModel(form);
        break;
      case WxpayModelEnum.PROVIDER:
        checked = this.checkWxpayFormForProviderModel(form);
        break;
    }
    return checked;
  }

  private clearWxpayFormForNoneModel(form){
    form.wxpayAppId = null;
    form.wxpayMchId = null;
    form.wxpayKey = null;
    form.wxpayCertPath = null;
    form.wxpaySubMchId = null;
  }

  private checkWxpayFormForNormalModel(form: BossPayInfoAddApiForm): boolean{
    if(!AppUtils.isNullOrWhiteSpace(form.wxpayAppId)
      && !AppUtils.isNullOrWhiteSpace(form.wxpayMchId)
      && !AppUtils.isNullOrWhiteSpace(form.wxpayKey)
      && !AppUtils.isNullOrWhiteSpace(form.wxpayCertPath)){
      this.trimWxpayFormForNormalModel(form);
      return true;
    }else{
      AppUtils.showWarn("提示", "请将微信配置填写完整");
      return false;
    }
  }

  private checkWxpayFormForProviderModel(form: BossPayInfoAddApiForm): boolean{
    if(!AppUtils.isNullOrWhiteSpace(form.wxpaySubMchId)){
      form.wxpaySubMchId = AppUtils.trimBlank(form.wxpaySubMchId);
      return true;
    }else{
      AppUtils.showWarn("提示", "请将微信配置填写完整");
      return false;
    }
  }

  private checkAlipayForm(form: BossPayInfoAddApiForm): boolean{
    //要么都为空；要么都不为空
    if(AppUtils.isNullOrWhiteSpace(form.alipayAppId)
      && AppUtils.isNullOrWhiteSpace(form.alipayPrivateKey)
      && AppUtils.isNullOrWhiteSpace(form.alipayDevPublicKey)
      && AppUtils.isNullOrWhiteSpace(form.alipayZfbPublicKey)){
      return true;
    } else if(!AppUtils.isNullOrWhiteSpace(form.alipayAppId)
      && !AppUtils.isNullOrWhiteSpace(form.alipayPrivateKey)
      && !AppUtils.isNullOrWhiteSpace(form.alipayDevPublicKey)
      && !AppUtils.isNullOrWhiteSpace(form.alipayZfbPublicKey)){
      this.trimAlipayForm(form);
      return true;
    } else {
      AppUtils.showWarn("提示", "请将支付宝配置填写完整");
      return false;
    }
  }

  private trimWxpayFormForNormalModel(form: BossPayInfoAddApiForm): void{
    form.wxpayAppId = AppUtils.trimBlank(form.wxpayAppId);
    form.wxpayMchId = AppUtils.trimBlank(form.wxpayMchId);
    form.wxpayKey =  AppUtils.trimBlank(form.wxpayKey);
    form.wxpayCertPath = AppUtils.trimBlank(form.wxpayCertPath);
  }

  private trimAlipayForm(form: BossPayInfoAddApiForm): void{
    form.alipayAppId = AppUtils.trimBlank(form.alipayAppId);
    form.alipayPrivateKey = AppUtils.trimBlank(form.alipayPrivateKey);
    form.alipayDevPublicKey = AppUtils.trimBlank(form.alipayDevPublicKey);
    form.alipayZfbPublicKey =  AppUtils.trimBlank(form.alipayZfbPublicKey);
  }

  private buildFormData(): BossPayInfoAddApiForm{
    let formData = new BossPayInfoAddApiForm();
    AppUtils.copy(formData, this.viewData.bossPayInfo);
    formData.storeId = Number.parseInt(this.storeId);
    return formData;
  }

  private handleResult(restResp:RestResp){
    if(restResp.code == 200){
      AppUtils.showSuccess("提示", "提交成功！");
      this.refreshViewDataFromRestResp(restResp);
    }else{
      AppUtils.showError("提示", "提交失败，" + restResp.tips);
    }
  }

  private refreshViewDataFromRestResp(restResp:RestResp){
    let viewDataTmp = new SetBossPayInfoViewData();
    viewDataTmp.payInstructionsDocUrl = AppCfg.getInstance().getImgPreUrl() + Constants.PAY_INSTRUCTIONS_DOC;
    if (restResp != null && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {
      AppUtils.copyJson(viewDataTmp.bossPayInfo, restResp.tJson);
      viewDataTmp.bossPayInfo.wxpayModel = Number.parseInt(viewDataTmp.bossPayInfo.wxpayModel.toString());
      viewDataTmp.certFileUrl = AppCfg.getInstance().getImgPreUrl() + Constants.CERT_FILE_PRE_PATH + viewDataTmp.bossPayInfo.wxpayCertPath;
    }
    this.settingsViewDataMgr.setBossPayInfoViewData(viewDataTmp);
  }

  /**
   * 上传证书文件回调函数
   */
  showFile(filePathArr: Array<string>) {
    if (filePathArr.length > 0) {
      this.viewData.bossPayInfo.wxpayCertPath = filePathArr[0];
      this.viewData.certFileUrl = AppCfg.getInstance().getImgPreUrl() + Constants.CERT_FILE_PRE_PATH + filePathArr[0];
    }
  }

}

export class SetBossPayInfoViewData {

  public payInstructionsDocUrl:string="";

  public certFileUrl:string="";

  public bossPayInfo:BossPayInfo = new BossPayInfo();

  constructor() {
  }

}

export class SetBossPayInfoService{
  constructor(
    private bossPayInfoMgr: BossPayInfoMgr,
    private settingsViewDataMgr:SettingsViewDataMgr,){}


  public initViewData(storeId: string){
    let viewDataTmp = new SetBossPayInfoViewData();
    this.settingsViewDataMgr.setBossPayInfoViewData(viewDataTmp);

    this.buildViewData(storeId, (viewData:SetBossPayInfoViewData)=>{
      this.settingsViewDataMgr.setBossPayInfoViewData(viewData);
    })
  }

  public buildViewData(storeId: string, callback:(viewData:SetBossPayInfoViewData)=>void){
    let viewDataTmp = new SetBossPayInfoViewData();
    viewDataTmp.payInstructionsDocUrl = AppCfg.getInstance().getImgPreUrl() + Constants.PAY_INSTRUCTIONS_DOC;
    this.bossPayInfoMgr.findByStoreId(storeId).then((bossPayInfo:BossPayInfo)=>{
      if(!AppUtils.isNullObj(bossPayInfo)){
        viewDataTmp.bossPayInfo = bossPayInfo;
        viewDataTmp.bossPayInfo.wxpayModel = Number.parseInt(viewDataTmp.bossPayInfo.wxpayModel.toString());
        viewDataTmp.certFileUrl = AppCfg.getInstance().getImgPreUrl() + Constants.CERT_FILE_PRE_PATH + bossPayInfo.wxpayCertPath;
      }else{
        // AppUtils.showError("提示","加载失败");
      }
      callback(viewDataTmp);
    })
  }


  /**
   * 添加
   */
  public add(formData:BossPayInfoAddApiForm):Promise<RestResp>{
    return new Promise<RestResp>(resolve =>{
      this.bossPayInfoMgr.addAndReturnRestResp(formData).then(
        (restResp)=>{
          resolve(restResp);
        }
      );
    });
  }

  /**
   * 修改
   */
  public update(id:string, formData:BossPayInfoAddApiForm):Promise<RestResp>{
    return new Promise<RestResp>(resolve =>{
      this.bossPayInfoMgr.updateAndReturnRestResp(id,formData).then(
        (restResp)=>{
          resolve(restResp);
        }
      );
    });
  }

}
