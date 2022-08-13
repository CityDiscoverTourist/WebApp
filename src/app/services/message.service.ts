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
  currentMessage: Message;
  conIdd = '';

  public connect = () => {
    this.startConnection();
    this.addListeners();
  };
  public sendMessageToHub(conId: string, content: string, User: string) {
    var adminId = localStorage.getItem('emailAdmin');
    if (adminId == '') {
      adminId = 'sangnd@gmail.com';
    }
    this.hubConnection
      .invoke('AdminSendMessageToCustomer', {
        ConId: conId,
        Message: content,
        User: User,
        AdminId: adminId,
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
        AdminId: adminId,
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
        // console.log('message sent successfully to hub');
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
          if (messages.length > 0 && messages[0].Message != data.Message) {       
            var arrMsg=messages;
            console.log();
            
            this.messageThreadSource.next([...messages, data]);
            console.log("1");
            // console.log([...messages, data]);
            this.currentMessage = data;
          } else if (messages.length == 0) {
            console.log("2");
            console.log([ data]);
            
            this.messageThreadSource.next([...messages,data]);
            // this.currentMessage = data;
            
          }
          console.log(messages);
          
        });
        this.userSource$.pipe(take(1)).subscribe((users) => {
          this.userSource.next([...users, data]);
          console.log(users);
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

      // this.messageThread$.pipe(take(1)).subscribe((messages) => {
      //   this.messageThreadSource.next([...messages, data]);
      // });

      this.messageThread$.pipe(take(1)).subscribe((messages) => {
        if (messages.length > 0 && messages[0].Message != data.Message) {
          this.messageThreadSource.next([...messages, data]);
        } else if (messages.length == 0) {
          this.messageThreadSource.next([data]);
        }
      });

      this.userSource$.pipe(take(1)).subscribe((users) => {
        this.userSource.next([...users, data]);
      });
    });
  }
  messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  userSource = new BehaviorSubject<Message[]>([]);
  userSource$ = this.userSource.asObservable();
}
