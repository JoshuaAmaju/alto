import { service } from "../MusicService/MusicService";
import { Events } from "../MusicService/types";
import { PlayStates } from "./types";

export default class AudioPlayer {
  private audio = new Audio();
  playState = PlayStates.SUSPENDED;
  private context = new AudioContext();
  //   private playState = this.context.state;
  private gain = this.context.createGain();
  private source = this.context.createMediaElementSource(this.audio);

  init() {
    this.gain.gain.value = 1;
    this.gain.connect(this.context.destination);
    this.source.connect(this.gain);

    this.audio.addEventListener("play", this.onPlay);
    this.audio.addEventListener("ended", this.onEnded);
    this.audio.addEventListener("pause", this.onPause);
    this.audio.addEventListener("loadeddata", this.onLoadedData);
    this.audio.addEventListener("timeupdate", this.onTimeUpdate);
  }

  getCurrentTime() {
    return this.audio.currentTime;
  }

  getDuration() {
    return this.audio.duration;
  }

  pause() {
    this.audio.pause();
    this.playState = PlayStates.SUSPENDED;
  }

  play() {
    setTimeout(() => this.audio.play(), 0);
  }

  seekTo(millis: number) {
    this.audio.currentTime = millis;
  }

  setMediaSource(url: string) {
    this.audio.src = url;
  }

  private onEnded = () => {
    this.playState = PlayStates.SUSPENDED;
    service.sendEvent(Events.SONG_ENDED);
  };

  private onPlay = () => {
    this.playState = PlayStates.PLAYING;
    service.sendEvent(Events.PLAY_STATE_CHANGED);
  };

  private onPause = () => {
    this.playState = PlayStates.SUSPENDED;
    service.sendEvent(Events.PLAY_STATE_CHANGED);
  };

  private onLoadedData = () => {
    service.sendEvent(Events.SONG_LOADED);
  };

  private onTimeUpdate = () => {
    service.sendEvent(Events.TIME_UPDATE);
  };

  dispose() {
    this.audio.removeEventListener("play", this.onPlay);
    this.audio.removeEventListener("ended", this.onEnded);
    this.audio.removeEventListener("pause", this.onPause);
    this.audio.removeEventListener("loadeddata", this.onLoadedData);
    this.audio.removeEventListener("timeupdate", this.onTimeUpdate);
  }
}
