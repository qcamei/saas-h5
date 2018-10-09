import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {AuthData} from "./AuthData";
import {Observable} from "rxjs";
import {AuthService} from "./AuthService";

@Injectable()
export class MainResolve implements Resolve<AuthData>{

  constructor(private authService:AuthService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AuthData>|Promise<AuthData>|AuthData {
    return this.authService.getAuthData();
  }
}
