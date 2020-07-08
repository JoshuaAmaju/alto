export default class AudioPlayer {
  private gain?: GainNode;
  private audio = new Audio();
  private context = new AudioContext();
  private source?: MediaElementAudioSourceNode;

  init() {
    const { audio, context } = this;

    this.gain = context.createGain();
    this.source = context.createMediaElementSource(audio);

    this.gain.gain.value = 0.5;
    this.gain.connect(context.destination);
    this.source.connect(this.gain);
  }

  getCurrentTime() {
    return this.audio.currentTime;
  }

  getDuration() {
    return this.audio.duration;
  }

  pause() {
    this.audio.pause();
  }

  play() {
    setTimeout(() => this.audio.play(), 0);
  }

  seekTo(millis: number) {
    this.audio.currentTime = millis;
  }

  setMediaSource(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.audio.src = url;
      this.audio.addEventListener("loadeddata", () => resolve());
      this.audio.addEventListener("error", (e) => reject(e.message));
    });
  }

  addListener(type: keyof HTMLMediaElementEventMap, listener: EventListener) {
    this.audio.addEventListener(type, listener);
  }

  removeListener(
    type: keyof HTMLMediaElementEventMap,
    listener: EventListener
  ) {
    this.audio.removeEventListener(type, listener);
  }
}
