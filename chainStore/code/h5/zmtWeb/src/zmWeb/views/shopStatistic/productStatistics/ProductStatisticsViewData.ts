import {DataReportQueryForm} from "../../../bsModule/dataReport/apiData/DataReportQueryForm";
import {ProductStatisticsData} from "../../../bsModule/dataReport/apiData/ProductStatisticsData";
import {ProductStatisticsItem} from "../../../bsModule/dataReport/apiData/ProductStatisticsItem";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {Constants} from "../../common/Util/Constants";

export class ProductStatisticsViewData {


  productStatisticsData: ProductStatisticsData = new ProductStatisticsData();

  public queryForm: DataReportQueryForm = new DataReportQueryForm();

  salesTabIndex: number = 0;
  unsalesTabIndex: number = 0;
  pieTabIndex: number = 0;

  currSalesList: Array<ProductStatisticsItem> = [];//当前热销排行榜显示的数据
  currUnsalableList: Array<ProductStatisticsItem> = [];//当前滞销排行榜显示的数据

  options: {};

  unsalseDuration: number = 0;//temp 滞销天数


  public minTime: any;
  public maxTime: any;

  // hotCurPage: number = 0;//当前页码
  hotTotalSize: number = 0;//热销排行总数量
  unsaleTotalSize: number = 0;//滞销排行总数量

  unSalesPageNo: number = 1;//滞销排行当前页面
  salesPageNo: number = 1;//热销排行当前页

  public recordCount: number;//总记录数
  public loadingFinish: boolean = false;

  constructor() {
  }

  public static newInstance(): ProductStatisticsViewData {
    let target: ProductStatisticsViewData = new ProductStatisticsViewData();
    target.queryForm = new DataReportQueryForm();
    let date = new Date();
    target.minTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: 1};
    target.maxTime = {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    target.queryForm.storeId = SessionUtil.getInstance().getStoreId();
    target.productStatisticsData = new ProductStatisticsData();
    return target;
  }


  public buildViewData(): void {
    if (this.productStatisticsData) {
      //热销排行
      this.buildSalesData(1);
      //滞销排行
      this.buildUnSalesData(1);
      //销售占比
      this.buildPieData();
    }
  }

//热销排行榜
  buildSalesData(pageNum: number) {
    this.salesPageNo = pageNum;
    switch (this.salesTabIndex) {
      case 0:
        this.buildCurrSalseData(this.productStatisticsData.hotSalesList, pageNum);
        break;
      case 1:
        this.buildCurrSalseData(this.productStatisticsData.productSalesList, pageNum);
        break;
      case 2:
        this.buildCurrSalseData(this.productStatisticsData.goodsSalesList, pageNum);
        break;
      case 3:
        this.buildCurrSalseData(this.productStatisticsData.packageSalesList, pageNum);
        break;
      case 4:
        this.buildCurrSalseData(this.productStatisticsData.productCardSalesList, pageNum);
        break;
    }
  }

//滞销排行榜
  buildUnSalesData(pageNum: number) {
    this.unSalesPageNo = pageNum;
    switch (this.unsalesTabIndex) {
      case 0:
        this.buildCurrUnSalseData(this.productStatisticsData.unsalableList, pageNum);
        break;
      case 1:
        this.buildCurrUnSalseData(this.productStatisticsData.unSalesProductInfoList, pageNum);
        break;
      case 2:
        this.buildCurrUnSalseData(this.productStatisticsData.unSalesGoodsList, pageNum);
        break;
      case 3:
        this.buildCurrUnSalseData(this.productStatisticsData.unSalesPackageList, pageNum);
        break;
      case 4:
        this.buildCurrUnSalseData(this.productStatisticsData.unSalesProductCardList, pageNum);
        break;
    }
  }

  /**
   * 构建热销排行榜数据
   */
  buildCurrSalseData(targetItemList: Array<ProductStatisticsItem>, pageNo: number) {
    this.currSalesList = AppUtils.getPageItemList(targetItemList, pageNo, Constants.DEFAULT_PAGEITEMCOUNT);
    this.hotTotalSize = targetItemList.length;
    this.setListItemPosition(this.currSalesList, pageNo);
  }

  /**
   * 构建滞销排行榜数据
   */
  buildCurrUnSalseData(targetItemList: Array<ProductStatisticsItem>, pageNo: number) {
    this.currUnsalableList = AppUtils.getPageItemList(targetItemList, pageNo, Constants.DEFAULT_PAGEITEMCOUNT);
    this.unsaleTotalSize = targetItemList.length;
    this.setListItemPosition(this.currUnsalableList, pageNo);
  }

