import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppUtils} from '../../../comModule/AppUtils';
import {BusinessUtil} from "../../common/Util/BusinessUtil";
import {AppCfg} from "../../../comModule/AppCfg";
import {Constants} from "../../common/Util/Constants";
import {PromptMsg} from "../../common/Util/PromptMsg";
import {ChainGoodsViewDataMgr} from "../ChainGoodsViewDataMgr";
import {GoodsAddForm} from "../../../bsModule/chainGoods/apiData/GoodsAddForm";
import {GoodsStateEnum} from "../../../bsModule/chainGoods/data/GoodsStateEnum";
import {AppRouter} from "../../../comModule/AppRouter";
import {ChainGoods} from "../../../bsModule/chainGoods/data/ChainGoods";
import {GoodsType} from "../../../bsModule/chainGoods/data/GoodsType";
import {ChainGoodsMgr} from "../../../bsModule/chainGoods/chainGoodsMgr";
import {StoreListComp} from "../../productionLibrary/Comp/storeListComp/StoreListComp";
import {StoreMgr} from "../../../bsModule/store/storeMgr";
import {GoodsTypeComp} from "../goodsClassify/goodsClassifyModalComp";
import {StoreVD} from "../../chainPackageProject/packageProject/addPackage/addPackage";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";
import {AddGoodsTypeWithReturnComp} from "../comp/addGoodsTypeWithReturn";


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
  private chainId = SessionUtil.getInstance().getChainId();
  public viewData: AddGoodsViewData;
  private viewDataSub: any;

  constructor(private chainGoodsMgr: ChainGoodsMgr,
              private chainGoodsViewDataMgr: ChainGoodsViewDataMgr,
              private storeMgr: StoreMgr,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new AddGoodsService(this.chainGoodsMgr, this.chainGoodsViewDataMgr, this.storeMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.chainGoodsViewDataMgr.subscribeAddGoodsVD((viewDataP: AddGoodsViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData(this.chainId);
  }

  ngOnDestroy() {
    if (!AppUtils.isNullObj(this.viewDataSub)) {
      this.viewDataSub.unsubscribe();
    }
  }


  /**
   * 上传图片回调函数
   */
  showImg(imgArr: Array<string>) {

    if (this.viewData.goodsAddForm.defaultImg == Constants.GOODS_DEFAULT_IMG) {
      AppUtils.removeFromArray(this.viewData.goodsAddForm.imgPaths, this.viewData.goodsAddForm.defaultImg);
    }
    if (imgArr.length != 0) {
      this.viewData.goodsAddForm.imgPaths = this.viewData.goodsAddForm.imgPaths.concat(imgArr);
      this.viewData.pageData.limitCount -= imgArr.length;
    }
  }


  /**
   * 新建商品
   */
  public async addGoods() {
    let addForm = this.buildAddForm();
    let success = await this.service.addGoods(this.chainId, addForm);
    this.handleResult(success);
  }

  private buildAddForm() {
    let goodsAddForm = new GoodsAddForm();
    AppUtils.copy(goodsAddForm,this.viewData.goodsAddForm);
    this.viewData.pageData.state === true ? this.viewData.goodsAddForm.state = GoodsStateEnum.Open : this.viewData.goodsAddForm.state = GoodsStateEnum.Close;
    goodsAddForm.defaultImg = this.viewData.goodsAddForm.imgPaths[0];
    goodsAddForm.number = AppUtils.trimBlank(this.viewData.goodsAddForm.number);
    goodsAddForm.name = AppUtils.trimBlank(this.viewData.goodsAddForm.name);
    goodsAddForm.applyStoreIds = this.viewData.selectStoreIds;
    return goodsAddForm;
  }


  /**
   * 处理结果
   */
  private handleResult(successP: boolean): void {
    if (successP) {
      AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.NEW_SUCCESS);
      AppRouter.goChainGoodsList();
    } else {
      AppUtils.showError(PromptMsg.PROMPT, PromptMsg.NEW_ERROR);
    }
  }


  /**
   * 新建商品分类
   */
  public addType() {
    let modalData = {modalHeader: '新建分类',};
    let tmp = this;
    let callBack = (addTypeId: string) => {
      tmp.refreshTypeList(addTypeId);//回调刷新列表
    };
    ZmModalMgr.getInstance().newSmallModal(AddGoodsTypeWithReturnComp, modalData, callBack);
  }

  private refreshTypeList(addTypeId: string) {
    let chainId = SessionUtil.getInstance().getChainId();
    this.chainGoodsMgr.getChainGoods(chainId).then(
      (chainGoods) => {
        this.viewData.typeList = chainGoods.getValidGoodsTypeMap().values();
        this.viewData.goodsAddForm.typeId = Constants.GOODS_TYPE_PREFIX + chainId + "_" + addTypeId;
        this.service.handleViewData(this.viewData);
      });
  }

  /**
   * 分配
   */
  public selectStore() {
    let modalData = {storeList: this.viewData.storeList};
    let tmp = this;
    let callBack = (storeList: Array<StoreVD>) => {
      tmp.getSelectedStore(storeList);//回调刷新列表
    };
    ZmModalMgr.getInstance().newModal(StoreListComp, modalData, callBack);
  }

  private getSelectedStore(storeList: Array<StoreVD>) {
    this.viewData.selectStoreList = storeList;
    this.viewData.selectStoreIds = storeList.map((item) => {
      return item.id;
    });
    this.service.handleViewData(this.viewData);
  }

  public removeStore() {
    this.viewData.selectStoreIds = this.viewData.selectStoreList.map((item) => {
      return item.id;
    });
  }

}


class AddGoodsService {

  constructor(private chainGoodsMgr: ChainGoodsMgr,
              private chainGoodsViewDataMgr: ChainGoodsViewDataMgr,
              private storeMgr: StoreMgr,) {
  }

  public initViewData(chainId: string): void {
    this.chainGoodsViewDataMgr.setAddGoodsViewData(new AddGoodsViewData());

    this.buildViewData(chainId).then(
      (viewDataP) => {
        this.handleViewData(viewDataP);
      }).catch(error => {
      AppUtils.handleError(error);
    });
  }


  /**
   * 组装viewData
   * @param chainId
   * @returns Promise<AddGoodsViewData>
   */
  public async buildViewData(chainId: string): Promise<AddGoodsViewData> {
    let viewDataTmp = new AddGoodsViewData();

    let pageResp = await this.storeMgr.findStoreByCond(chainId);
    if (pageResp) {
      viewDataTmp.storeList = pageResp.list.map((store) => {
        return StoreVD.fromStore(store);
      });
    }

    let chainGoods: ChainGoods = await this.chainGoodsMgr.getChainGoods(chainId);
    viewDataTmp.typeList = chainGoods.getValidGoodsTypeMap().values();
    if (viewDataTmp.typeList && viewDataTmp.typeList.length > 0) {
      viewDataTmp.goodsAddForm.typeId = viewDataTmp.typeList[0].id;
    }
    viewDataTmp.goodsNumberList = this.getGoodsNumberList(chainGoods);
    let goodsIdIndex: number = await this.getGoodsIdIndex(chainId);
    viewDataTmp.goodsAddForm.index = parseInt(goodsIdIndex.toString()) + 1;
    viewDataTmp.pageData.requestUrl = AppCfg.getInstance().getServiceAddress() + "/img/saveImgs/img/goods/" + chainId + "_" + goodsIdIndex;
    viewDataTmp.goodsAddForm.imgPaths.push(viewDataTmp.goodsAddForm.defaultImg);

    let tmpNo: number = 10000001 + parseInt(goodsIdIndex + "");
    let tmpStr = BusinessUtil.numToStr(tmpNo, "G");
    viewDataTmp.goodsAddForm.number = tmpStr;

    if (AppUtils.arrayContains(viewDataTmp.goodsNumberList, viewDataTmp.goodsAddForm.number)) {
      viewDataTmp.goodsAddForm.number = BusinessUtil.numToStr(tmpNo + 1, "G");
    }

    return new Promise<AddGoodsViewData>(resolve => {
      resolve(viewDataTmp);
    });
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

  public handleViewData(viewDataP: AddGoodsViewData) {
    this.chainGoodsViewDataMgr.setAddGoodsViewData(viewDataP);
  }

  /**
   *新建商品方法
   *@param chainId:string
   *@param formData:GoodsAddForm
   *@returns Promise<boolean>
   */
  public addGoods(chainId: string, formData: GoodsAddForm): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.chainGoodsMgr.addGoods(chainId, formData).then(
        (success) => {
          resolve(success);
        }
      )
    });
  }

  /**
   * 获取goodsIdIndex,计算goodsId
   * @param   chainId:string
   * @returns Promise<number>
   */
  public getGoodsIdIndex(chainId: string): Promise<number> {
    return new Promise<number>(resolve => {
      this.chainGoodsMgr.getChainGoods(chainId).then(
        (chainGoods) => {
          resolve(chainGoods.goodsIdIndex);
        }
      );
    });
  }

}

export class AddGoodsViewData {

  public goodsAddForm = new GoodsAddForm();

  public typeList: Array<GoodsType> = new Array<GoodsType>();
  public goodsNumberList: Array<string> = new Array<string>();//编号list

  public pageData: PageData = new PageData();

  public storeList: Array<StoreVD> = new Array<StoreVD>();
  public selectStoreList: Array<StoreVD> = new Array<StoreVD>();
  public selectStoreIds: Array<string> = new Array<string>();

  constructor() {
  }

}

class PageData {
  public state = true;

  public requestUrl: string;//上传图片请求url
  public limitCount: number = Constants.MAX_UPLOAD_IMG;
  public maxCount: number = Constants.MAX_UPLOAD_IMG;
}
