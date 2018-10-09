export  enum  StoreProductInfoUpdateType{

  AddProductInfo = 0,
  UpdateProductInfo = 1,
  RemoveProductInfo = 2,
  UpdateProductState = 3,
  BatchUpdateProductState = 4,

  AddProductType = 5,
  UpdateProductType = 6,
  RemoveProductType = 7,

  AddProductToTop = 8,
  CancelProductFromTop = 9,

  AddPackedProductInfo = 10,
  UpdatePackedProductInfo = 11,
  UpdatePackedProductState = 12,
  RemovePackedProductInfo = 13,
  UpdateProductBeautician = 14,
  UpdateProductMaterial = 15,

  AddListFromExcel = 16,
  AddListFromStore = 17,

    /*************************连锁店数据同步**************************************/
  PullProductFromChain=18,//("拉取连锁店项目"),
  CancelChainProduct=19,//("取消获取连锁店项目"),
  BatchPullProductFromChain=20,//("批量拉取连锁店项目"),
  BatchCancelChainProduct=21,//("批量取消连锁店项目"),

}