  private setListItemPosition(targetItemList: Array<ProductStatisticsItem>, pageNo: number) {
    if (targetItemList) {
      for (let i = 0; i < targetItemList.length; i++) {
        targetItemList[i].position = i + 1 + (pageNo - 1) * Constants.DEFAULT_PAGEITEMCOUNT;
      }
    }
  }

  public buildPieData() {
    let title: string;
    let datas;
    switch (this.pieTabIndex) {
      case 0:
        title = "全部";
        datas = this.getAllProductOptionsDada();
        break;
      case 1://项目
        title = "项目";
        datas = this.getPieOptionsData(this.productStatisticsData.productSalesList);
        break;
      case 2:
        title = "商品";
        datas = this.getPieOptionsData(this.productStatisticsData.goodsSalesList);
        break;
      case 3:

        title = "套餐";
        datas = this.getPieOptionsData(this.productStatisticsData.packageSalesList);
        break;
      case 4:
        console.log("次卡");
        title = "次卡";
        datas = this.getPieOptionsData(this.productStatisticsData.productCardSalesList);
        break;
    }
    this.buildOptions(title, datas);
  }

  /**
   * 全部选中时，饼图数据
   * @returns {Array<any>}
   */
  public getAllProductOptionsDada(): Array<any> {
    let datas = [];
    var prdCount: number = 0;
    this.productStatisticsData.productSalesList.map(value => {
      prdCount = parseFloat(prdCount + "") + parseFloat(value.salesVolume + "");
    });
    let goodsCount: number = 0;
    this.productStatisticsData.goodsSalesList.map(value => {
      goodsCount = parseFloat(goodsCount + "") + parseFloat(value.salesVolume + "");
    });

    let packageCount: number = 0;
    this.productStatisticsData.packageSalesList.map(value => {
      packageCount = parseFloat(packageCount + "") + parseFloat(value.salesVolume + "");
    });
    let prdCardCount: number = 0;
    this.productStatisticsData.productCardSalesList.map(value => {
      prdCardCount = parseFloat(prdCardCount + "") + parseFloat(value.salesVolume + "");
    });
    datas.push({name: "项目", value: prdCount});
    datas.push({name: "商品", value: goodsCount});
    datas.push({name: "套餐", value: packageCount});
    datas.push({name: "次卡", value: prdCardCount});
    console.log("prdCount:" + prdCount);
    console.log("goodsCount:" + goodsCount);
    console.log("packageCount:" + packageCount);
    console.log("prdCardCount:" + prdCardCount);
    return datas;
  }

  /**
   * 饼图OPTIONS
   * @param {string} title
   * @param {Array<any>} datas
   */
  buildOptions(title: string, datas: Array<any>) {
    this.options = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {d}%"
      },
      series: [
        {
          name: title,
          type: 'pie',
          radius: '60%',
          data: datas,
          itemStyle: {
            emphasis: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }


  /**
   * 饼图显示数据
   * @param {Array<ProductStatisticsItem>} productStatisticsItemList
   * @returns {Array<any>}
   */
  getPieOptionsData(productStatisticsItemList: Array<ProductStatisticsItem>): Array<any> {
    let datas = [];
    let itemMap: ZmMap<ProductStatisticsItem> = new ZmMap<ProductStatisticsItem>();
    productStatisticsItemList.map(value => {
      let productStatisticsItem: ProductStatisticsItem = itemMap.get(value.typeName);
      if (AppUtils.isNullObj(productStatisticsItem)) {
        productStatisticsItem = value;
        itemMap.put(value.typeName, productStatisticsItem);
      } else {
        productStatisticsItem.salesVolume = parseFloat(productStatisticsItem.salesVolume + "") + parseFloat(value.salesVolume + "");
      }
    });

    let itemGroupList: Array<ProductStatisticsItem> = itemMap.values();
    if (AppUtils.isNullObj(itemGroupList) || itemGroupList.length == 0) {
      let tempData: ProductStatisticsItem = new ProductStatisticsItem();
      tempData.typeName = "其他";
      tempData.salesVolume = 0;
      itemGroupList.push(tempData);
    }
    itemGroupList.map(item => {
      datas.push({name: item.typeName, value: item.salesVolume});
    });
    return datas;
  }
}
