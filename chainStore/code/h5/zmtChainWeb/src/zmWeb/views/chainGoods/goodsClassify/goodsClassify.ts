import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from "@angular/core";
import {SessionUtil} from '../../../comModule/session/SessionUtil';
import {ChainGoodsViewDataMgr} from '../ChainGoodsViewDataMgr';
import {GoodsType} from '../../../bsModule/chainGoods/data/GoodsType';
import {AppUtils} from '../../../comModule/AppUtils';
import {GoodsTypeRemoveForm} from '../../../bsModule/chainGoods/apiData/GoodsTypeRemoveForm';
import {BusinessUtil} from '../../common/Util/BusinessUtil';
import {PromptMsg} from "../../common/Util/PromptMsg";
import {Goods} from "../../../bsModule/chainGoods/data/Goods";
import {ChainGoodsSynDataHolder} from "../../../bsModule/chainGoods/chainGoodsSynDataHolder";
import {ChainGoods} from "../../../bsModule/chainGoods/data/ChainGoods";
import {Popup} from "../../common/popup/popup";
import {ChainGoodsMgr} from "../../../bsModule/chainGoods/chainGoodsMgr";
import {GoodsTypeComp} from "./goodsClassifyModalComp";
import {MatDialog} from "@angular/material";
import {ZmModalMgr} from "../../zmComp/modal/ZmModalMgr";

