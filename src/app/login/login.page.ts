import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController, ToastController,LoadingController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SafariViewController } from '@awesome-cordova-plugins/safari-view-controller/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  alert:any;
  plataforma : string ='Otros';
 
  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    public storage: Storage,
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public safariViewController: SafariViewController,
    public platform : Platform
  ) {}
 
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      usuario: ['', [Validators.required]],
      clave: ['', [Validators.required]],
   })

   this.platform.platforms().forEach (p =>{
    if (p == 'iphone' || p == 'ios' || p == 'ipad'){
      this.plataforma = 'IOS'
    }
  })
   
  }
  
  login() {
    
    this.auth.login(this.loginForm.value).subscribe((res:any) => {

      this.saveAuth(res).then(x => {
        this.presentLoading();
        this.presentToast();
        this.router.navigate(['tabs/user-profile']);
      })
    }, error => {
      this.saveAlert();
    });
  }

  submitForm(){
    this.presentLoading();
    console.log(this.loginForm.value)
  }

  saveAuth(respuesta){
    return new Promise (async (resolve, reject) => {
      await this.storage.set('token', respuesta.Token);
      await this.storage.set('cardcode', respuesta.Perfil.Cardcode);
      await this.storage.set('isLogged', true);
      let aux = await this.storage.length();
      if (aux) {
        resolve (aux);
      }  
    })
  }
    
  async saveAlert(){
    this.alert = await this.alertCtrl.create({
      header: 'Acceso fallido, revisa tus datos de acceso.',
      message: 'Email, NIT o contraseña incorrecta.',
      buttons: ['OK']
    });
    await this.alert.present();
  }

  async presentToast(){
    const toast = await this.toastController.create({
      message: "Acceso Exitoso!",
      duration: 2000,
      position: "top"
    });
    toast.present()
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando...',
      duration: 500
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
  }

  async register(){
    this.safariViewController.isAvailable()
    .then((available: boolean) => {
        if (available) {
          this.safariViewController.show({
            url: 'https://www.gvscolombia.com/registro',
            hidden: false,
            animated: false,
            transition: 'curl',
            enterReaderModeIfAvailable: true,
            //tintColor: '#ffffff'
          })
          .subscribe((result: any) => {},
            (error: any) => console.error(error)
          );

        } else {
        }
      }
    );
  }

}