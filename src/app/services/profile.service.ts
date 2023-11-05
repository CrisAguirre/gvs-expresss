import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { BaseService } from './base.service';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProfileService extends BaseService<any> {
  public headerjson = new HttpHeaders({
    'Content-Type': 'application/json',
    accept: '*/*',
  });

  public headers = new HttpHeaders().append(
    'Content-Type',
    'application/x-www-form-urlencoded'
  );

  public body = {};
   
  constructor(
    private storage: Storage, public http: HttpClient, private plt: Platform, private router: Router) {
    super(http);
  }

  getImgUser(NombreUsuario) {
    let params = new HttpParams()
    .append('NombreUsuario',NombreUsuario);
      return this.http.post<any>(`${this.ApiUsrImg}`, {}, {  
        params: params,
      })

}

  getProfile(cardcode, token) {
    let params = new HttpParams()
    .append('cardcode', cardcode);
      return this.http.post<any>(`${this.ApiUrl}/PerfilUsuario`, {}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`}),
      params: params,
    })
  }

  getDepartamentos() {
    const ruta = [this.ApiUrl, 'departments'].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }

  getCiudades(idDepartamento) {
    const ruta = [
      this.ApiUrl,
      'municipalities',
      'byIdDepartment',
      idDepartamento,
    ].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }

  getSectores() {
    const ruta = [this.ApiUrl, 'economicSectors'].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }

  getTamañoEmpresa() {
    const ruta = [this.ApiUrl, 'sizeEnterprise'].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }

  saveFormBasicos(data: any) {
    const params = JSON.stringify(data);
    // console.log("params: ", params);
    const ruta = [this.ApiUrl, 'actors', 'guardar-datos-empresa'].join('/');
    return this.http.post(ruta, params, { headers: this.headerjson });
  }

  saveFormAnswers(data: any, idUser) {
    const params = JSON.stringify(data);
    const ruta = [
      this.ApiUrl,
      'answersActor',
      'persist-form-answers',
      idUser,
    ].join('/');
    return this.http.post(ruta, params, { headers: this.headerjson });
  }

  saveStateHabeas(data: any) {
    const params = JSON.stringify(data);
    const ruta = [this.ApiUrl, 'approvingData', 'acceptHabeasData'].join('/');
    return this.http.post(ruta, params, { headers: this.headerjson });
  }

  getHabeasByUser(id: string) {
    const ruta = [this.ApiUrl, 'approvingData', `getByIdUser/${id}`].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }

  getConstitucionEmpresa() {
    const ruta = [this.ApiUrl, `enterpriseConstitution`].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }

  getGremioEmpresa() {
    const ruta = [this.ApiUrl, `guilds`].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }

  getTiposContacto() {
    const ruta = [this.ApiUrl, `contacts`].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }

  getQuestionsByIdForm(idform) {
    const ruta = [this.ApiUrl, `questions`, `byIdForm/${idform}`].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }

  getQuestions() {
    const ruta = [this.ApiUrl, 'questions'].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }

  getQuestionsByIdQuestionsFather(id) {
    const ruta = [this.ApiUrl, 'questions', `byIdQuestionFather/${id}`].join(
      '/'
    );
    return this.http.get(ruta, { headers: this.headerjson });
  }

  getStatusbar(model) {
    const jmodel = JSON.stringify(model);
    const ruta = [this.ApiUrl, 'consultingModules', 'statusProgress'].join('/');
    return this.http.post(ruta, jmodel, { headers: this.headerjson });
  }
  consultingModules() {
    const ruta = [this.ApiUrl, 'consultingModules'].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }
  consultingModulesById(id) {
    const ruta = [this.ApiUrl, `consultingModules/${id}`].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }

  getFormsByModule(model) {
    const jmodel = JSON.stringify(model);
    const ruta = [this.ApiUrl, 'forms', 'byIdConsultingModule'].join('/');
    return this.http.post(ruta, jmodel, { headers: this.headerjson });
  }

  getResultados(idUsuario) {
    // const headers = new HttpHeaders({
    //   'Content-Type': "text/plain;charset=UTF-8",
    //   accept: "*/*",
    // });
    const ruta = [
      this.ApiUrl,
      'graficas',
      `resultadosPorUsuario/${idUsuario}`,
    ].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }

  getDatosEmpresa(idUsuario) {
    const ruta = [this.ApiUrl, 'actors', `datos-empresa/${idUsuario}`].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }

  getFormById(idForm) {
    const ruta = [this.ApiUrl, 'forms', idForm].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }

  getFormAnwers(idForm, idUser) {
    const params = JSON.stringify({
      id_form: idForm,
      id_usuario: idUser
    })
    const ruta = [this.ApiUrl, 'answersActor', 'respuestas-form'].join('/');
    return this.http.post(ruta, params, { headers: this.headerjson });
  }
  getConfigAgenda() {
    const ruta = [this.ApiUrl, 'configAgenda'].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }
  getConsultores() {
    const ruta = [this.ApiUrl, 'asesor', 'todos'].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }
  getConsultorId(idAsesor) {
    const ruta = [this.ApiUrl, `asesor/${idAsesor}`].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }
  getConsultorbyIdAsesor(idAsesor) {
    const ruta = [this.ApiUrl, 'asesor', `by-id-asesor/${idAsesor}`].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }
  getConsultorbyIdUser(idUser) {
    const ruta = [this.ApiUrl, 'asesor',`by-id-user/${idUser}`].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }
  getConsultorbyArea(idArea) {
    const ruta = [this.ApiUrl, 'asesor', `por-area/${idArea}`].join('/');
    return this.http.get(ruta);
  }

  getDiasMes(date: string) {
    // const param = JSON.stringify({fecha: date });
    const ruta = [this.ApiUrl, 'agenda', 'diasMes'].join('/');
    return this.http.post(ruta, date, { headers: this.headerjson });
  }

  saveAgenda(appointment) {
    const params = JSON.stringify(appointment)
    const ruta = [this.ApiUrl, 'agenda', 'guardar-agenda'].join('/');
    return this.http.post(ruta, params, { headers: this.headerjson });
  }

  getAgenda() {
    const ruta = [this.ApiUrl, 'agenda'].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }

  getReserva(idApiConecte) {
    const ruta = [this.ApiUrl, 'agenda', `cita-agendada/${idApiConecte}`].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }

  getReservaById(id) {
    const ruta = [this.ApiUrl, 'agenda', `${id}`].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }

  getReservaByUser(idApiConecte) {
    const ruta = [this.ApiUrl, 'agenda', `agenda-por-usuario/${idApiConecte}`].join('/');
    return this.http.get(ruta, { headers: this.headerjson });
  }

  getFormPersonales(idApiConecte) {
    const ruta = [this.ApiUrl, 'actors',  `form-datos-personales-completo/${idApiConecte}`].join('/');
    return this.http.get(ruta, {headers: this.headerjson})
  }

  getAreas() {
    const ruta = [this.ApiUrl, 'area'].join('/');
    return this.http.get(ruta, {headers: this.headerjson})
  }

  getImagenes(image) {
      const ruta = [this.ApiUrl, 'soportes', `image/${image}`].join('/');
      return this.http.get(ruta, {headers: this.headerjson})
  }

  getEvaluacion() {
    const ruta = [this.ApiUrl, 'encuestas-controller'].join('/');
    return this.http.get(ruta, {headers: this.headerjson})
  }

  getEvaluacionByUser(id) {
    const ruta = [this.ApiUrl, 'encuestas-usuario-controller', `encuestas-por-usuario/${id}`].join('/');
    return this.http.get(ruta, {headers: this.headerjson})
  }

  saveEvaluacion(model) {
    const params = JSON.stringify(model);
    const ruta = [this.ApiUrl, 'encuestas-usuario-controller','guardar-evaluacion'].join('/');
    return this.http.post(ruta, params, { headers: this.headerjson });
  }
}