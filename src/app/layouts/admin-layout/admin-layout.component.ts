import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UserChatBox, Message } from 'src/app/models';
import { AuthenticateService, MessageService, SoundService } from 'src/app/services';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit {
  isClose = false;
  isClose1 = false;
  isClose2 = false;
  constructor(
    private authService: AuthenticateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private soundService:SoundService,
  ) {
    this.unReadMessageFromSenderUsername();
  }
  ngOnInit(): void {
    this.messageService.connect();
    this.messageService.userSource$.subscribe((data) => {
      console.log('Xem co msg ko');
      console.log(data);
    });
    const userChatBox: UserChatBox[] = [];
    // = JSON.parse(localStorage.getItem('chatboxusers'));
    if (userChatBox) {
      this.chatBoxUsers = userChatBox;
    } else {
      this.chatBoxUsers = [];
    }
  }

  chatBoxUsers: UserChatBox[] = [];
  usernameActived: string;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  unReadMessageFromSenderUsername() {
    this.messageService.userSource$.subscribe((data) => {
      data.forEach((element) => {
        let sum: number = 0;
        if (this.chatBoxUsers.length < 3 && !element.User.startsWith('admin')) {
          this.soundService.playAudioMessage();
          this.selectUser(element); //display chat-box
          sum += 1;
        }
      });
      console.log(data);
    });
  }
  selectUser(user: Message) {
    // this.clearUnreadMessage(user.userName);
    this.usernameActived = user.User;
    switch (this.chatBoxUsers.length % 2) {
      case 2: {
        var u = this.chatBoxUsers.find((x) => x.user.User === user.User);
        if (u != undefined) {
          this.chatBoxUsers = this.chatBoxUsers.filter(
            (x) => x.user.User !== user.User
          );
          this.chatBoxUsers.push(u);
        } else {
          this.chatBoxUsers.push(new UserChatBox(user, 50));
        }
        localStorage.setItem('chatboxusers', JSON.stringify(this.chatBoxUsers));
        break;
      }
      case 1: {
        var u = this.chatBoxUsers.find((x) => x.user.User === user.User);
        if (u != undefined) {
          this.chatBoxUsers = this.chatBoxUsers.filter(
            (x) => x.user.User !== user.User
          );
          this.chatBoxUsers.push(u);
        } else {
          this.chatBoxUsers.push(new UserChatBox(user, 50 + 350));
        }
        localStorage.setItem('chatboxusers', JSON.stringify(this.chatBoxUsers));
        break;
      }
      default: {
        //0
        var u = this.chatBoxUsers.find((x) => x.user.User == user.User);
        if (u != undefined) {
          this.chatBoxUsers = this.chatBoxUsers.filter(
            (x) => x.user.User !== user.User
          );
          this.chatBoxUsers.push(u);
        } else {
          this.chatBoxUsers.push(new UserChatBox(user, 50));
        }
        localStorage.setItem('chatboxusers', JSON.stringify(this.chatBoxUsers));
        break;
      }
    }
  }

  removeChatBox(event: string) {
    this.chatBoxUsers = this.chatBoxUsers.filter((x) => x.user.User !== event);
    localStorage.setItem('chatboxusers', JSON.stringify(this.chatBoxUsers));
  }

  activedChatBox(event: string) {
    this.usernameActived = event;
    var u = this.chatBoxUsers.find((x) => x.user.User === event);
    if (u) {
      this.chatBoxUsers = this.chatBoxUsers.filter(
        (x) => x.user.User !== event
      ); //remove
      this.chatBoxUsers.push(u); // add to end of array
      localStorage.setItem('chatboxusers', JSON.stringify(this.chatBoxUsers));
    }
  }

  changeShow() {
    if (this.isClose) {
      this.isClose = false;
    } else this.isClose = true;
  }
  changeShow1() {
    if (this.isClose1) {
      this.isClose1 = false;
    } else this.isClose1 = true;
  }
  changeShow2() {
    if (this.isClose2) {
      this.isClose2 = false;
    } else this.isClose2 = true;
  }
  exit() {
    this.authService.clearToken();
    this.router.navigate(['../login'], {
      relativeTo: this.activatedRoute,
    });
  }
}
