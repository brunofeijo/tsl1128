/* eslint-disable no-trailing-spaces */
import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Devices } from '../model/devices';
import { Tags } from '../model/tags';
import { LoaderBoxService } from '../util/loader-box.service';
import { MessageBoxService } from '../util/message-box.service';
import { ToastBoxService } from '../util/toast-box.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [BluetoothSerial, Devices]
})
export class HomePage {
    public deviceIsConected: boolean;
    public devices = Devices;
    public tags: Array<any> = [];
    public subscription1$: Subscription;

constructor(
    public bluetooth: BluetoothSerial,
    public msgBox: MessageBoxService,
    public toastBox: ToastBoxService,
    public loadingBox: LoaderBoxService,
  ) {}

  public checkBluetothIsEnabled() {
    this.bluetooth.isEnabled().then(
      data => {
        if(this.deviceIsConected===true){
          this.clearDevices();
          this.msgBox.presentAlert('Dispositivo já conectado');
        }
        else{this.searchDevices();
        }
      },
      error => {
        console.log(error);
        this.bluetooth.enable().then(
          data => {
            console.log('Ligando Bluetooth', data);
          }
        );
      }
    );
  }

  public clearDevices(){
    this.devices = Devices;
  }

  public searchDevices(){
    this.bluetooth.list().then(
      data => {
        this.devices = data;
      }
    );
    this.bluetooth.discoverUnpaired().then(
      data => {
        console.log(data);
        this.devices = data;
      },
      error => {
      console.log(error);
      }
    );
  }

  public connectDevice(device){
    this.loadingBox.presentLoading('Conectando dispositivo...');
    this.bluetooth.connect(device.address).subscribe(
      data => {
        this.deviceIsConected = true;
        this.loadingBox.loadingController.dismiss();
        if (this.deviceIsConected===true) {
          this.clearDevices();
        }
        this.toastBox.presentToast('Dispositivo conectado!');
        this.startInvetorying();
      },
    error => {
      console.log(error);
      this.loadingBox.loadingController.dismiss();
      this.toastBox.presentToast('Erro ao conectar dispositivo');
      }
    );
  }

  public disconnectDevice() {
    this.bluetooth.disconnect().then(
      data => {
        console.log(data);
        this.deviceIsConected = false;
        this.toastBox.presentToast('Dispositivo desconectado.');
      },
      error => {
        console.log(error);
      }
    );
  }

  public startInvetorying(){
    this.subscription1$ = this.bluetooth.subscribe('.iv').subscribe(
      data => {
       this.tags = data;
       console.log(data);
       console.log(typeof(data));
       if(this.tags.includes('OK')){
        console.log('Teste'); 
        this.subscription1$.unsubscribe();
       }
      }
    );
  } 
  



}
