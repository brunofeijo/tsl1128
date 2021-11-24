/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable no-trailing-spaces */
import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Devices } from '../model/devices';
import { Tags } from '../model/tags';
import { LoaderBoxService } from '../util/loader-box.service';
import { MessageBoxService } from '../util/message-box.service';
import { ToastBoxService } from '../util/toast-box.service';
import { Observable, observable, Subscription } from 'rxjs';
import { typeofExpr } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [BluetoothSerial, Devices]
})
export class HomePage {
    public deviceIsConected: boolean = false;
    public devices = Devices;
    public tags: any;
    public battery: string;
    public tag = [];

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

  async getBatteryLevel(){
      this.bluetooth.readUntil('.iv').then(
        data => {
        this.battery = data;
        console.log('Bateria ', data);
      }
    );
    console.log("chegou 3");
    await this.bluetooth.subscribe('.bl').subscribe().unsubscribe();
  }

  public tslData():Observable<any> {
    return this.bluetooth.subscribe('.iv');
  }

  public startInvetorying(){
    this.tslData().subscribe(
      data => {
        this.tags = data;
        console.log('Dentro do observable ' + this.tags);
      },
      error => {
        console.log(error);
      }
    )
    if(this.tags){
      this.tslData().subscribe().unsubscribe();
    }
    console.log('Fora do observable ' + this.tags);
  }

  
  

}
