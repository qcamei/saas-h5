import {Router} from "@angular/router";
/**
 * 页面路由跳转
 */

export class AppRouter {

  private static router: Router;

  constructor() {
  }

  public static setRouter(routerP: Router) {
    AppRouter.router = routerP;
  }

  /**
   * chainUser
   */
  public static goLogin() {
    AppRouter.router.navigate(["/login"]);
  }

  public static goReg(roleSet) {
    AppRouter.router.navigate(["/reg/" + roleSet]);
  }

  public static goMain() {
    AppRouter.router.navigate(["/main"]);
  }

  public static goHome() {
    AppRouter.router.navigate(["/main/home/home"]);
  }

  /**
   * 产品库
   */
  public static goLibraryList() {
    AppRouter.router.navigate(["/main/productionLibrary/libraryList"]);
  }

  /**项目列表*/
  public static goProductInfoList() {
    AppRouter.router.navigate(['/main/chainProduct/productInfoList']);
  }

  public static goAddProductInfo() {
    AppRouter.router.navigate(['/main/chainProduct/addProductInfo']);
  }

  public static goProductInfoDetail(productDetailId) {
    AppRouter.router.navigate(['/main/chainProduct/productInfoDetail/' + productDetailId]);
  }

  public static goEditProductInfo(productId) {
    AppRouter.router.navigate(['/main/chainProduct/editProductInfo/' + productId]);
  }

  public static goProductType() {
    AppRouter.router.navigate(['/main/chainProduct/productType' ]);
  }

  /**会员卡列表*/
  public static goMemberCardList() {
    AppRouter.router.navigate(['/main/chainCard/memberCard/list']);
  }

  public static goAddMemberCard() {
    AppRouter.router.navigate(['/main/chainCard/memberCard/add']);
  }

  public static goEditMemberCard(cardId) {
    AppRouter.router.navigate(['/main/chainCard/memberCard/update/'+cardId]);
  }

  public static goMemberCardDetail(cardId) {
    AppRouter.router.navigate(['/main/chainCard/memberCard/detail/' + cardId]);
  }

  /**次卡列表*/
  public static goProductCardList() {
    AppRouter.router.navigate(['/main/chainCard/productCard/list']);
  }

  public static goAddProductCard() {
    AppRouter.router.navigate(['/main/chainCard/productCard/add']);
  }

  public static goProductCardType() {
    AppRouter.router.navigate(['/main/chainCard/productCard/typeList']);
  }

  public static goEditProductCard(cardId) {
    AppRouter.router.navigate(['/main/chainCard/productCard/update/'+cardId]);
  }

  public static goProductCardDetail(cardId) {
    AppRouter.router.navigate(['/main/chainCard/productCard/detail/' + cardId]);
  }

  /**
   * chainClerkInfo 店员管理
   */

  public static goFindClerk() {
    AppRouter.router.navigate(['/main/chainClerk/findClerk']);
  }
  public static goClerkList(tabIndex) {
    AppRouter.router.navigate(['/main/chainClerk/clerkList/' + tabIndex]);
  }

  public static goManageRole() {
    AppRouter.router.navigate(['/main/chainClerk/manageRole']);
  }

  public static goAddClerk() {
    AppRouter.router.navigate(['/main/chainClerk/addClerk']);
  }

  public static goAllocationRole(clerkId) {
    AppRouter.router.navigate(['/main/chainClerk/allocationRole/' + clerkId]);
  }

  public static goAddAdminRole() {
    AppRouter.router.navigate(['/main/chainClerk/addAdminRole']);
  }

  public static goEditAdminRole(roleId) {
    AppRouter.router.navigate(['/main/chainClerk/editAdminRole/' + roleId]);
  }

  /**
   * 连锁店管理
   */
  public static goAddChain() {
    AppRouter.router.navigate(['/main/chain/addChain']);
  }

  public static goEditChain(chainId:string) {
    AppRouter.router.navigate(['/main/chain/editChain/'+chainId]);
  }

  public static goChainDetail(chainId:string,storeId:string) {
    AppRouter.router.navigate(['/main/chain/chainDetail/'+chainId+"/"+storeId]);
  }

  public static goChainList() {
    AppRouter.router.navigate(['/main/chain/storeList']);
  }


  public static goEditStore(chainId) {
    AppRouter.router.navigate(['/main/store/editStore/' + chainId]);
  }

  public static goStoreDetail(chainId) {
    AppRouter.router.navigate(['/main/store/storeDetail/' + chainId]);
  }

  public static goBossAddChain() {
    AppRouter.router.navigate(['/main/chain/addChain']);
  }

  public static goClerkApplyStore() {
    AppRouter.router.navigate(['/main/store/clerkApplyStore']);
  }

  public static goApplyStore() {
    AppRouter.router.navigate(['/main/store/applyStore']);
  }

  /**
   * chainGoods
   */
  public static goChainGoodsList() {
    AppRouter.router.navigate(['/main/chainGoods/goodsList']);
  }

  public static goFindGoodsDetail(goodsId) {
    AppRouter.router.navigate(['/main/chainGoods/goodsDetails/' + goodsId]);
  }

  public static goEditGoods(goodsDetailId) {
    AppRouter.router.navigate(['/main/chainGoods/editGoods/' + goodsDetailId]);
  }

  public static goAddChainGoods() {
    AppRouter.router.navigate(['/main/chainGoods/addGoods']);
  }

  public static goAddChainGoodsType() {
    AppRouter.router.navigate(['/main/chainGoods/goodsClassify']);
  }


  /**
   * userCenter 个人中心
   */
  public static goUserDetail() {
    AppRouter.router.navigate(["/main/userCenter/userDetail"]);
  }

  public static goChangePassword(){
    AppRouter.router.navigate(["/main/userCenter/changePassword"]);
  }


  /***
   * 套餐管理
   */

  public static goPackageList() {
    AppRouter.router.navigate(["/main/chainPackageProject/packageList"]);
  }

  public static goPackageDetail(packageDetailId) {
    AppRouter.router.navigate(["/main/chainPackageProject/packageDetail/" + packageDetailId]);
  }

  public static goAddPackageProject() {
    AppRouter.router.navigate(["/main/chainPackageProject/addPackage"]);
  }

  public static goAddPackageProjectType() {
    AppRouter.router.navigate(["/main/chainPackageProject/packageType"]);
  }

  public static goEditPackageProject(packageDetailId) {
    AppRouter.router.navigate(["/main/chainPackageProject/editPackage/"+packageDetailId]);
  }

}

