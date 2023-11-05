import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_GVS, API_IMG, API_USER_IMG } from './gvs.constants';
export class BaseService<T> {

  protected ApiUrl: string;
  protected ApiImg: string;
  protected ApiUsrImg: string;

  constructor(public http: HttpClient) {
    this.ApiUrl = API_GVS;
    this.ApiImg = API_IMG;
    this.ApiUsrImg = API_USER_IMG
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.ApiUrl);
  }

  getbyId(Id: any): Observable<T> {
    return this.http.get<T>(`${this.ApiUrl}/${Id}`);
  }

  save(model: T): Observable<T> {
    return this.http.post<T>(this.ApiUrl, model);
  }

  update(Id: any, model: T): Observable<T> {
    return this.http.put<T>(`${this.ApiUrl}/${Id}`, model);
  }

  delete(Id: any): Observable<T> {
    return this.http.delete<T>(`${this.ApiUrl}/${Id}`);
  }

  login(data: any): Observable<any> {
    const params = JSON.stringify(data);
    const ruta = [this.ApiUrl, 'Login'].join('/');
    return this.http.post(ruta, params);
  }

  getImg(model:T): Observable<any>{
    return this.http.post<T>(this.ApiUsrImg, model)
  }

}