import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AppUtils, ZmMap} from "../../../../comModule/AppUtils";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {Constants} from "../../../common/Util/Constants";
import {PullDataViewDataMgr} from "../../pullViewDataMgr";
import {ChainGoodsMgr} from "../../../../bsModule/chainGoods/ChainGoodsMgr";
import {GoodsDetail} from "../../../../bsModule/chainGoods/data/GoodsDetail";
import {ChainGoods} from "../../../../bsModule/chainGoods/data/ChainGoods";
import {GoodsType} from "../../../../bsModule/chainGoods/data/GoodsType";


@Component({
  selector: 'chain-product-detail',
  template: `
        <view-body-comp [headerArr]="['总店数据','商品','查看详情']">
            <div style="width:50%">
                <zm-table-detail>
                <tbody>
                  <tr>
                    <td class="bg-th" style="width:200px;">商品名称</td>
                    <td>{{viewData.goods.name}}</td>
                  </tr>
                  <tr>
                    <td class="bg-th">商品编号</td>
                    <td>{{viewData.goods.number}}</td>
                  </tr>
                  <tr>
                    <td class="bg-th">商品分类</td>
                    <td>{{viewData.typeName}}</td>
                  </tr>
                  <tr>
                    <td class="bg-th">售价</td>
                    <td><i class="fa fa-yen mr-1"></i>{{viewData.goods.sellPrice|number:'1.2-2'}}</td>
                  </tr>
                  <tr>
                    <td class="bg-th">成本价</td>
                    <td><i class="fa fa-yen mr-1"></i>{{viewData.goods.cost|number:'1.2-2'}}</td>
                  </tr>
                  <tr>
                    <td class="bg-th">状态</td>
                    <td>{{viewData.goods.state | goodsStatePipe}}</td>
                  </tr>
                  <tr>
                    <td class="bg-th">商品介绍</td>
                    <td class="c-spd-td">{{viewData.goods.descript?viewData.goods.descript:"-"}} </td>
                  </tr>
                  <tr>
                    <td class="align-middle bg-th">商品图片</td>
                    <td>
                      <ul fxLayout="row" fxLayoutAlign="start center" >
                        <div *ngIf="viewData.goods.imgPaths!=null"  fxLayout="row wrap" fxLayoutAlign="start center">
                          <li style="width:150px;height:150px;margin:5px 5px 0 0;" *ngFor="let item of viewData.goods.imgPaths">
                            <img class="w-100-p h-100-p" src="{{item | imgPrePath}}" alt="Avatar" >
                          </li>
                        </div>
                        <li style="width:150px;height:150px;margin:5px 5px 0 0;" *ngIf="viewData.goods.imgPaths==null && viewData.goods.defaultImg">
                          <img class="w-100-p h-100-p" src="{{viewData.goods.defaultImg |imgPrePath}} " alt="">
                        </li>
                        <li style="width:150px;height:150px;margin:5px 5px 0 0;" *ngIf="viewData.goods.imgPaths==null && viewData.goods.defaultImg === ''">
                          <img class="w-100-p h-100-p" src="{{viewData.defaultImg |imgPrePath}} " alt="">
                        </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </zm-table-detail>
            </div>
        </view-body-comp>
            
`,
  styles:[``],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChainGoodsDetailPage implements OnInit,OnDestroy {
  private viewDataSub: any;
  private paramsSub: any;
  private service: ChainGoodsDetailService;
  public viewData: ChainGoodsDetailViewData;

  constructor(private chainGoodsMgr:ChainGoodsMgr,
              private pullDataViewDataMgr:PullDataViewDataMgr,
              private cdRef: ChangeDetectorRef,
              public route: ActivatedRoute) {
    this.service = new ChainGoodsDetailService(
      this.chainGoodsMgr,
      this.pullDataViewDataMgr);
  }

  ngOnInit() {
    this.viewDataSub = this.pullDataViewDataMgr.subscribeGoodsDetailVD((viewDataP: ChainGoodsDetailViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
    this.paramsSub = this.route.params.subscribe(params => {
      let id = params['id'];
      this.service.initViewData(id);
    });

  }

  ngOnDestroy() {
    if(!AppUtils.isNullObj(this.viewDataSub)){
      this.viewDataSub.unsubscribe();
    }
    if(!AppUtils.isNullObj(this.paramsSub)){
      this.paramsSub.unsubscribe();
    }
  }

}

class ChainGoodsDetailService {
  constructor(private chainGoodsMgr:ChainGoodsMgr,
              private pullDataViewDataMgr:PullDataViewDataMgr,) {}

  public initViewData(id:string): void {
    this.pullDataViewDataMgr.setGoodsDetailViewData(new ChainGoodsDetailViewData());
    this.buildViewData(id);

  }

  /**
   * 组装viewData
   * @param id
   */
  public async buildViewData(id:string){
    let viewDataTmp = new ChainGoodsDetailViewData();

    let chainId = SessionUtil.getInstance().getChainId();
    let goodsDetail:GoodsDetail = await this.chainGoodsMgr.findDetail(id,chainId);
    if(!AppUtils.isNullObj(goodsDetail)){
      viewDataTmp.goods = goodsDetail;
    }
    let chainGoods: ChainGoods = await this.chainGoodsMgr.get(chainId);
    if(!AppUtils.isNullObj(chainGoods)){
      let type = ZmMap.fromMap(GoodsType,"id",chainGoods.goodsTypeMap).get(viewDataTmp.goods.typeId);
      viewDataTmp.typeName = type.name;
    }
    this.pullDataViewDataMgr.setGoodsDetailViewData(viewDataTmp);
  }

}

export class ChainGoodsDetailViewData {
  public goods: GoodsDetail = new GoodsDetail();
  public typeName:string;
  public defaultImg:string = Constants.PRODUCT_DEFAULT_IMG;
}
