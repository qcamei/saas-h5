import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {ChainDataQueryForm} from "../../../bsModule/chainDataSyn/apiData/ChainDataQueryForm";
import {GenericSelect} from "../../../comModule/bean/GenericSelect";
import {GoodsSyn} from "../../../bsModule/chainDataSyn/data/GoodsSyn";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {ChainDataSynMgr} from "../../../bsModule/chainDataSyn/ChainDataSynMgr";
import {ChainGoodsMgr} from "../../../bsModule/chainGoods/ChainGoodsMgr";
import {StoreGoodsMgr} from "../../../bsModule/storeGoods/StoreGoodsMgr";
import {PullDataViewDataMgr} from "../pullViewDataMgr";
import {GoodsType} from "../../../bsModule/chainGoods/data/GoodsType";
import {GoodsBatchCancelForm} from "../../../bsModule/storeGoods/apiData/GoodsBatchCancelForm";
import {GoodsCancelForm} from "../../../bsModule/storeGoods/apiData/GoodsCancelForm";
import {GoodsBatchPullForm} from "../../../bsModule/storeGoods/apiData/GoodsBatchPullForm";
import {GoodsPullForm} from "../../../bsModule/storeGoods/apiData/GoodsPullForm";
import {PageResp} from "../../../comModule/PageResp";
import {ChainGoods} from "../../../bsModule/chainGoods/data/ChainGoods";
import {ChainDataStatusEnum} from "../../../bsModule/chainDataSyn/data/ChainDataStatusEnum";
import {AppRouter} from "../../../comModule/AppRouter";

