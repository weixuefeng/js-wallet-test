'use strict';


class Hasher {

  constructor(options) {
    this.unitSize = 4;
    this.unitOrder = 0;
    this.blockSize = 16;
    this.blockSizeInBytes = this.blockSize * this.unitSize;
    this.options = options || {};
    this.reset();
  }

  reset() {
    this.state = {};
    this.state.message = '';
    this.state.length = 0;
  }

  getState() {
    return JSON.parse(JSON.stringify(this.state));
  }

  setState(state) {
    this.state = state;
  }

  update(message) {
    this.state.message += message;
    this.state.length += message.length;
    this.process();
  }

  process() {
  }

  finalize() {
    return '';
  }

  getStateHash(size) {
    return '';
  }

  addPaddingPKCS7(length) {
    this.state.message += new Array(length + 1).join(String.fromCharCode(length));
  }

  addPaddingISO7816(length) {
    this.state.message += "\x80" + new Array(length).join("\x00");
  }

  addPaddingZero(length) {
    this.state.message += new Array(length + 1).join("\x00");
  }
}

export default Hasher;