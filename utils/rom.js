export class ROM {
  constructor(data) {
    this._data = data;
    const wordCount = data.length >> 1;
    this._opcodes = new Uint16Array(wordCount);
    for (let i = 0; i < wordCount; i += 1) {
      this._opcodes[i] = (data[i * 2] << 8) | data[i * 2 + 1];
    }
  }

  getOpcode(pc) {
    return this._opcodes[pc];
  }

  size() {
    return this._data.length;
  }
}
