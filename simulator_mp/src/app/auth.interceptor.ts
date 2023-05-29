//auth Interceptor attaches the JWT TOKEN to the authorization header
//if you dont have this, only postman can add if the headers are manually set!
import {HttpInterceptor, HttpRequest,HttpHandler} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {


    const authToken = this.authService.getAccessToken();
    const authRequest = req.clone({
      //setting headers to Authorization with Bearer annd token
      headers: req.headers.set("Authorization", "Bearer " + authToken)
    });
    return next.handle(authRequest);
  }
}
