import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import { BehaviorSubject, take } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Message } from '../models';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private hubConnection: HubConnection;

  constructor(private http: HttpClient) {}

  conIdd = '';

  public connect = () => {
    this.startConnection();
    this.addListeners();
  };
  public sendMessageToHub(conId: string, content: string, User: string) {
    this.hubConnection
      .invoke('AdminSendMessageToCustomer', {
        ConId: conId,
        Message: content,
        User: User,
        AdminId: 'sangnd@gmail.com',
      })
      .then((data) => {
        // var message: Message = {
        //   User: User,
        //   Message: content,
        //   ConId: conId,

        // };
        // this.messageThread$.pipe(take(1)).subscribe((messages) => {
        //   this.messageThreadSource.next([...messages, message]);
        // });
        // this.userSource$.pipe(take(1)).subscribe((users) => {
        //   this.userSource.next([...users, message]);
        // });
        console.log('message sent successfully to hub');
      });

    this.hubConnection
      .invoke('AppendMessage', {
        // ConId: this.hubConnection.connectionId!,
        ConId: conId,
        Message: content,
        User: User,
        AdminId: 'sangnd@gmail.com',
      })
      .then((data) => {
        // var message: Message = {
        //   User: User,
        //   Message: content,
        //   ConId: conId,
        // };
        // this.messageThread$.pipe(take(1)).subscribe((messages) => {
        //   this.messageThreadSource.next([...messages, message]);
        // });
        // this.userSource$.pipe(take(1)).subscribe((users) => {
        //   this.userSource.next([...users, message]);
        // });
        console.log('message sent successfully to hub');
      });
  }

  //private
  private getConnection(): HubConnection {
    return (
      new HubConnectionBuilder()
        // return new signalR.HubConnectionBuilder()
        .withUrl(`${environment.apiUrl}/chat`)
        .withHubProtocol(new MessagePackHubProtocol())
        .build()
    );
  }

  private startConnection() {
    this.hubConnection = this.getConnection();
    this.hubConnection.start().catch((err) => console.log(err));

    this.hubConnection
      .start()
      .then((_) => console.log('connection started'))
      .catch((err) =>
        console.log('error while establishing signalr connection: ' + err)
      );
  }

  private addListeners() {
    this.hubConnection.on('CustomerSendMessageToAdmin', (data: Message) => {
      console.log('on khách gửi Admin');
      console.log(data);

      if (data.ConId == '') {
        data.ConId = this.hubConnection.connectionId!;
      }

      this.messageThread$.pipe(take(1)).subscribe((messages) => {
        this.messageThreadSource.next([...messages, data]);
      });
      this.userSource$.pipe(take(1)).subscribe((users) => {
        this.userSource.next([...users, data]);
      });
    });
    this.hubConnection.on('AdminSendMessageToCustomer', (data: any) => {
      if (data.ConId == '') {
        data.ConId = this.hubConnection.connectionId!;
      }

      this.messageThread$.pipe(take(1)).subscribe((messages) => {
        this.messageThreadSource.next([...messages, data]);
      });
      this.userSource$.pipe(take(1)).subscribe((users) => {
        this.userSource.next([...users, data]);
      });
    });
    this.hubConnection.on('AppendMessage', (data: any) => {
      if (data.ConId == '') {
        data.ConId = this.hubConnection.connectionId!;
      }

      this.messageThread$.pipe(take(1)).subscribe((messages) => {
        this.messageThreadSource.next([...messages, data]);
      });
      this.userSource$.pipe(take(1)).subscribe((users) => {
        this.userSource.next([...users, data]);
      });
    });
  }
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  private userSource = new BehaviorSubject<Message[]>([]);
  userSource$ = this.userSource.asObservable();
}
