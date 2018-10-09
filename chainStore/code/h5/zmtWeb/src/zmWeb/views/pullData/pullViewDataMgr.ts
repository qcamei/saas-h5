import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import {PullProductViewData} from "./pullProduct/pullProduct";
import {ChainProductDetailViewData} from "./pullProduct/chainProductDetail/chainProductDetail";
import {PullGoodsViewData} from "./pullGoods/pullGoods";
import {ChainGoodsDetailViewData} from "./pullGoods/chainGoodsDetail/chainGoodsDetail";
import {PullPackageViewData} from "./pullPackage/pullPackage";
import {ChainPackageDetailViewData} from "./pullPackage/chainPackageDetail/chainPackageDetail";
import {PullCardViewData} from "./pullCard/pullCard";
import {ChainCardDetailViewData} from "./pullCard/chainCardDetail/chainCardDetail";
import {PullMemberCardViewData} from "./pullMemberCard/pullMemberCard";
import {ChainMemberCardDetailViewData} from "./pullMemberCard/chainMemberCardDetail/chainMemberCardDetail";


@Injectable()
export class PullDataViewDataMgr {

  private pullProductVD: Subject<PullProductViewData> = new BehaviorSubject<PullProductViewData>(null);
  private productDetailVD: Subject<ChainProductDetailViewData> = new BehaviorSubject<ChainProductDetailViewData>(null);

  //PullProduct
  public setPullProductViewData(viewData:PullProductViewData):void{
    this.pullProductVD.next(viewData);
  }

  public subscribePullProductVD(func:(viewData:PullProductViewData)=>void){
    this.pullProductVD.subscribe(func);
  }

  //ProductDetail
  public setProductDetailViewData(viewData:ChainProductDetailViewData):void{
    this.productDetailVD.next(viewData);
  }

  public subscribeProductDetailVD(func:(viewData:ChainProductDetailViewData)=>void){
    this.productDetailVD.subscribe(func);
  }

  /***************************商品*************************************/
  private pullGoodsVD: Subject<PullGoodsViewData> = new BehaviorSubject<PullGoodsViewData>(null);
  private goodsDetailVD: Subject<ChainGoodsDetailViewData> = new BehaviorSubject<ChainGoodsDetailViewData>(null);

  //PullGoods
  public setPullGoodsViewData(viewData:PullGoodsViewData):void{
    this.pullGoodsVD.next(viewData);
  }

  public subscribePullGoodsVD(func:(viewData:PullGoodsViewData)=>void){
    this.pullGoodsVD.subscribe(func);
  }

  //GoodsDetail
  public setGoodsDetailViewData(viewData:ChainGoodsDetailViewData):void{
    this.goodsDetailVD.next(viewData);
  }

  public subscribeGoodsDetailVD(func:(viewData:ChainGoodsDetailViewData)=>void){
    this.goodsDetailVD.subscribe(func);
  }

  /***************************套餐*************************************/
  private pullPackageVD: Subject<PullPackageViewData> = new BehaviorSubject<PullPackageViewData>(null);
  private packageDetailVD: Subject<ChainPackageDetailViewData> = new BehaviorSubject<ChainPackageDetailViewData>(null);

  //PullPackage
  public setPullPackageViewData(viewData:PullPackageViewData):void{
    this.pullPackageVD.next(viewData);
  }

  public subscribePullPackageVD(func:(viewData:PullPackageViewData)=>void){
    this.pullPackageVD.subscribe(func);
  }

  //PackageDetail
  public setPackageDetailViewData(viewData:ChainPackageDetailViewData):void{
    this.packageDetailVD.next(viewData);
  }

  public subscribePackageDetailVD(func:(viewData:ChainPackageDetailViewData)=>void){
    this.packageDetailVD.subscribe(func);
  }

  /***************************次卡*************************************/
  private pullCardVD: Subject<PullCardViewData> = new BehaviorSubject<PullCardViewData>(null);
  private cardDetailVD: Subject<ChainCardDetailViewData> = new BehaviorSubject<ChainCardDetailViewData>(null);

  //PullCard
  public setPullCardViewData(viewData:PullCardViewData):void{
    this.pullCardVD.next(viewData);
  }

  public subscribePullCardVD(func:(viewData:PullCardViewData)=>void){
    this.pullCardVD.subscribe(func);
  }

  //CardDetail
  public setCardDetailViewData(viewData:ChainCardDetailViewData):void{
    this.cardDetailVD.next(viewData);
  }

  public subscribeCardDetailVD(func:(viewData:ChainCardDetailViewData)=>void){
    this.cardDetailVD.subscribe(func);
  }

  /***************************会员卡*************************************/
  private pullMemberCardVD: Subject<PullMemberCardViewData> = new BehaviorSubject<PullMemberCardViewData>(null);
  private memberCardDetailVD: Subject<ChainMemberCardDetailViewData> = new BehaviorSubject<ChainMemberCardDetailViewData>(null);

  //PullCard
  public setPullMemberCardViewData(viewData:PullMemberCardViewData):void{
    this.pullMemberCardVD.next(viewData);
  }

  public subscribePullMemberCardVD(func:(viewData:PullMemberCardViewData)=>void){
    this.pullMemberCardVD.subscribe(func);
  }

  //MemberCardDetail
  public setMemberCardDetailViewData(viewData:ChainMemberCardDetailViewData):void{
    this.memberCardDetailVD.next(viewData);
  }

  public subscribeMemberCardDetailVD(func:(viewData:ChainMemberCardDetailViewData)=>void){
    this.memberCardDetailVD.subscribe(func);
  }

}
