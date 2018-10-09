import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SessionUtil} from '../../../comModule/session/SessionUtil';
import {ChainGoodsViewDataMgr} from '../ChainGoodsViewDataMgr';
import {GoodsType} from '../../../bsModule/chainGoods/data/GoodsType';
import {AppUtils} from '../../../comModule/AppUtils';
import {ChainGoods} from '../../../bsModule/chainGoods/data/ChainGoods';
import {GoodsUpdateForm} from '../../../bsModule/chainGoods/apiData/GoodsUpdateForm';
import {GoodsStateEnum} from '../../../bsModule/chainGoods/data/GoodsStateEnum';
import {AppRouter} from "../../../comModule/AppRouter";
import {AppCfg} from "../../../comModule/AppCfg";
import {Constants} from "../../common/Util/Constants";
import {PromptMsg} from "../../common/Util/PromptMsg";
import {GoodsDetail} from "../../../bsModule/chainGoods/data/GoodsDetail";
import {GoodsDetailCacheDataHolder} from "../../../bsModule/chainGoods/goodsDetailCacheSynHolder";
import {ChainGoodsMgr} from "../../../bsModule/chainGoods/chainGoodsMgr";
import {ChainGoodsSynDataHolder} from "../../../bsModule/chainGoods/chainGoodsSynDataHolder";
import {GoodsTypeComp} from "../goodsClassify/goodsClassifyModalComp";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {StoreMgr} from "../../../bsModule/store/storeMgr";
import {StoreListComp} from "../../productionLibrary/Comp/storeListComp/StoreListComp";
import {StoreVD} from "../../chainPackageProject/packageProject/addPackage/addPackage";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {AddGoodsTypeWithReturnComp} from "../comp/addGoodsTypeWithReturn";

/**
 * 商品管理 --> 编辑商品
 */
