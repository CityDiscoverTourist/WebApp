import { Message } from "./message.model";

export class UserChatBox {
  user: Message;
  right: number; //position

  constructor(_user: Message, _right: number) {
    this.user = _user;
    this.right = _right;
  }
}
