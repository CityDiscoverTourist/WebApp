import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input, OnDestroy, OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {  Message } from 'src/app/models';
import { NgForm } from '@angular/forms';
import { MessageService } from 'src/app/services';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatBoxComponent implements OnInit, AfterViewInit ,OnDestroy {
  @Input() user: Message;//information of chat box
  messageContent: string;
  @ViewChild('ChatBox', { static: true }) element: ElementRef;
  @Input() right: number;
  @Output() removeChatBox = new EventEmitter();
  @Output() activedChatBoxEvent = new EventEmitter();
  isCollapsed = false;
  @ViewChild('messageForm') messageForm: NgForm;
  // @ViewChild(ScrollToBottomDirective) scroll: ScrollToBottomDirective;

  constructor(public messageService: MessageService) {
  
  }
  ngOnDestroy(): void {
    this.messageService.messageThreadSource.unsubscribe();
    this.messageService.userSource.unsubscribe();
  }

  ngOnInit(): void {
    // this.messageService.connect();
  }
  ngAfterViewInit() {
    var chatBox = document.getElementById(this.user.User)!;
    chatBox.style.right = this.right + "px";
  }
  @HostListener("scroll", ["$event"])
  onScroll(event:any) {
    let pos = event.target.scrollTop + event.target.offsetHeight;
    let max = event.target.scrollHeight;
    //pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
  }

  sendMessage(conId:string): void {  
    this.messageService.sendMessageToHub(conId,this.messageContent,`${'admin'+this.user.User}`);
    this.messageForm.reset();
  }
  closeBoxChat() {
    this.removeChatBox.emit(this.user.User);
  }

  onFocusEvent(event: any) {
    this.activedChatBox();
  }

  activedChatBox() {
    this.activedChatBoxEvent.emit(this.user.User)
  }

  isTrue(msgValue:string, msgUser:string){
    return msgValue.includes(msgUser);
  }
  

}
