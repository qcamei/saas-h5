import {Router} from "@angular/router";
/**
 * Created by sunbirdjob on 2017/11/20.
 */

export class AppRouter {

  private static router: Router;

  constructor(){}

  public static setRouter( routerP: Router){
    AppRouter.router = routerP;
  }

  /**
   * buser
   */
  public static goBUserList(phone){
    AppRouter.router.navigate(["/main/buser/buserList/"+ phone]);
  }
  public static goLogin(){
    AppRouter.router.navigate(["/login"]);
  }

  public static goReg(roleSet){
    AppRouter.router.navigate(["/reg/"+roleSet]);
  }

  public static goMain(){
    AppRouter.router.navigate(["/main"]);
  }

  public static goHome(){
    AppRouter.router.navigate(["/main/home/home"]);
  }

  public static goExpired() {
    AppRouter.router.navigate(['/main/error/expired']);
  }

  public static goBossAddStore() {
    AppRouter.router.navigate(['/main/store/bossAddStore']);
  }

  public static goClerkApplyStore() {
    AppRouter.router.navigate(['/main/store/clerkApplyStore']);
  }



  public static goVipLevelList(){
    AppRouter.router.navigate(["/main/vipLevel/vipLevelList"]);
  }

  public static goAddVipLevelPage(){
    AppRouter.router.navigate(["/main/vipLevel/addVipLevel/"]);
  }

  public static goEditVipLevelPage(vipLevelId:number){
    AppRouter.router.navigate(["/main/vipLevel/editVipLevel/"+vipLevelId]);
  }

  /**
   * 收费管理
   */
  public static goChargeList(){
    AppRouter.router.navigate(["/main/charge/chargeList"]);
  }

  public static goAddCharge(){
    AppRouter.router.navigate(["/main/charge/addCharge"]);
  }

  public static goEditCharge(chargeId){
    AppRouter.router.navigate(["/main/charge/editCharge/"+chargeId]);
  }

}

