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

  public static goLogin(){
    AppRouter.router.navigate(["/login"]);
  }

  public static goMain(){
    AppRouter.router.navigate(["/main"]);
  }

  public static goHome(){
    AppRouter.router.navigate(["/main/home/index"]);
  }

  public static goBUserList(){
    AppRouter.router.navigate(["/main/buser/nuserList"]);
  }






















}