@Component({
  selector: 'goodsClassify',
  templateUrl: 'goodsClassify.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GoodsClassify implements OnInit,OnDestroy {
  private service: ChainGoodsTypeListService;
  public viewData: ChainGoodsTypeListViewData;
  private viewDataSub: any;

  public typeName: string;//查询输入框的值

  constructor(private chainGoodsMgr: ChainGoodsMgr,
              private ChainGoodsSynDataHolder: ChainGoodsSynDataHolder,
              private chainGoodsViewDataMgr: ChainGoodsViewDataMgr,
              private cdRef: ChangeDetectorRef,
              private matDialog: MatDialog) {
    ZmModalMgr.getInstance().reset(matDialog);

    this.service = new ChainGoodsTypeListService(this.chainGoodsMgr, this.chainGoodsViewDataMgr, this.ChainGoodsSynDataHolder);
  }

  ngOnInit() {

    this.viewDataSub = this.chainGoodsViewDataMgr.subscribeChainGoodsTypeListVD((viewDataP: ChainGoodsTypeListViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.service.initViewData();
  }

  ngOnDestroy() {

  }

  //新建模态框
  newModal() {
    let modalData = {modalHeader: '新建分类',};
    let tmp = this;
    let callBack = () => {
      tmp.service.initViewData();//回调刷新列表
    };
    ZmModalMgr.getInstance().newSmallModal(GoodsTypeComp, modalData, callBack);
  }

  //编辑模态框
  compileModal(typeId: string) {
    let modalData = {modalHeader: '编辑分类', typeId: typeId};
    let tmp = this;
    let callBack = () => {
      tmp.service.initViewData();//回调刷新列表
    };
    ZmModalMgr.getInstance().newSmallModal(GoodsTypeComp, modalData, callBack);
  }

  public deleteType(type: GoodsType) {
    let tmp = this;
    Popup.getInstance().open("删除商品分类", "确定删除#" + type.name + "#?", () => {

      //判断商品分类下面是否有商品
      this.checkHasUsed(type).then(
        (canDelete) => {
          if (canDelete) {//true
            tmp.removeType(type);
          } else {
            tmp.showMsg();
          }
        }
      );

    });

  }

  private async checkHasUsed(type: GoodsType) {
    let canDelete = true;//可以删
    let chainId = SessionUtil.getInstance().getChainId();
    let chainGoods: ChainGoods = await this.ChainGoodsSynDataHolder.getData(chainId);
    let goodsList: Array<Goods> = chainGoods.getValidGoodsMap().values();
    let typeIds: Array<string> = new Array<string>();
    goodsList.forEach((item) => {
      typeIds.push(item.typeId);
    });
    if (AppUtils.arrayContains(typeIds, type.id)) {
      canDelete = false;
    }
    return canDelete;
  }

  private removeType(type: GoodsType) {
    let removeTypeData = new GoodsTypeRemoveForm();
    removeTypeData.id = type.id;
    this.service.deleteType(removeTypeData).then(
      (success) => {
        if (success) {
          AppUtils.showSuccess(PromptMsg.PROMPT, PromptMsg.DELETE_SUCCESS);
          this.service.initViewData();
        } else {
          AppUtils.showError(PromptMsg.PROMPT, PromptMsg.DELETE_ERROR);
        }
      }
    );
  }

  private showMsg() {
    Popup.getInstance().open("提示", "该分类下还有商品，请移除后再进行删除", () => {
    });
  }

  /**
   * 根据名称查询商品分类 (支持模糊查询)
   */
  queryTypeListByName() {
    this.service.queryTypeListReq(this.viewData, this.typeName, (viewDataTmp) => {
      this.handleResult(viewDataTmp);
    });
  }

  private  handleResult(viewDataTmp: ChainGoodsTypeListViewData) {
    if (!AppUtils.isNullObj(viewDataTmp)) {
      this.viewData.goodsTypeListTmp = viewDataTmp.goodsTypeListTmp;
      this.viewData.recordCount = viewDataTmp.recordCount;
      this.viewData.goodsTypeListShow = viewDataTmp.goodsTypeListShow;
      this.viewData.curPage = 1;
    }
    this.chainGoodsViewDataMgr.setChainGoodsTypeListViewData(this.viewData);

  }

  /**
   * 分页过滤数据
   */
  getPageData(curPage) {
    this.viewData.curPage = curPage;
    let data = this.viewData.goodsTypeListTmp;
    let pageData = AppUtils.getPageData(curPage, data);
    this.viewData.goodsTypeListShow = pageData;
  }


}

export class ChainGoodsTypeListViewData {
  goodsTypeList: Array<GoodsType> = new Array<GoodsType>();
  goodsTypeListTmp: Array<GoodsType> = new Array<GoodsType>();//临时数据
  recordCount: number;//分页记录数
  goodsTypeListShow: Array<GoodsType> = new Array<GoodsType>();//显示数据

  loadingFinish: boolean = false;
  public curPage = 1;


}


class ChainGoodsTypeListService {

  constructor(private chainGoodsMgr: ChainGoodsMgr,
              private chainGoodsViewDataMgr: ChainGoodsViewDataMgr,
              private chainGoodsSynDataHolder: ChainGoodsSynDataHolder,) {
  }

  public initViewData() {
    this.chainGoodsViewDataMgr.setChainGoodsTypeListViewData(new ChainGoodsTypeListViewData());

    let chainId = SessionUtil.getInstance().getChainId();
    this.buildViewData(chainId).then(
      (viewDataTmp: ChainGoodsTypeListViewData) => {
        this.handleViewData(viewDataTmp);
      }).catch(error => {
      AppUtils.handleError(error);
    });


  }

  public handleViewData(viewDataP: ChainGoodsTypeListViewData) {
    this.chainGoodsViewDataMgr.setChainGoodsTypeListViewData(viewDataP);
  }


  /**
   * 组装typeListViewData
   * @param chainId:string
   * @returns Promise<ChainGoodsTypeListViewData>
   */
  public async  buildViewData(chainId: string): Promise<ChainGoodsTypeListViewData> {
    let viewDataTmp: ChainGoodsTypeListViewData = new ChainGoodsTypeListViewData();

    let chainGoods: ChainGoods = await this.chainGoodsMgr.getChainGoods(chainId);
    let goodsTypeListTmp = chainGoods.getValidGoodsTypeMap().values();

    viewDataTmp.goodsTypeList = goodsTypeListTmp;
    goodsTypeListTmp = BusinessUtil.sortListObject(goodsTypeListTmp);//排序
    viewDataTmp.goodsTypeListTmp = goodsTypeListTmp;
    viewDataTmp.recordCount = goodsTypeListTmp.length;
    viewDataTmp.goodsTypeListShow = AppUtils.getPageData(1, goodsTypeListTmp);
    viewDataTmp.loadingFinish = true;

    return new Promise<ChainGoodsTypeListViewData>(resolve => {
      resolve(viewDataTmp);
    });

  };

  /**
   * 根据名称查询分类列表
   * @param chainId:string
   * @param name:string
   * @param handleCallBack:(goodsTypeListTmp:Array<GoodsType>)
   **/

  public async queryTypeListReq(viewData: ChainGoodsTypeListViewData, name: string, handleCallBack: (viewDataTmp: ChainGoodsTypeListViewData) => void) {
    name = AppUtils.trimBlank(name);
    let viewDataTmp: ChainGoodsTypeListViewData = new ChainGoodsTypeListViewData();
    let goodsTypeListTmp: Array<GoodsType> = this.filterByName(viewData.goodsTypeList, name);
    goodsTypeListTmp = BusinessUtil.sortListObject(goodsTypeListTmp);//排序
    viewDataTmp.goodsTypeListTmp = goodsTypeListTmp;
    viewDataTmp.recordCount = goodsTypeListTmp.length;
    viewDataTmp.goodsTypeListShow = AppUtils.getPageData(1, goodsTypeListTmp);
    handleCallBack(viewDataTmp);
  };

  /**根据名称过滤商品分类列表*/
  private filterByName(goodsTypeList: Array<GoodsType>, name: string) {
    let goodsTypeListTmp: Array<GoodsType> = new Array<GoodsType>();
    goodsTypeListTmp = goodsTypeList.filter(itemTmp => {
      if (itemTmp.name.indexOf(name) != -1) {
        return true;
      } else {
        return false;
      }
    });
    return goodsTypeListTmp;
  }

  public deleteType(removeForm: GoodsTypeRemoveForm) {
    let chainId = SessionUtil.getInstance().getChainId();
    return new Promise<boolean>(resolve => {
      this.chainGoodsMgr.deleteGoodsType(chainId, removeForm).then(
        (success) => {
          resolve(success);
        });

    });
  }

}
