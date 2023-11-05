import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})

export class ListComponent implements OnInit {

  @Input() productLst:Array<any>; 
  
  public totalList:number=0;
  public flagStorage:boolean=false;
  
  constructor(private modalCtrl: ModalController,
              private storage:Storage,
              public toastController: ToastController,
              public alertController: AlertController
    ) {}

  ngOnInit() {
    if (this.productLst.length>0){
      this.productLst.forEach(product => {
        this.totalList += product.price;
      })
    }
  }
  
  async deleteItem(product){
    let finded = this.productLst.find(x => x.name === product.name);
    if(finded) {
      for (const [i,element] of this.productLst.entries()) {
        if (element.name === finded.name) {
          const alert = await this.alertController.create({
            header: 'Advertencia',
            message: '¿Está seguro/a de <strong>eliminar</strong> el producto de la lista?',
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
                cssClass: 'secondary',
                id: 'cancel-button',
                handler: () => {}
              }, {
                text: 'Aceptar',
                id: 'confirm-button',
                handler: () => {
                  this.productLst.splice(i,1);
                  this.totalList = this.totalList - finded.price;
                  this.storage.set('productLstStorage', this.productLst);
                  this.deleteToast();
                }
              }
            ]
          });
          await alert.present();
        }
      }
    }
  }

  async resetLst(){
    const alert = await this.alertController.create({
      header: 'Advertencia',
      message: '¿Está seguro/a de <strong>eliminar</strong> la lista de productos?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: () => {}
        }, {
          text: 'Aceptar',
          id: 'confirm-button',
          handler: () => {
            this.productLst = [];
            this.totalList = 0; 
            this.ngOnInit();
            this.flagStorage = true;
            this.resetListToast();
          }
        }
      ]
    });
    await alert.present();

  }
  
  _dismiss(){
    this.modalCtrl.dismiss({
      dismissed:this.flagStorage==true?true:false
    })
  }

  async resetListToast() {
    const toast = await this.toastController.create({
      message: "La lista de productos ha sido borrada",
      duration: 1000,
      position: "top"
    });
    toast.present()
  }

  async deleteToast() {
    const toast = await this.toastController.create({
      message: "El producto ha sido borrado de la lista",
      duration: 1000,
      position: "top"  
    });
  toast.present()
  }

}