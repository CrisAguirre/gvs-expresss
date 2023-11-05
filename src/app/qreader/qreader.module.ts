import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QreaderPage } from './qreader.page';

import { QreaderPageRoutingModule } from './qreader-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    QreaderPageRoutingModule
  ],
  declarations: [QreaderPage]
})
export class QreaderPageModule {}
