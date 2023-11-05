import { Component, ElementRef, ViewChild } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import  jsQR  from "jsqr";
import { Router } from '@angular/router';


@Component({
  selector: 'app-qreader',
  templateUrl: './qreader.page.html',
  styleUrls: ['./qreader.page.scss'],
})
export class QreaderPage {

  scanActive = true;
  scanResult = null;
  @ViewChild('video',{static:false}) video: ElementRef;
  @ViewChild('canvas',{static:false}) canvas: ElementRef;
  
  VideoElement: any;
  canvasElement: any;
  canvasContext: any;

  loading: HTMLIonLoadingElement;

  constructor(private toastCtrl: ToastController, 
              private loadingCtrl: LoadingController, 
              private router:Router,
              public loadingController: LoadingController) {}

  ngAfterViewInit(): void {
   
    this.VideoElement = this.video.nativeElement;
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    
  }  
  ionViewDidEnter(){
    
    this.startScan();
  }
  async startScan() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {facingMode: 'environment'}
    });
    this.VideoElement.srcObject = stream;
    this.VideoElement.setAttribute('playsinline', true);
    this.VideoElement.play();
    this.loading = await this.loadingCtrl.create({});
    await this.loading.present();
    requestAnimationFrame(this.scan.bind(this));
    this.scanActive = false;
  }
  
  async scan(){

    if(this.VideoElement.readyState === this.VideoElement.HAVE_ENOUGH_DATA){
      if(this.loading){
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;
      }

    this.canvasElement.height = this.VideoElement.videoHeight;
    this.canvasElement.width = this.VideoElement.videoWidth;

    this.canvasContext.drawImage(
      this.VideoElement,
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );

    const imageData = this.canvasContext.getImageData(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    )

    const code = jsQR(imageData.data, imageData.width, imageData.height,{
      inversionAttempts: 'dontInvert'
    });
 
    let aux;
    if (code){
      if (code.data.includes ("//")) code.data = "NoCode";
      this.scanActive = false;
      aux = code.data.split('\n');
      if (aux.length < 2){
        this.scanActive = true;
      }
      this.presentLoading();
      this.router.navigate([`product/${aux[1]}`]);
     
    }else{
      if(this.scanActive){
        requestAnimationFrame(this.scan.bind(this));
      }
    }
    }else{
      requestAnimationFrame(this.scan.bind(this));
    }
  }

  stopScan(){
    this.scanActive = false;
  }
    
  reset() {
    this.scanResult = null;
  }

  async showQrToast(){
    const toast = await this.toastCtrl.create({
      message:`Open ${this.scanResult}?`,
      position:'top',
      buttons: [
        {
          text: 'Open',
          handler: () => {
            window.open(this.scanResult, '_system', 'location=yes');
          }
        }
      ]
    });
    toast.present();
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

}