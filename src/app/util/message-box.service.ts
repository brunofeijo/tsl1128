import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MessageBoxService {

  constructor(public alertController: AlertController) {}
  async presentAlert(msg: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Atenção!',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }
}
