import { Component, OnInit } from '@angular/core';
import { AnimationController, ModalController, IonRouterOutlet, ToastController, LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Storage } from '@ionic/storage';
import {FloorPipe} from 'ngx-pipes';
import { identity } from 'rxjs';
import { ListComponent } from '../components/list/list.component';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
  providers: [FloorPipe],
})
export class ProductPage implements OnInit{
  
  public cardcode:any;
  public token:any;
  public product:any;
  public pictures:Array<any>;
  public picture:any;
  public totalProduct:number = 0;
  public amount:number = 1;
  public productLst:Array<any>= [];
  public productLstStorage:Array<any>= [];
  public flagStorage:boolean=false;
  public modal:any;
  public duplicate:boolean=false;
  public mostrarError: boolean;
  public specs : string [] = [];
  fromModal:any;
  selectedSize: number;
  selectedColor: number;
  activeVariation: string;
  constructor(
    private animatioCntrl: AnimationController,
    private router:Router,
    private route:ActivatedRoute,
    private productService:ProductService,
    private storage:Storage,
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
    public toastController: ToastController,
    public loadingController: LoadingController
  ){
    this.route.params.subscribe(async (params) => {
      if(params) {
      } 
    })
  }

  option = {
    slidesPerView: 1,
    centeredSlides: false,
    loop: true,
    spaceBetween: 140,
    autoplay:true,
    speed:350,
    pager:true
  }

  async ngOnInit() {
    this.activeVariation = 'size';
    this.mostrarError = false;
    
    await this.cargar(); 
    
    this.route.params.subscribe(async (params) => {
      
      if(params) {
        
        //if (this.cardcode)
        {
          
          this.productService.getProduct(params['id'], this.cardcode, this.token)
          .pipe(
            catchError((err) => {
              
              this.mostrarError = true;
              return null;
          })
          )
          .subscribe(resProduct => {
              
            
            this.product = resProduct;
            if (this.product.precio){
            this.product.precio.PrecioDescAdicional = (this.product.precio.PrecioDescAdicional * (1 + (this.product.precio.RataImpuesto /100))) /2;
            this.product.precio.Precio = (this.product.precio.Precio * (1 + (this.product.precio.RataImpuesto /100))) /2;
            //this.product.precio.DataSheet = this.product.precio.DataSheet.replaceAll ('\r','<li></li>');
            this.specs = this.product.precio.DataSheet.split ('\r');
            this.specs = this.specs.filter (x=> x != '' );
            }
            
            
            let obj= {
              Itemcode:params['id']
            }
            this.totalProduct = this.product.precio.PrecioDescAdicional;
            this.productService.getImg(obj)
            
            .subscribe((resPictures:any) => {
              
              
              if(this.flagStorage == true){
                this.productLst = this.productLstStorage;
              }
              this.pictures = resPictures.filter (archivo => {return archivo.Tipo == 'Imagen'});
              if(this.pictures.length == 0){
                resPictures.push ({'Archivo':`https://gvscolombia.com/assets/productos/highres/${this.product.info.itemcode}.webp`});
                this.picture = `https://gvscolombia.com/assets/productos/highres/${this.product.info.itemcode}.webp`;
                this.pictures = resPictures;
              }
              
            })
          });
            
        }
      }
    })
  }
  
  async cargar(){
    
    this.cardcode = await this.storage.get('cardcode') ?? 'CN397872'; 
    this.productLstStorage = await this.storage.get('productLstStorage');
    
    if(this.productLstStorage != null){
      this.flagStorage=true;
    }
  }

  changeSize(size: number) {
    this.selectedSize = size;
  }

  changeColor(color: number) {
    this.selectedColor = color;
  }

  async _openList() {
    this.modal = await this.modalCtrl.create({
      component: ListComponent,
      canDismiss: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps:{
        "productLst":this.productLst
      },
    })

    this.modal.onDidDismiss()
    .then((data) => {
      if(data.data.dismissed==true){
        this.productLst = []; 
        this.productLstStorage = []; 
        this.storage.set('productLstStorage', null);
        this.storage.set('productLst', null); 
      }
    });
    return await this.modal.present();
  }

  onAmountChange(amount: number) {
    this.totalProduct = this.product.precio.PrecioDescAdicional * amount;
  }

