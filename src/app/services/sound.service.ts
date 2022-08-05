import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  constructor() { }

  playAudioMessage() {
    let audio = new Audio();
    audio.src = "../../../assets/sound/pristine-message.mp3";
    audio.load();
    audio.play();
  }
}
