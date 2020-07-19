import EventEmitter from "eventemitter3";
import { Song } from "../types";
import { insertAt, randomRange } from "../utils";
import { RepeatMode, ShuffleMode } from "./../PlaybackManager/types";
import { Events } from "./types";

export default class QueueService {
  queue: Song[] = [];
  position?: number | null;
  repeatMode = RepeatMode.NONE;
  shuffleMode = ShuffleMode.NONE;
  private emitter = new EventEmitter();

  sendEvent(event: Events, ...payload: any[]) {
    this.emitter.emit(event, ...payload);
  }

  getQueueSize() {
    return this.queue.length;
  }

  getSongAt(position: number): Song {
    return this.queue[position];
  }

  getQueueDuration() {
    return this.queue.reduce((acc, song) => {
      return acc + song.duration;
    }, 0);
  }

  setRepeatMode(mode: RepeatMode) {
    this.repeatMode = mode;
    this.sendEvent(Events.REPEAT_MODE_CHANGED, this.repeatMode);
  }

  setShuffleMode(mode: ShuffleMode) {
    this.shuffleMode = mode;
    this.sendEvent(Events.SHUFFLE_MODE_CHANGED, this.shuffleMode);
  }

  openQueue(playingQueue: Song[]) {
    this.queue = playingQueue;
    this.sendEvent(Events.QUEUE_CHANGED, this.queue);
  }

  enqueue(songs: Song[]) {
    this.queue.concat(songs);
    this.sendEvent(Events.QUEUE_CHANGED, this.queue);
  }

  enqueueAt(position: number, songs: Song[]) {
    this.queue = insertAt(this.queue, songs, position);
    this.sendEvent(Events.QUEUE_CHANGED, this.queue);
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
    this.sendEvent(Events.QUEUE_CHANGED, this.queue);
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

  // utilility methods

  isLastTrack() {
    return this.position === this.getQueueSize() - 1;
  }

  shufflePosition() {
    const get = () => randomRange(0, this.getQueueSize() - 1);

    if (this.shuffleMode === ShuffleMode.SHUFFLE) {
      let position = get();

      while (position === this.position) position = get();

      return position;
    }
  }

  getNextPosition(force: boolean) {
    let currentPos = this.position as number;
    const shuffledPos = this.shufflePosition();

    if (shuffledPos) currentPos = shuffledPos;

    const lastTrack = this.isLastTrack();
    let position: number | null = currentPos + 1;

    switch (this.repeatMode) {
      case RepeatMode.ALL:
        if (lastTrack) position = 0;
        break;
      case RepeatMode.CURRENT:
        if (force) {
          if (lastTrack) position = null;
        } else {
          position -= 1;
        }
        break;
      case RepeatMode.NONE:
        if (lastTrack) position = null;
        break;
    }

    return position;
  }

  getPreviousPosition(force: boolean) {
    let currentPos = this.position as number;
    const shuffledPos = this.shufflePosition();

    if (shuffledPos) currentPos = shuffledPos;

    let position = currentPos - 1;
    const queueSize = this.getQueueSize();

    switch (this.repeatMode) {
      case RepeatMode.ALL:
        if (position < 0) position = queueSize - 1;
        break;
      case RepeatMode.NONE:
        if (position < 0) position = 0;
        break;
      case RepeatMode.CURRENT:
        if (force) {
          if (position < 0) {
            position = queueSize - 1;
          }
        } else {
          position = currentPos;
        }
        break;
    }

    return position;
  }
}

export const service = new QueueService();
