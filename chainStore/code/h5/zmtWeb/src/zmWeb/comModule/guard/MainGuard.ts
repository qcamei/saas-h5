import {CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {AppUtils} from "../AppUtils";
import {AppRouter} from "../AppRouter";
import {Injectable} from "@angular/core";
import {AuthService} from "./AuthService";

/**
 * main路由及其子路由验证
 */
@Injectable()
export class MainGuard implements CanActivateChild{

  constructor(private authService:AuthService){}

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    if(this.authService.isLogin()){
      return true;
    }else{
      AppRouter.goLogin();
      AppUtils.showWarn("提示","请登录");
      return false;
    }
  }

}
