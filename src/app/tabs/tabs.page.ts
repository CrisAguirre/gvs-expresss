import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public storage:Storage) {
    this.cargar();
  }

  async cargar(){
    const token = await this.storage.get('token'); 
  }

}
