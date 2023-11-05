import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductPageRoutingModule } from './product-routing.module';
import { ProductPage } from './product.page';
import { NgPipesModule } from 'ngx-pipes';
import { ListComponent } from '../components/list/list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductPageRoutingModule,
    NgPipesModule
  ],
  declarations: [
    ProductPage,
    ListComponent
  ]
})
export class ProductPageModule {}