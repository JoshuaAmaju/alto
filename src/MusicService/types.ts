export enum ShuffleMode {
  NONE = "none",
  SHUFFLE = "shuffle",
}

export enum RepeatMode {
  ALL,
  NONE,
  CURRENT,
}

export enum Events {
  ACTION_NEXT = "next",
  ACTION_PLAY = "play",
  ACTION_SEEK = "seek",
  ACTION_PAUSE = "pause",
  ACTION_PREVIOUS = "previous",
  ACTION_PLAY_PLAYLIST = "play from playlist",

  SET_SONG = "set song",
  PLAY_SONG = "play song",
  TIME_UPDATE = "time update",
  INITIALISED = "initialised",
  SONG_LOADED = "song loaded",
  POSITION_CHANGED = "position changed",
  PLAY_STATE_CHANGED = "play state changed",

  SONG_ENDED = "track ended",
  SONG_CHANGED = "track changed",

  QUEUE_ENDED = "queue ended",
  QUEUE_CHANGED = "queue changed",

  REPEAT_MODE_CHANGED = "repeat mode changed",
  SHUFFLE_MODE_CHANGED = "shuffle mode changed",
}
