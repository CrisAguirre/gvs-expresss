import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QreaderPage } from './qreader.page';

const routes: Routes = [
  {
    path: '',
    component: QreaderPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QreaderPageRoutingModule {}
