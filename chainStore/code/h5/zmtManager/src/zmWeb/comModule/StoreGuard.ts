import {CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "./AuthService";
import {AppUtils} from "./AppUtils";
import {Injectable} from "@angular/core";

@Injectable()
export class StoreGuard implements CanActivateChild{

  constructor(private authService:AuthService){}

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
    if(this.authService.hasStore()){
      return true;
    }else{
      AppUtils.showWarn("提示","暂无店铺");
      return false;
    }
  }

}
