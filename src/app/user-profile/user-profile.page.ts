import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { Storage } from '@ionic/storage';
import { OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ROUTE_IMG } from '../services/gvs.constants';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  public profile:any;
  public cardcode:any;
  public token:any;
  public Username:any;
  public UserImg:any;
  public createdCode:any;

  constructor(
    private auth: AuthService,
    private router: Router,
    public profileService: ProfileService,
    public storage: Storage,
    public toastController: ToastController,
    ){}

  async cargar(){
    this.cardcode = await this.storage.get('cardcode'); 
    this.token = await this.storage.get('token'); 
  }

  
  async ngOnInit() {
    await this.cargar();
   
    
    if (this.cardcode)
    this.profileService.getProfile(this.cardcode, this.token).subscribe(resProfile => {
      this.profile = resProfile;
      this.profile.Cardcode = String(this.cardcode).replace('CN','')
      this.profileService.getImgUser(this.profile.Username).subscribe(resImg => {
        this.UserImg = `${ROUTE_IMG}${resImg[0].urlImagen}`;
        
      });
      
    });
  }

  async presentToast(){
    const toast = await this.toastController.create({
      message: "Sesión Cerrada con Exito.",
      duration: 2000,
      position: "top"
    });
    toast.present()
  }
 
  async logout() {
    this.auth.logout();
    this.presentToast();
    this.router.navigateByUrl('/login');
  }

}