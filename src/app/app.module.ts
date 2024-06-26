import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { SafariViewController } from '@awesome-cordova-plugins/safari-view-controller/ngx';
import { NgxQRCodeModule } from 'ngx-qrcode2'
 
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    IonicStorageModule.forRoot(),
       HttpClientModule, NgxQRCodeModule],
       
  providers: [
    StatusBar,
    SplashScreen,
    SafariViewController,

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy, },

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}