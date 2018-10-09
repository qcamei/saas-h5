import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SessionUtil} from '../../../comModule/session/SessionUtil';
import {StoreGoodsMgr} from '../../../bsModule/storeGoods/StoreGoodsMgr';
import {StoreGoodsViewDataMgr} from '../StoreGoodsViewDataMgr';
import {GoodsType} from '../../../bsModule/storeGoods/data/GoodsType';
import {AppUtils} from '../../../comModule/AppUtils';
import {StoreGoods} from '../../../bsModule/storeGoods/data/StoreGoods';
import {GoodsUpdateForm} from '../../../bsModule/storeGoods/apiData/GoodsUpdateForm';
import {GoodsStateEnum} from '../../../bsModule/storeGoods/data/GoodsStateEnum';
import {AppRouter} from "../../../comModule/AppRouter";
import {AppCfg} from "../../../comModule/AppCfg";
import {Constants} from "../../common/Util/Constants";
import {PromptMsg} from "../../common/Util/PromptMsg";
import {
  GoodsDetailCacheDataHolder
} from "../../../bsModule/goodsDetail/GoodsDetailCacheDataHolder";
import {GoodsDetail} from "../../../bsModule/goodsDetail/data/GoodsDetail";
import {AddGoodsTypeWithReturnComp} from "../comp/addGoodsTypeWithReturn";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {MatDialog} from "@angular/material";
import {PromotionFlagEnum} from "../../../comModule/enum/PromotionFlagEnum";

/**
 * 商品管理 --> 编辑商品
 */
@Component({
  selector: 'editGoods',
  templateUrl: 'editGoods.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditGoods implements OnInit {
  private service: EditStoreGoodsService;
  public viewData: EditStoreGoodsViewData;
  private viewDataSub: any;
  private paramsSub: any;
  public imgUrl: Array<string> = [];//上传图片路径数组
  public requestUrl: string;
  public state: number;
  private goodsDetailId: number;

  constructor(private storeGoodsMgr: StoreGoodsMgr,
              private storeGoodsViewDataMgr: StoreGoodsViewDataMgr,
              private goodsDetailCacheDataHolder: GoodsDetailCacheDataHolder,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new EditStoreGoodsService(
      this.storeGoodsMgr,
      this.storeGoodsViewDataMgr,
      this.goodsDetailCacheDataHolder);
  }

  ngOnInit() {
    this.viewDataSub = this.storeGoodsViewDataMgr.subscribeEditStoreGoodsVD((viewDataP: EditStoreGoodsViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      this.goodsDetailId = params['goodsDetailId'];
      this.service.initViewData(this.goodsDetailId);
    });
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
        this.viewData.goodsDetail.typeId = addTypeId;
        this.service.handleViewData(this.viewData);
      });
  }

  /**
   * 上传图片回调函数
   */
  showImg(imgArr: Array<string>) {
    if (imgArr.length != 0) {
      if (this.viewData.goodsDetail.defaultImg == Constants.GOODS_DEFAULT_IMG) {
        AppUtils.removeFromArray(this.viewData.goodsDetail.imgPaths, this.viewData.goodsDetail.defaultImg);
      }
      this.viewData.goodsDetail.imgPaths = this.viewData.goodsDetail.imgPaths.concat(imgArr);
      this.viewData.limitCount = Constants.MAX_UPLOAD_IMG - this.viewData.goodsDetail.imgPaths.length;
    }
  }

  /**
   * 编辑商品 点击事件
   * @param goodsId:number
   */

  public async updateGoods(goodsId: string) {
    let goodsUpdateForm = this.buildUpdateForm(goodsId);
    goodsUpdateForm.name = AppUtils.trimBlank(goodsUpdateForm.name);
    let success = await this.service.editGoods(goodsUpdateForm);
    if (success) {
      AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.EDIT_SUCCESS);
      AppRouter.goStoreGoodsList();
    } else {
      AppUtils.showError(PromptMsg.PROMPT, PromptMsg.EDIT_ERROR);
    }
  }

  private buildUpdateForm(goodsId) {
    let goodsUpdateForm = new GoodsUpdateForm();

    this.viewData.state === true ? goodsUpdateForm.state = GoodsStateEnum.Open : goodsUpdateForm.state = GoodsStateEnum.Close;
    goodsUpdateForm.id = goodsId;
    goodsUpdateForm.imgPaths = this.viewData.goodsDetail.imgPaths;
    goodsUpdateForm.defaultImg = this.viewData.goodsDetail.imgPaths[0];
    goodsUpdateForm.number = this.viewData.defaultNumber;
    goodsUpdateForm.name = AppUtils.trimBlank(this.viewData.goodsDetail.name);
    goodsUpdateForm.cost = this.viewData.goodsDetail.cost;
    goodsUpdateForm.price = this.viewData.goodsDetail.price;
    goodsUpdateForm.typeId = this.viewData.goodsDetail.typeId;
    goodsUpdateForm.descript = this.viewData.goodsDetail.descript;
    goodsUpdateForm.promotionPrice = this.viewData.goodsDetail.promotionPrice;
    this.viewData.promotionFlag === true ? goodsUpdateForm.promotionFlag = PromotionFlagEnum.Yes : goodsUpdateForm.promotionFlag = PromotionFlagEnum.No;
    return goodsUpdateForm;
  }

}