@Component({
  selector: 'editGoods',
  templateUrl: 'editGoods.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditGoods implements OnInit {
  private service: EditChainGoodsService;
  public viewData: EditChainGoodsViewData;
  private viewDataSub: any;
  private paramsSub: any;
  public imgUrl: Array<string> = [];//上传图片路径数组
  public requestUrl: string;
  public state: number;
  private goodsDetailId: number;


  constructor(private chainGoodsMgr: ChainGoodsMgr,
              private chainGoodsViewDataMgr: ChainGoodsViewDataMgr,
              private goodsDetailCacheDataHolder: GoodsDetailCacheDataHolder,
              private chainGoodsSynDataHolder: ChainGoodsSynDataHolder,
              private storeMgr: StoreMgr,
              private modalService: NgbModal,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute) {
    this.service = new EditChainGoodsService(
      this.chainGoodsMgr,
      this.chainGoodsViewDataMgr,
      this.goodsDetailCacheDataHolder,
      this.chainGoodsSynDataHolder,
      this.storeMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chainGoodsViewDataMgr.subscribeEditChainGoodsVD((viewDataP: EditChainGoodsViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      this.goodsDetailId = params['goodsDetailId'];
      let serviceAddress = AppCfg.getInstance().getServiceAddress();
      this.requestUrl = serviceAddress + '/img/saveImgs/img/goods/' + this.goodsDetailId;
      this.service.initViewData(this.goodsDetailId);
    });
  }

  /**
   * 新建分类
   */
  public addType() {
    let modalData = {modalHeader: '新建分类',};
    let tmp = this;
    let callBack = (addTypeId:string) => {
      tmp.refreshTypeList(addTypeId);//回调刷新列表
    };
    ZmModalMgr.getInstance().newSmallModal(AddGoodsTypeWithReturnComp,modalData,callBack);
  }

  private refreshTypeList(addTypeId:string) {
    let chainId = SessionUtil.getInstance().getChainId();
    this.chainGoodsMgr.getChainGoods(chainId).then(
      (chainGoods) => {
        this.viewData.typeList = chainGoods.getValidGoodsTypeMap().values();
        this.viewData.goodsDetail.typeId = Constants.GOODS_TYPE_PREFIX+chainId+"_"+addTypeId;
        this.service.handleViewData(this.viewData);
      });
  }

  /**
   * 分配
   */
  public selectStore() {
    let modalData = {storeList:this.viewData.storeList};
    let tmp = this;
    let callBack = (storeList:Array<StoreVD>) => {
      tmp.getSelectedStore(storeList);//回调刷新列表
    };
    ZmModalMgr.getInstance().newModal(StoreListComp,modalData,callBack);
  }

  private getSelectedStore(storeList:Array<StoreVD>){
    this.viewData.selectStoreList = new Array();
    this.viewData.selectStoreList = storeList;
    this.viewData.selectStoreIds =  this.viewData.selectStoreList.map((item)=>{
      return item.id;
    });
    this.service.handleViewData(this.viewData);
  }

  public removeStore(){
    this.viewData.selectStoreIds =  this.viewData.selectStoreList.map((item)=>{
      return item.id;
    });
  }


  /**
   * 上传图片回调函数
   */
  showImg(imgArr: Array<string>) {
    if (imgArr.length != 0) {
      if (this.viewData.defaultImg == Constants.GOODS_DEFAULT_IMG) {
        AppUtils.removeFromArray(this.viewData.imgPathListTmp, this.viewData.defaultImg);
      }
      this.viewData.imgPathListTmp = this.viewData.imgPathListTmp.concat(imgArr);
      this.viewData.limitCount = Constants.MAX_UPLOAD_IMG - this.viewData.imgPathListTmp.length;
    }
  }

  /**
   * 编辑商品 点击事件
   * @param goodsId:number
   */

  public async updateGoods(goodsId: string) {
    let goodsUpdateForm = this.buildUpdateForm(goodsId);
    let checkSuccess = this.checkUpdateForm(goodsUpdateForm);
    if (checkSuccess) {
      goodsUpdateForm.name = AppUtils.trimBlank(goodsUpdateForm.name);
      let success = await this.service.editGoods(goodsUpdateForm);
      this.handleResult(success);
    }
  }

  private buildUpdateForm(goodsId) {
    let goodsUpdateForm = new GoodsUpdateForm();
    this.viewData.state === true ? goodsUpdateForm.state = GoodsStateEnum.Open : goodsUpdateForm.state = GoodsStateEnum.Close;
    goodsUpdateForm.id = goodsId;
    goodsUpdateForm.imgPaths = this.viewData.imgPathListTmp;
    goodsUpdateForm.defaultImg = this.viewData.imgPathListTmp[0];
    goodsUpdateForm.number = this.viewData.defaultNumber;
    goodsUpdateForm.name = this.viewData.goodsDetail.name;
    goodsUpdateForm.cost = this.viewData.goodsDetail.cost;
    goodsUpdateForm.sellPrice = this.viewData.goodsDetail.sellPrice;
    goodsUpdateForm.typeId = this.viewData.goodsDetail.typeId;
    goodsUpdateForm.descript = this.viewData.goodsDetail.descript;
    goodsUpdateForm.applyStoreIds = this.viewData.selectStoreIds;
    return goodsUpdateForm;
  }

  /**表单验证*/
  private checkUpdateForm(goodsUpdateForm) {
    if (AppUtils.isNullObj(goodsUpdateForm.typeId)
      || AppUtils.isNullOrWhiteSpace(goodsUpdateForm.name)
      || AppUtils.isNullOrWhiteSpace(goodsUpdateForm.number)
      || AppUtils.isNullObj(goodsUpdateForm.sellPrice)
      || AppUtils.isNullObj(goodsUpdateForm.state)) {
      AppUtils.showWarn("提示", "必填项未填写");
      return false;
    } else {
      return true;
    }
  }

  /**number唯一性*/
  checkNumber() {
    if (!AppUtils.isNullOrWhiteSpace(this.viewData.defaultNumber)) {
      let number = this.viewData.goodsDetail.number;
      let numberList: Array<string> = this.viewData.goodsNumberList;

      if (this.viewData.defaultNumber != number) {
        if (AppUtils.arrayContains(numberList, this.viewData.defaultNumber)) {
          this.viewData.isExitNumber = true;
        } else {
          this.viewData.isExitNumber = false;
        }
      }

      if (this.viewData.defaultNumber.match("^\\s*[\\w-]+\\s*$")) {
        this.viewData.notRightNumber = false;
      } else {
        this.viewData.notRightNumber = true;
      }
    }
  }


  /**
   * 处理结果
   */
  private handleResult(successP: boolean): void {
    if (successP) {
      AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.EDIT_SUCCESS);
      AppRouter.goChainGoodsList();
    } else {
      AppUtils.showError(PromptMsg.PROMPT, PromptMsg.EDIT_ERROR);
    }
  }

}

export class EditChainGoodsViewData {
  public goodsDetail: GoodsDetail = new GoodsDetail();
  public typeList: Array<GoodsType> = new Array<GoodsType>();

  public storeList:Array<StoreVD> = new Array<StoreVD>();
  public selectStoreList:Array<StoreVD> = new Array<StoreVD>();
  public selectStoreIds:Array<string> = new Array<string>();

  public state: boolean = false;//上下架状态
  public imgPathListTmp: Array<string> = new Array<string>();
  public defaultImg: string = Constants.GOODS_DEFAULT_IMG;

  public goodsNumberList: Array<string> = new Array<string>();//编号list
  public isExitNumber: boolean = false; //编号是否存在
  public notRightNumber: boolean = false; //编号格式是否正确
  public defaultNumber: string;
  public defaultNumberPass:boolean;
  public limitCount: number = Constants.MAX_UPLOAD_IMG;
  public maxCount: number = Constants.MAX_UPLOAD_IMG;

}


class EditChainGoodsService {

  constructor(private chainGoodsMgr: ChainGoodsMgr,
              private chainGoodsViewDataMgr: ChainGoodsViewDataMgr,
              private goodsDetailCacheDataHolder: GoodsDetailCacheDataHolder,
              private chainGoodsSynDataHolder: ChainGoodsSynDataHolder,
              private storeMgr: StoreMgr,) {
  }

  public initViewData(goodsDetailId: number): void {

    this.chainGoodsViewDataMgr.setEditChainGoodsViewData(new EditChainGoodsViewData());

    this.buildViewData(goodsDetailId).then((viewDataTmp: EditChainGoodsViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });
  }

  public handleViewData(viewDataP: EditChainGoodsViewData) {
    this.chainGoodsViewDataMgr.setEditChainGoodsViewData(viewDataP);
  }


  public async buildViewData(goodsDetailId: number): Promise<EditChainGoodsViewData> {
    let viewDataTmp: EditChainGoodsViewData = new EditChainGoodsViewData();
    let chainId = SessionUtil.getInstance().getChainId();

    let chainGoods: ChainGoods = await this.chainGoodsSynDataHolder.getData(chainId);
    viewDataTmp.typeList = chainGoods.getValidGoodsTypeMap().values();
    viewDataTmp.goodsNumberList = this.getGoodsNumberList(chainGoods);

    let goodsDetailTmp: GoodsDetail = await this.goodsDetailCacheDataHolder.getData(goodsDetailId.toString());
    let goodsDetail: GoodsDetail = new GoodsDetail();
    AppUtils.copy(goodsDetail, goodsDetailTmp);
    if (goodsDetail.state) {
      goodsDetail.state == GoodsStateEnum.Open ? viewDataTmp.state = true : viewDataTmp.state = false;
    }
    viewDataTmp.goodsDetail = goodsDetail;

    viewDataTmp.defaultNumber = goodsDetail.number;
    if (goodsDetail.imgPaths) {
      viewDataTmp.imgPathListTmp = goodsDetail.imgPaths;//临时图片
      viewDataTmp.limitCount -= goodsDetail.imgPaths.length;
    } else {
      viewDataTmp.imgPathListTmp.push(viewDataTmp.defaultImg);
    }

    let pageResp = await this.storeMgr.findStoreByCond(chainId);
    if(pageResp){
      viewDataTmp.storeList = pageResp.list.map((store)=>{
        return StoreVD.fromStore(store);
      });
    }

    if(viewDataTmp.goodsDetail){
      viewDataTmp.selectStoreList = this.getSelectStoreList(viewDataTmp.storeList,viewDataTmp.goodsDetail.applyStoreIds);
      viewDataTmp.selectStoreIds = viewDataTmp.selectStoreList.map((item)=>{
        return item.id;
      });
    }

    return new Promise<EditChainGoodsViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }

  private getSelectStoreList(storeList:Array<StoreVD>,applyStoreIds:Array<string>){
    let storeListTmp = new Array<StoreVD>();
    if(applyStoreIds){
      for(let id of applyStoreIds){
        storeList.forEach((item)=>{
          if(item.id == id){
            item.checked = true;
            storeListTmp.push(item);
          }
        });
      }
    }
    return storeListTmp;
  }

  /**获取所有商品编号*/
  private getGoodsNumberList(chainGoods: ChainGoods) {
    let goodsList = chainGoods.getAllGoodsMap().values();
    let numberList: Array<string> = new Array<string>();
    for (let goods of goodsList) {
      numberList.push(goods.number);
    }
    return numberList;
  }

  /**
   *编辑商品方法
   *@param chainId:string
   *@param formData:GoodsAddForm
   *@returns Promise<boolean>
   */
  public editGoods(formData: GoodsUpdateForm): Promise<boolean> {
    let chainId = SessionUtil.getInstance().getChainId();
    return new Promise<boolean>(resolve => {
      this.chainGoodsMgr.editGoods(chainId, formData).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

}
