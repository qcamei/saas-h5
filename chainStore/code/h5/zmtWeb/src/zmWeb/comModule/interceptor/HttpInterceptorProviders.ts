import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {PreHandleRespIntcpt} from "./PreHandleRespIntcpt";

/**
 * http拦截器配置
 */
export const HttpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: PreHandleRespIntcpt, multi: true },
];
