export default class Timer {
  readonly start = new Date();

  stop() {
    const time = new Date().getTime() - this.start.getTime();
    return time + "ms";
  }
}
