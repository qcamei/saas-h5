import {Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {LeaguerRecord} from "../../../../bsModule/leaguerRecord/data/LeaguerRecord";
import {AppUtils} from "../../../../comModule/AppUtils";
import {StoreLeaguerInfoViewDataMgr} from "../../StoreLeaguerInfoViewDataMgr";
import {LeaguerRecordMgr} from "../../../../bsModule/leaguerRecord/LeaguerRecordMgr";
import {ActivatedRoute} from "@angular/router";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {StoreProductInfo} from "../../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {StoreProductInfoSynDataHolder} from "../../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";

/**
 * 会员跟进记录详情
 */
@Component({
  selector:'record-detail',
  templateUrl:'recordDetail.html',
  styleUrls:['recordDetail.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordDetailPage implements OnInit,OnDestroy {

  private viewDataSub:any;
  private paramSub:any;
  private service:RecordDetailService;
  public viewData:RecordDetailViewData;

  constructor(private leaguerRecordMgr:LeaguerRecordMgr,
              private storeProductInfoSynDataHolder:StoreProductInfoSynDataHolder,
              private storeLeaguerInfoViewDataMgr:StoreLeaguerInfoViewDataMgr,
              private route:ActivatedRoute,
              private cdRef:ChangeDetectorRef) {
    this.service = new RecordDetailService(this.leaguerRecordMgr,this.storeProductInfoSynDataHolder,this.storeLeaguerInfoViewDataMgr);
  }

  ngOnInit(): void {
    this.viewDataSub = this.storeLeaguerInfoViewDataMgr.subscribeRecordDetailVD((viewDataP:RecordDetailViewData)=>{
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    })

    this.paramSub = this.route.params.subscribe((params)=>{
      let leaguerRecordId = params['leaguerRecordId'];
      this.service.initViewData(leaguerRecordId);
    })
  }

  ngOnDestroy(): void {

  }

}

export class RecordDetailService{
  constructor(private leaguerRecordMgr:LeaguerRecordMgr,
              private storeProductInfoSynDataHolder:StoreProductInfoSynDataHolder,
              private storeLeaguerInfoViewDataMgr:StoreLeaguerInfoViewDataMgr,){}

  public initViewData(leaguerRecordId:string){
    let viewDataTmp = new RecordDetailViewData();
    this.storeLeaguerInfoViewDataMgr.setRecordDetailViewData(viewDataTmp);
    this.buildViewData(leaguerRecordId,(viewData:RecordDetailViewData)=>{
      this.storeLeaguerInfoViewDataMgr.setRecordDetailViewData(viewData);
    })
  }

  private async buildViewData(leaguerRecordId:string,callback:(viewData:RecordDetailViewData)=>void){
    let viewDataTmp = new RecordDetailViewData();
    let leaguerRecord:LeaguerRecord = await this.leaguerRecordMgr.get(leaguerRecordId);
    if(!AppUtils.isNullObj(leaguerRecord)){
      viewDataTmp.leaguerRecord = leaguerRecord;
      viewDataTmp.leaguerRecord.imgPaths = viewDataTmp.leaguerRecord.imgPaths?viewDataTmp.leaguerRecord.imgPaths:[];

      if (!AppUtils.isNullObj(leaguerRecord.relateProduct)
        && !AppUtils.isNullObj(leaguerRecord.relateProduct.prdIds)
        && leaguerRecord.relateProduct.prdIds.length > 0) {
        let storeId = SessionUtil.getInstance().getStoreId();
        let storeProductInfo:StoreProductInfo = await this.storeProductInfoSynDataHolder.getData(storeId);
        if (!AppUtils.isNullObj(storeProductInfo)) {
          let prdInfoMap = storeProductInfo.getAllProductInfoMap();
          leaguerRecord.relateProduct.prdIds.forEach((id) => {
            let productInfo = prdInfoMap.get(id.toString());
            if (!AppUtils.isNullObj(productInfo)) {
              viewDataTmp.relatePrdArr.push(productInfo.name);
            }
          })
        }
      }
    }else{
      AppUtils.showError("提示","加载失败");
    }
    callback(viewDataTmp);
  }

}

export class RecordDetailViewData{
  public relatePrdArr = new Array<string>();
  public leaguerRecord:LeaguerRecord = new LeaguerRecord();
  constructor(){
    this.leaguerRecord.imgPaths = new Array<string>();
  }
}
