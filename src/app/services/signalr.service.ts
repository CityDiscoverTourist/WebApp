import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {

  hubConnection: signalR.HubConnection | undefined;

  constructor() {}

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://citytourist.azurewebsites.net/customer-task`)
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('start connect'))
      .catch((err) => console.log(`Error while starting connection ` + err));
  };

  public addTranferDataListener=()=>{
    this.hubConnection?.on('AddCustomerTask',(data)=>{
      console.log(data);
    })
  }
}
