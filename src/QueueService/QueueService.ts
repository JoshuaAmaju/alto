import EventEmitter from "eventemitter3";
import { Song } from "../types";
import { insertAt } from "../utils";
import { Events } from "./types";

export default class QueueService {
  queue: Song[] = [];
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

  openQueue(playingQueue: Song[]) {
    this.queue = playingQueue;
    this.sendEvent(Events.QUEUE_CHANGED);
  }

  enqueue(songs: Song[]) {
    this.queue.concat(songs);
    this.sendEvent(Events.QUEUE_CHANGED);
  }

  enqueueAt(position: number, songs: Song[]) {
    this.queue = insertAt(this.queue, songs, position);
    this.sendEvent(Events.QUEUE_CHANGED);
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
    this.sendEvent(Events.QUEUE_CHANGED);
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

export const service = new QueueService();