@Component({
  selector: 'pull-goods',
  templateUrl: 'pullGoods.html',
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class PullGoodsPage implements OnInit,OnDestroy {
  private viewDataSub: any;
  private service: PullGoodsService;
  public viewData: PullGoodsViewData;

  constructor(private chainDataSynMgr:ChainDataSynMgr,
              private chainGoodsMgr:ChainGoodsMgr,
              private storeGoodsMgr:StoreGoodsMgr,
              private pullDataViewDataMgr:PullDataViewDataMgr,
              private cdRef: ChangeDetectorRef){
    this.service = new PullGoodsService(this.chainDataSynMgr,
      this.chainGoodsMgr,
      this.storeGoodsMgr,
      this.pullDataViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.pullDataViewDataMgr.subscribePullGoodsVD((viewDataP:PullGoodsViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    })
    this.service.initViewData();
  }

  ngOnDestroy(): void {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
  }

  /**
   * 全选/反选
   * @param isSelected
   */
  checkAll(isSelected:boolean){
    if(isSelected){
      this.viewData.list.forEach((item:GenericSelect<GoodsSyn>)=>{
        if(item.target.synStatus == ChainDataStatusEnum.NOT_HAVE){
          item.isSelected = true;
        }
      })
    }else{
      this.viewData.list.forEach((item:GenericSelect<GoodsSyn>)=>{
        item.isSelected = false;
      })
    }
  }

  /**
   * 获取
   * @param id
   */
  pullData(id:string){
    this.service.pullData(id).then((success:boolean)=>{
      if(success){
        AppUtils.showSuccess("提示","获取成功");
        this.getPageData(1);
      }else{
        AppUtils.showError("提示","获取失败");
      }
    })
  }

  /**
   * 批量获取
   */
  batchPullData(){
    let idArr = [];
    this.viewData.list.forEach((item:GenericSelect<GoodsSyn>)=>{
      if(item.isSelected){
        idArr.push(item.target.id);
      }
    });
    if(idArr.length > 0){
      this.service.batchPullData(idArr).then((success:boolean)=>{
        if(success){
          AppUtils.showSuccess("提示","获取成功");
          this.getPageData(1);
        }else{
          AppUtils.showError("提示","获取失败");
        }
      })
    }else{
      AppUtils.showWarn("提示","请选择获取项");
    }
  }

  /**
   * 取消获取
   * @param id
   */
  cancelData(id){
    this.service.cancelData(id).then((success:boolean)=>{
      if(success){
        AppUtils.showSuccess("提示","取消获取成功");
        this.getPageData(1);
      }else{
        AppUtils.showError("提示","取消获取失败");
      }
    })
  }

  /**
   * 批量取消获取
   */
  batchCancelData(){
    let idArr = [];
    this.viewData.list.forEach((item:GenericSelect<GoodsSyn>)=>{
      if(item.isSelected){
        idArr.push(item.target.id);
      }
    });
    if(idArr.length > 0){
      this.service.batchCancelData(idArr).then((success:boolean)=>{
        if(success){
          AppUtils.showSuccess("提示","取消获取成功");
          this.getPageData(1);
        }else{
          AppUtils.showError("提示","取消获取失败");
        }
      })
    }else{
      AppUtils.showWarn("提示","请选择取消项");
    }
  }

  /**
   * 跳转详情
   * @param id
   */
  goDetail(id){
    AppRouter.goGoodsDetail(id);
  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage){
    if(!AppUtils.isNullObj(this.viewData.chainDataQueryForm.numberOrName)){
      this.viewData.chainDataQueryForm.numberOrName = AppUtils.isNullOrWhiteSpace(this.viewData.chainDataQueryForm.numberOrName)?'':AppUtils.trimBlank(this.viewData.chainDataQueryForm.numberOrName);
    }
    this.service.getPageData(curPage,this.viewData);
  }

}

export class PullGoodsService{
  constructor(private chainDataSynMgr:ChainDataSynMgr,
              private chainGoodsMgr:ChainGoodsMgr,
              private storeGoodsMgr:StoreGoodsMgr,
              private pullDataViewDataMgr:PullDataViewDataMgr,){}

  public initViewData():void{
    let viewDataTmp = new PullGoodsViewData();
    this.pullDataViewDataMgr.setPullGoodsViewData(viewDataTmp);

    this.buildViewData();
  }

  public async buildViewData(){
    let viewDataTmp = new PullGoodsViewData();

    let chainId = SessionUtil.getInstance().getChainId();
    let chainGoods:ChainGoods = await this.chainGoodsMgr.get(chainId);
    if(!AppUtils.isNullObj(chainGoods)){
      let typeMap = ZmMap.fromMap(GoodsType,"id",chainGoods.goodsTypeMap);
      viewDataTmp.typeList = typeMap.values();
    }

    viewDataTmp.chainDataQueryForm.chainId = chainId;
    let storeId = SessionUtil.getInstance().getStoreId();
    viewDataTmp.chainDataQueryForm.storeId = storeId;
    let pageResp: PageResp = await this.chainDataSynMgr.findChainGoods(viewDataTmp.chainDataQueryForm);
    if(!AppUtils.isNullObj(pageResp)){
      viewDataTmp.curPage = 1;
      viewDataTmp.recordCount = pageResp.totalCount;
      viewDataTmp.list = GenericSelect.fromList(pageResp.list);
    }

    viewDataTmp.loadingFinish = true;
    this.pullDataViewDataMgr.setPullGoodsViewData(viewDataTmp);
  }

  /**
   * 获取分页数据
   * @param curPage
   * @param viewData
   * @returns {Promise<void>}
   */
  public async getPageData(curPage, viewDataTmp: PullGoodsViewData) {
    viewDataTmp.loadingFinish = false;
    viewDataTmp.allChecked = false;
    viewDataTmp.recordCount = 0;
    viewDataTmp.list = [];

    let pageResp: PageResp = await this.chainDataSynMgr.findChainGoods(viewDataTmp.chainDataQueryForm);
    if(!AppUtils.isNullObj(pageResp)){
      viewDataTmp.curPage = curPage;
      viewDataTmp.recordCount = pageResp.totalCount;
      viewDataTmp.list = GenericSelect.fromList(pageResp.list);
    }

    viewDataTmp.loadingFinish = true;
    this.pullDataViewDataMgr.setPullGoodsViewData(viewDataTmp);
  }

  /**
   * 获取
   * @param id
   * @returns {Promise<boolean>}
   */
  public pullData(id:string):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let chainId = SessionUtil.getInstance().getChainId();
    let goodsPullForm = new GoodsPullForm();
    goodsPullForm.chainId = chainId;
    goodsPullForm.id = id;
    return this.storeGoodsMgr.pullGoodsFromChain(storeId,goodsPullForm);
  }

  /**
   * 批量获取
   * @param idArr
   * @returns {Promise<boolean>}
   */
  batchPullData(idArr:Array<string>):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let chainId = SessionUtil.getInstance().getChainId();
    let goodsBatchPullForm = new GoodsBatchPullForm();
    goodsBatchPullForm.goodsPullForms = idArr.map((id:string)=>{
      let goodsPullForm = new GoodsPullForm();
      goodsPullForm.chainId = chainId;
      goodsPullForm.id = id;
      return goodsPullForm;
    })
    return this.storeGoodsMgr.batchPullGoodsFromChain(storeId,goodsBatchPullForm);
  }

  /**
   * 取消获取
   * @param id
   * @returns {Promise<boolean>}
   */
  cancelData(id:string):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let chainId = SessionUtil.getInstance().getChainId();
    let goodsCancelForm = new GoodsCancelForm();
    goodsCancelForm.chainId = chainId;
    goodsCancelForm.id = id;
    return this.storeGoodsMgr.cancelChainGoods(storeId,goodsCancelForm);
  }

  /**
   * 批量取消获取
   * @param idArr
   * @returns {Promise<boolean>}
   */
  batchCancelData(idArr:Array<string>):Promise<boolean>{
    let storeId = SessionUtil.getInstance().getStoreId();
    let chainId = SessionUtil.getInstance().getChainId();
    let goodsBatchCancelForm = new GoodsBatchCancelForm();
    goodsBatchCancelForm.cancelForms = idArr.map((id:string)=>{
      let goodsCancelForm = new GoodsCancelForm();
      goodsCancelForm.chainId = chainId;
      goodsCancelForm.id = id;
      return goodsCancelForm;
    })
    return this.storeGoodsMgr.batchCancelChainGoods(storeId,goodsBatchCancelForm);
  }

}

export class PullGoodsViewData{
  public chainDataQueryForm:ChainDataQueryForm = new ChainDataQueryForm();
  public list:Array<GenericSelect<GoodsSyn>> = new Array<GenericSelect<GoodsSyn>>();
  public typeList: Array<GoodsType> = new Array<GoodsType>();
  public allChecked:boolean = false;

  public curPage: number;//当前页码
  public recordCount: number;//总记录数
  public loadingFinish: boolean = false;
}