class EditStoreGoodsService {

  constructor(private storeGoodsMgr: StoreGoodsMgr,
              private storeGoodsViewDataMgr: StoreGoodsViewDataMgr,
              private goodsDetailCacheDataHolder: GoodsDetailCacheDataHolder,) {
  }

  public initViewData(goodsDetailId: number): void {

    this.storeGoodsViewDataMgr.setEditStoreGoodsViewData(new EditStoreGoodsViewData());

    this.buildViewData(goodsDetailId).then((viewDataTmp: EditStoreGoodsViewData) => {
      this.handleViewData(viewDataTmp);
    }).catch(error => {
      AppUtils.handleError(error);
    });
  }

  public handleViewData(viewDataP: EditStoreGoodsViewData) {
    this.storeGoodsViewDataMgr.setEditStoreGoodsViewData(viewDataP);
  }


  public async buildViewData(goodsDetailId: number): Promise<EditStoreGoodsViewData> {
    let viewDataTmp: EditStoreGoodsViewData = new EditStoreGoodsViewData();
    let storeId = SessionUtil.getInstance().getStoreId();
    let storeGoods: StoreGoods = await this.storeGoodsMgr.getStoreGoods(storeId);
    viewDataTmp.typeList = storeGoods.getValidGoodsTypeList();
    viewDataTmp.goodsNumberList = this.getGoodsNumberList(storeGoods);
    viewDataTmp.requestUrl = AppCfg.getInstance().getServiceAddress() + '/img/saveImgs/img/goods/' + goodsDetailId;

    let goodsDetail: GoodsDetail = await this.goodsDetailCacheDataHolder.getData(goodsDetailId.toString());
    if (goodsDetail.state) {
      goodsDetail.state == GoodsStateEnum.Open ? viewDataTmp.state = true : viewDataTmp.state = false;
    }
    goodsDetail.promotionFlag == PromotionFlagEnum.Yes?viewDataTmp.promotionFlag = true:viewDataTmp.promotionFlag = false;
    viewDataTmp.goodsDetail = EditGoodsViewData.fromGoodsDetail(goodsDetail);
    viewDataTmp.defaultNumber = goodsDetail.number;
    if (goodsDetail.imgPaths) {
      viewDataTmp.limitCount -= goodsDetail.imgPaths.length;
    } else {
      viewDataTmp.goodsDetail.imgPaths.push(viewDataTmp.goodsDetail.defaultImg);
    }
    return new Promise<EditStoreGoodsViewData>(resolve => {
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

  /**
   *编辑商品方法
   *@param storeId:string
   *@param formData:GoodsAddForm
   *@returns Promise<boolean>
   */
  public editGoods(formData: GoodsUpdateForm): Promise<boolean> {
    let storeId = SessionUtil.getInstance().getStoreId();
    return new Promise<boolean>(resolve => {
      this.storeGoodsMgr.editGoods(storeId, formData).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

}


export class EditStoreGoodsViewData {
  public goodsDetail: EditGoodsViewData = new EditGoodsViewData();
  public typeList: Array<GoodsType> = new Array<GoodsType>();
  public goodsNumberList: Array<string> = new Array<string>();//编号list
  public promotionFlag:boolean;

  private _state: boolean;//上下架状态
  get state(): boolean {
    return this._state;
  }
  set state(value: boolean) {
    this._state = value;
  }

  public defaultNumber:string;
  public defaultNumberPass:boolean;
  public limitCount: number = Constants.MAX_UPLOAD_IMG;
  public maxCount: number = Constants.MAX_UPLOAD_IMG;
  public requestUrl:string;
}

export class EditGoodsViewData {
  constructor(){}
  id: string;
  goodsId:string;
  number: string;
  numberPass:boolean = true;
  name: string;
  namePass:boolean;
  typeId: string;
  state: number;
  descript: string;
  price: number;
  cost: number;
  imgPaths: Array<string> = new Array<string>();
  defaultImg: string = Constants.PRODUCT_DEFAULT_IMG;
  promotionFlag:number;
  promotionPrice: number = 0;

  public static fromGoodsDetail(goodsDetail:GoodsDetail){
    let target = new EditGoodsViewData();
    target.id = goodsDetail.id;
    target.goodsId = goodsDetail.goodsId;
    target.number = goodsDetail.number;
    target.name = goodsDetail.name;
    target.typeId = goodsDetail.typeId;
    target.descript = goodsDetail.descript;
    target.price = goodsDetail.price;
    target.cost = goodsDetail.cost;
    target.state = goodsDetail.state;
    target.imgPaths = goodsDetail.imgPaths;
    target.defaultImg = goodsDetail.imgPaths[0];
    target.promotionFlag = goodsDetail.promotionFlag;
    target.promotionPrice = goodsDetail.promotionPrice;
    return target;
  }
}
