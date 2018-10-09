import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {LeaguerDetailQueryForm} from "../../../bsModule/leaguerDetail/apiData/LeaguerDetailQueryForm";
import {SortTypeEnum} from "../../../bsModule/leaguerDetail/data/SortTypeEnum";
import {SortEnum} from "../../../comModule/enum/SortEnum";

export class LeaguerListViewData{
  public queryForm:LeaguerDetailQueryForm = new LeaguerDetailQueryForm();
  public list:Array<LeaguerDetail> = new Array<LeaguerDetail>();

  public tabList = [{name:'全部',value:0},{name:'优质会员',value:1},{name:'风险流失会员',value:2},{name:'静止会员',value:3},{name:"标星会员",value:4}];
  public selectedTab = this.tabList[0];

  public sortTabList = [{name:'来店时间',value:1,sort:SortEnum.DESC},{name:'客单价',value:2,sort:SortEnum.DESC},{name:'消费总额',value:3,sort:SortEnum.DESC},{name:'来店频率',value:4,sort:SortEnum.DESC}];
  public selectedSortType = this.sortTabList[0];
  public sortTypeAttr = this.sortTabList[0].name;

  public page:number;//当前页码
  public recordCount:number;//总记录数

  public loadingFinish:boolean = false;

  constructor(){
    this.queryForm.sortType = SortTypeEnum.LastConsumeTime;
  }
}