  addProduct() {
    if(this.amount > 0){
      if(this.flagStorage == true){
        this.productLst = this.productLstStorage;
        if(this.productLst.length > 0){
          this.productLst.forEach(product => {
            if(product.name == this.product.info.itemcode){
              product.amount += this.amount;
              product.price += this.totalProduct;
              this.duplicate = true;
            }
          });
          if(this.pictures.length > 1){
            if(this.duplicate == false){
              let aux = {
                name: this.product.info.itemcode,
                amount: this.amount,
                price: this.totalProduct,
                img: this.pictures[0].Miniatura
              }
              if (this.productLst)
              this.productLst.push(aux);
            }
          }
          else{
            if(this.duplicate == false){
            let aux = {
              name: this.product.info.itemcode,
              amount: this.amount,
              price: this.totalProduct,
              img: this.picture
            }
            this.productLst.push(aux);
            }
          }
        }
        else{
          
          if(this.product.name == this.product.info.itemcode){
            this.product.amount += this.amount;
            this.product.price += this.totalProduct;
          }
          else{
            if(this.pictures.length > 1){
              let aux = {
                name: this.product.info.itemcode,
                amount: this.amount,
                price: this.totalProduct,
                img: this.pictures[0].Miniatura 
              }
              this.productLst.push(aux);
            }
            else{
              let aux = {
                name: this.product.info.itemcode,
                amount: this.amount,
                price: this.totalProduct,
                img: this.picture
              }

              this.productLst.push(aux);
            };
          }
        } 
      }else{
        if(this.productLst.length > 0){

          this.productLst.forEach(product => {
            
            if(product.name == this.product.info.itemcode){
              product.amount += this.amount;
              product.price += this.totalProduct;
              this.duplicate = true;
            }
          });
          if(this.pictures.length > 1){
            if(this.duplicate == false){
              let aux = {
                name: this.product.info.itemcode,
                amount: this.amount,
                price: this.totalProduct,
                img: this.pictures[0].Miniatura
              }
              this.productLst.push(aux);
            }
          }
          else{
            if(this.duplicate == false){
            let aux = {
              name: this.product.info.itemcode,
              amount: this.amount,
              price: this.totalProduct,
              img: this.picture
            }
            this.productLst.push(aux);
            }
          }
        }
        else{
          if(this.product.name == this.product.info.itemcode){
            this.product.amount += this.amount;
            this.product.price += this.totalProduct;
          }
          else{
            if(this.pictures.length > 1){
              let aux = {
                name: this.product.info.itemcode,
                amount: this.amount,
                price: this.totalProduct,
                img: this.pictures[0].Miniatura
              }
              this.productLst.push(aux);
            }
            else{
              let aux = {
                name: this.product.info.itemcode,
                amount: this.amount,
                price: this.totalProduct,
                img: this.picture
              }
              this.productLst.push(aux);
            };
          }
        } 
      }
      this.setLstStorage(this.productLst);
      this.amount = 1;
      this.totalProduct = this.product.precio.PrecioDescAdicional;
      this.presentToast();
    }
    else{
      this.amountToast();
      this.amount = 1;
      this.totalProduct = this.product.precio.PrecioDescAdicional;
    }
  }

  async setLstStorage(productLst){
    await this.storage.set('productLstStorage', productLst);
  }

  async _dismiss(){
    
    this.modalCtrl.dismiss({
      dismissed:true
    })
  }

  async presentToast(){
    const toast = await this.toastController.create({
      message: "Producto agregado a lista",
      duration: 1000,
      position: "top"
    });
    toast.present()
  }

  async amountToast(){
    const toast = await this.toastController.create({
      message: "No se puede agregar cantidades de cero o negativas",
      duration: 1000,
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
    // console.log('Loading dismissed!');
  }

  segmentChanged(e: any) {
    this.activeVariation = e.detail.value;
    if (this.activeVariation == 'color') {
      this.animatioCntrl.create()
      .addElement(document.querySelector('.sizes'))
      .duration(500)
      .iterations(1)
      .fromTo('transform', 'translateX(0px)', 'translateX(100%)')
      .fromTo('opacity', '1', '0.2')
      .play();

      this.animatioCntrl.create()
      .addElement(document.querySelector('.colors'))
      .duration(500)
      .iterations(1)
      .fromTo('transform', 'translateX(-100%)', 'translateX(0)')
      .fromTo('opacity', '0.2', '1')
      .play();
    } else {
      this.animatioCntrl.create()
      .addElement(document.querySelector('.sizes'))
      .duration(500)
      .iterations(1)
      .fromTo('transform', 'translateX(100%)', 'translateX(0)')
      .fromTo('opacity', '0.2', '1')
      .play();

      this.animatioCntrl.create()
      .addElement(document.querySelector('.colors'))
      .duration(500)
      .iterations(1)
      .fromTo('transform', 'translateX(0px)', 'translateX(-100%)')
      .fromTo('opacity', '1', '0.2')
      .play();
    }
  }

}