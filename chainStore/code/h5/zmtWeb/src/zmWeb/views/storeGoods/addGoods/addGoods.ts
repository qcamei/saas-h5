import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {GoodsAddForm} from "../../../bsModule/storeGoods/apiData/GoodsAddForm";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreGoodsMgr} from '../../../bsModule/storeGoods/StoreGoodsMgr';
import {GoodsType} from '../../../bsModule/storeGoods/data/GoodsType';
import {StoreGoodsViewDataMgr} from '../StoreGoodsViewDataMgr';
import {AppUtils} from '../../../comModule/AppUtils';
import {StoreGoods} from '../../../bsModule/storeGoods/data/StoreGoods';
import {BusinessUtil} from "../../common/Util/BusinessUtil";
import {AppCfg} from "../../../comModule/AppCfg";
import {Constants} from "../../common/Util/Constants";
import {PromptMsg} from "../../common/Util/PromptMsg";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {MatDialog} from "@angular/material";
import {AddGoodsTypeWithReturnComp} from "../comp/addGoodsTypeWithReturn";
import {RestResp} from "../../../comModule/RestResp";
import {PromotionFlagEnum} from "../../../comModule/enum/PromotionFlagEnum";


/**
 * 商品管理--> 新建商品
 */
@Component({
  selector: 'addGoods',
  templateUrl: 'addGoods.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddGoods implements OnInit,OnDestroy {

  private service: AddGoodsService;
  private storeId = SessionUtil.getInstance().getStoreId();
  public viewData: AddGoodsViewData;
  private viewDataSub: any;

  constructor(private storeGoodsMgr: StoreGoodsMgr,
              private storeGoodsViewDataMgr: StoreGoodsViewDataMgr,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new AddGoodsService(this.storeGoodsMgr, this.storeGoodsViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.storeGoodsViewDataMgr.subscribeAddGoodsVD((viewDataP: AddGoodsViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData(this.storeId);
  }

  ngOnDestroy() {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }

  public addType() {
    let modalData = {modalHeader: '新建分类',};
    let tmp = this;
    let callBack = (addTypeId: string) => {
      tmp.refreshTypeList(addTypeId);//回调刷新列表
    };
    ZmModalMgr.getInstance().newSmallModal(AddGoodsTypeWithReturnComp, modalData, callBack);
  }

  private refreshTypeList(addTypeId: string) {
    let storeId = SessionUtil.getInstance().getStoreId();
    this.storeGoodsMgr.getStoreGoods(storeId).then(
      (storeGoods: StoreGoods) => {
        this.viewData.typeList = storeGoods.getValidGoodsTypeMap().values();
        this.viewData.addFormData.typeId = addTypeId;
        this.service.handleViewData(this.viewData);
      });
  }

  /**
   * 上传图片回调函数
   */
  showImg(imgArr: Array<string>) {

    if (this.viewData.addFormData.defaultImg == Constants.GOODS_DEFAULT_IMG) {
      AppUtils.removeFromArray(this.viewData.addFormData.imgPaths, this.viewData.addFormData.defaultImg);
    }
    if (imgArr.length != 0) {
      this.viewData.addFormData.imgPaths = this.viewData.addFormData.imgPaths.concat(imgArr);
      this.viewData.pageData.limitCount -= imgArr.length;
    }
  }

  /**
   * 新建商品点击事件
   */
  public async addGoods() {
    if(this.viewData.addFormData.promotionPrice>this.viewData.addFormData.price){
      AppUtils.showWarn("提示","促销价不能大于售价");
      return;
    }
    let addForm = GoodsAddForm.fromAddFormData(this.viewData.addFormData);
    let restResp: RestResp = await this.service.addGoods(this.storeId, addForm);
    this.handleResult(restResp);
  }

  private handleResult(restResp:RestResp): void {
    if (!AppUtils.isNullObj(restResp)){
      if(restResp.code == 200){
        AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.NEW_SUCCESS);
        history.go(-1);
      }else if(restResp.code == 500){
        AppUtils.showError(PromptMsg.PROMPT,PromptMsg.NEW_ERROR);
      }else{
        AppUtils.showError(PromptMsg.PROMPT,restResp.tips);
      }
    }else{
      AppUtils.showError(PromptMsg.PROMPT,PromptMsg.NEW_ERROR);
    }
  }


}


class AddGoodsService {

  constructor(private storeGoodsMgr: StoreGoodsMgr,
              private storeGoodsViewDataMgr: StoreGoodsViewDataMgr) {
  }

  public initViewData(storeId: string): void {
    this.storeGoodsViewDataMgr.setAddGoodsViewData(new AddGoodsViewData());

    this.buildViewData(storeId).then(
      (viewDataP) => {
        this.handleViewData(viewDataP);
      }).catch(error => {
      AppUtils.handleError(error);
    });
  }


  /**
   * 组装viewData
   * @param storeId
   * @returns Promise<AddGoodsViewData>
   */
  public async buildViewData(storeId: string): Promise<AddGoodsViewData> {
    let viewDataTmp = new AddGoodsViewData();
    let storeGoods: StoreGoods = await this.storeGoodsMgr.getStoreGoods(storeId);
    viewDataTmp.typeList = storeGoods.getValidGoodsTypeList();
    if (viewDataTmp.typeList.length > 0) {
      viewDataTmp.addFormData.typeId = viewDataTmp.typeList[0].id;
    }

    viewDataTmp.goodsNumberList = this.getGoodsNumberList(storeGoods);

    let goodsIdIndex: number = await this.getGoodsIdIndex(storeId);
    viewDataTmp.addFormData.index = parseInt(goodsIdIndex.toString()) + 1;
    viewDataTmp.pageData.requestUrl = AppCfg.getInstance().getServiceAddress() + "/img/saveImgs/img/goods/" + storeId + "_" + goodsIdIndex;
    viewDataTmp.addFormData.imgPaths.push(viewDataTmp.addFormData.defaultImg);

    let tmpNo: number = 10000001 + parseInt(goodsIdIndex + "");
    let tmpStr = BusinessUtil.numToStr(tmpNo, "G");
    viewDataTmp.addFormData.number = tmpStr;

    if (AppUtils.arrayContains(viewDataTmp.goodsNumberList, viewDataTmp.addFormData.number)) {
      viewDataTmp.addFormData.number = BusinessUtil.numToStr(tmpNo + 1, "P");
    }

    return new Promise<AddGoodsViewData>(resolve => {
      resolve(viewDataTmp);
    });
  }

  /**获取所有商品编号*/
  private getGoodsNumberList(storeGoods: StoreGoods) {
    let goodsList = storeGoods.getAllGoodsList();
    let numberList: Array<string> = new Array<string>();
    for (let goods of goodsList) {
      numberList.push(goods.number);
    }
    return numberList;
  }

  public handleViewData(viewDataP: AddGoodsViewData) {
    this.storeGoodsViewDataMgr.setAddGoodsViewData(viewDataP);
  }

  /**
   *新建商品方法
   *@param storeId:string
   *@param formData:GoodsAddForm
   *@returns Promise<boolean>
   */
  public addGoods(storeId: string, formData: GoodsAddForm): Promise<RestResp> {
    return new Promise<RestResp>(resolve => {
      this.storeGoodsMgr.addGoods(storeId, formData).then(
        (restResp) => {
          resolve(restResp);
        }
      )
    });
  }

  /**
   * 获取goodsIdIndex,计算goodsId
   * @param   storeId:string
   * @returns Promise<number>
   */
  public getGoodsIdIndex(storeId: string): Promise<number> {
    return new Promise<number>(resolve => {
      this.storeGoodsMgr.getStoreGoods(storeId).then(
        (storeGoods) => {
          resolve(storeGoods.goodsIdIndex);
        }
      );
    });
  }

}

export class AddGoodsViewData {

  public addFormData = new AddViewData();

  public typeList: Array<GoodsType> = new Array<GoodsType>();

  public goodsNumberList: Array<string> = new Array<string>();//编号list

  public pageData: PageData = new PageData();

  constructor() {
  }

}

class PageData {
  public requestUrl: string;//上传图片请求url
  public limitCount: number = Constants.MAX_UPLOAD_IMG;
  public maxCount: number = Constants.MAX_UPLOAD_IMG;
}


export class AddViewData {
  index: number;
  number: string;
  numberPass: boolean;
  name: string;
  namePass: boolean;
  typeId: string;
  price: number = 0;
  cost: number = 0;
  state: boolean = true;
  descript: string;
  defaultImg: string = Constants.GOODS_DEFAULT_IMG;
  imgPaths: Array<string> = new Array<string>();
  promotionFlag: boolean = false;
  promotionPrice: number = 0;
}
