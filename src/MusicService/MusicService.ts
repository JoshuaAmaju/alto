import EventEmitter from "eventemitter3";
import { Song } from "../types";
import { insertAt, randomRange } from "../utils";
import { Events, RepeatMode, ShuffleMode } from "./types";

export default class MusicService {
  queue: Song[] = [];
  isInitialised = false;
  position: number = -1;
  private repeatMode = RepeatMode.NONE;
  private shuffleMode = ShuffleMode.NONE;

  private emitter = new EventEmitter();

  sendEvent(event: Events, ...payload: any[]) {
    this.emitter.emit(event, ...payload);
  }

  getQueueSize() {
    return this.queue.length;
  }

  isLastTrack() {
    return this.position === this.getQueueSize() - 1;
  }

  getRepeatMode() {
    return this.repeatMode;
  }

  setRepeatMode(mode: RepeatMode) {
    this.repeatMode = mode;
    this.sendEvent(Events.REPEAT_MODE_CHANGED);
  }

  getShuffleMode() {
    return this.shuffleMode;
  }

  setShuffleMode(mode: ShuffleMode) {
    this.shuffleMode = mode;
    this.sendEvent(Events.SHUFFLE_MODE_CHANGED);
  }

  getPositionWithShuffle() {
    return this.shuffleMode === ShuffleMode.SHUFFLE
      ? randomRange(0, this.getQueueSize())
      : this.position;
  }

  getNextPosition(force: boolean) {
    let position = this.getPositionWithShuffle() + 1;

    switch (this.repeatMode) {
      case RepeatMode.ALL:
        if (this.isLastTrack()) position = 0;
        break;
      case RepeatMode.CURRENT:
        if (force) {
          if (this.isLastTrack()) {
            position = -1;
          }
        } else {
          position -= 1;
        }
        break;
      case RepeatMode.NONE:
        if (this.isLastTrack()) position = -1;
        break;
    }

    return position;
  }

  getPreviousPosition(force: boolean) {
    let position = this.getPositionWithShuffle() - 1;

    switch (this.repeatMode) {
      case RepeatMode.ALL:
        if (position < 0) position = this.getQueueSize() - 1;
        break;
      case RepeatMode.NONE:
        if (position < 0) position = 0;
        break;
      case RepeatMode.CURRENT:
        if (force) {
          if (position < 0) {
            position = this.getQueueSize() - 1;
          }
        } else {
          position = this.position;
        }
        break;
    }

    return position;
  }

  getSongAt(position: number): Song {
    return this.queue[position];
  }

  getCurrentSong() {
    return this.getSongAt(this.position);
  }

  getQueueDuration() {
    return this.queue.reduce((acc, song) => {
      return acc + song.duration;
    }, 0);
  }

  maybeInitialise() {
    if (!this.isInitialised) {
      this.isInitialised = true;
      this.sendEvent(Events.INITIALISED);
    }
  }

  private openSong(song: Song) {
    this.sendEvent(Events.SET_SONG, song.getURL());
  }

  play() {
    this.sendEvent(Events.ACTION_PLAY);
  }

  pause() {
    this.sendEvent(Events.ACTION_PAUSE);
  }

  playSongAt(position: number) {
    this.position = position;
    this.openSong(this.getCurrentSong());

    this.maybeInitialise();
    this.sendEvent(Events.SONG_CHANGED);
    this.play();
  }

  openQueue(playingQueue: Song[], startPosition: number, startPlaying = true) {
    this.queue = playingQueue;
    this.position = startPosition;

    if (this.shuffleMode === ShuffleMode.SHUFFLE) {
      this.position = randomRange(0, this.getQueueSize());
    }

    if (startPlaying) {
      this.playSongAt(this.position);
    } else {
      this.openSong(this.getCurrentSong());
    }

    this.maybeInitialise();
    this.sendEvent(Events.QUEUE_CHANGED);
  }

  playSongs(songs: Song[], shuffleMode: ShuffleMode) {
    this.shuffleMode = shuffleMode;
    this.openQueue(songs, 0);
  }

  playNextSong(force: boolean) {
    const position = this.getNextPosition(force);

    if (position >= 0) {
      this.playSongAt(position);
    } else {
      this.sendEvent(Events.QUEUE_ENDED);
    }
  }

  playPreviousSong(force: boolean) {
    this.playSongAt(this.getPreviousPosition(force));
  }

  cycleRepeatMode() {
    switch (this.getRepeatMode()) {
      case RepeatMode.ALL:
        this.setRepeatMode(RepeatMode.CURRENT);
        break;
      case RepeatMode.CURRENT:
        this.setRepeatMode(RepeatMode.NONE);
        break;
      case RepeatMode.NONE:
        this.setRepeatMode(RepeatMode.ALL);
        break;
    }
  }

  toggleShuffle() {
    if (this.shuffleMode === ShuffleMode.NONE) {
      this.setShuffleMode(ShuffleMode.SHUFFLE);
    } else {
      this.setShuffleMode(ShuffleMode.NONE);
    }
  }

  addSong(song: Song) {
    this.queue.push(song);
    this.sendEvent(Events.QUEUE_CHANGED);
  }

  addSongs(songs: Song[]) {
    this.queue.concat(songs);
    this.sendEvent(Events.QUEUE_CHANGED);
  }

  addSongAtPosition(position: number, song: Song) {
    this.queue = insertAt(this.queue, [song], position);
    this.sendEvent(Events.QUEUE_CHANGED);
  }

  enqueueNext(song: Song) {
    const position = this.position + 1;
    this.addSongAtPosition(position, song);
  }

  // removeSong(position: number) {
  //   this.queue.splice(position, 1);
  //   this.reposition(position);
  //   this.sendEvent(Events.QUEUE_CHANGED);
  // }

  // reposition(deletedPosition: number) {
  //   let position = this.position;

  //   if (deletedPosition < position) {
  //     position = position - 1;
  //   }

  //   if (deletedPosition === position) {
  //     if (this.queue.length < deletedPosition) {
  //       this.position = position - 1;
  //     }
  //   }

  //   this.sendEvent(Events.POSITION_CHANGED);
  // }

  clearQueue() {
    this.queue = [];
    this.position = -1;
    this.sendEvent(Events.QUEUE_CHANGED);
  }

  seek(millis: number) {
    this.sendEvent(Events.ACTION_SEEK, millis);
  }

  addEventListener<P>(event: Events, fn: (...val: P[]) => any) {
    this.emitter.addListener(event, fn);

    return () => {
      this.emitter.removeListener(event, fn);
    };
  }

  removeEventListener<P>(event: Events, fn: (...val: P[]) => any) {
    this.emitter.removeListener(event, fn);
  }
}

export const service = new MusicService();
