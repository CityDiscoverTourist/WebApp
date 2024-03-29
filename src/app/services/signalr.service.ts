import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  hubConnection: signalR.HubConnection | undefined;
  subject$: Subject<any> = new Subject<any>();
  subjectCustomerTask$: Subject<any> = new Subject<any>();
  subjectUpdateCustomerTask$: Subject<any> = new Subject<any>();
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
     this.subject$.next(data);
    })
  }
  public addTranferDataCustomerTaskListener=()=>{
    this.hubConnection?.on('CustomerStartNextQuestItem',(data)=>{
     this.subjectCustomerTask$.next(data);
    })
  }
  public addTranferDataUpdateCustomerTaskListener=()=>{
    this.hubConnection?.on('UpdateCustomerTask',(data)=>{      
     this.subjectUpdateCustomerTask$.next(data);
    })
  }

  subjectNotification$: Subject<any> = new Subject<any>();
  // subjectGetNotification$: Subject<any> = new Subject<any>();

  public startConnectionNotification = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://citytourist.azurewebsites.net/notify`)
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('start connect'))
      .catch((err) => console.log(`Error while starting connection ` + err));
  };

  public addTranferDataNotificationTaskListener=()=>{
    this.hubConnection?.on('GetNotification',(data)=>{
     this.subjectNotification$.next(data);
    })
  }
  
}
