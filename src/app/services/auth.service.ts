import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BaseService } from './base.service';
import { API_GVS } from './gvs.constants';
 
const helper = new JwtHelperService();
const TOKEN_KEY = 'jwt-token';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService <any>{
  public user: Observable<any>;
  private userData = new BehaviorSubject(null);
 
  constructor(private storage: Storage, public http: HttpClient, private plt: Platform, private router: Router) { 
    super(http);
  }
  
  login(credentials) {
      const params = credentials;
      const ruta = [this.ApiUrl, 'Login'].join('/');
      return this.http.post(ruta, params);
  }
 
  getUser() {
    return this.userData.getValue();
  }
 
  logout() {
    this.storage.remove("token").then(async () => {
      await this.storage.set('isLogged', false);
      this.router.navigateByUrl('login');
    });
  }
 
}