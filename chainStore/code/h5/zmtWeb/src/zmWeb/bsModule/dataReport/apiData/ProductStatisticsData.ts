import {ProductStatisticsItem} from "./ProductStatisticsItem";

export class ProductStatisticsData {

  totalProductCount: number;//所有产品总数，不包含已下架的

  unsalableProductCount: number;//滞销产品总数，不包含已下架的

  hotSalesList: Array<ProductStatisticsItem> = [];//热销排行榜

  unsalableList: Array<ProductStatisticsItem> = [];//滞销排行榜

  productSalesList: Array<ProductStatisticsItem> = [];//项目销售列表

  goodsSalesList: Array<ProductStatisticsItem> = [];//商品销售列表

  packageSalesList: Array<ProductStatisticsItem> = [];//套餐销售列表

  productCardSalesList: Array<ProductStatisticsItem> = [];//次卡销售列表

  unSalesProductInfoList: Array<ProductStatisticsItem> = [];//滞销项目

  unSalesGoodsList: Array<ProductStatisticsItem> = [];//滞销商品

  unSalesPackageList: Array<ProductStatisticsItem> = [];//滞销套餐

  unSalesProductCardList: Array<ProductStatisticsItem> = [];//滞销次卡
}
