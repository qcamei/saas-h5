/**
 * 商城订单详情 列表项
 */
export class ShoppingOrderItem {
  itemType: string;//列表项类型， 项目、商品、套餐
  pgName: string;//名称
  price: number;//价格
  count: number;//消费次数
  defaultImg: string;//默认图片
  typeName: string;//类型名称
  total: number;//小计
  discount: number;

  public static newInstance(): ShoppingOrderItem{
    return new ShoppingOrderItem();
  }
}
