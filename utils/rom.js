export class ROM {
  constructor(data) {
    this._data = data;
  }

  getWord(address) {
    return (this._data[address] << 8) | this._data[address + 1];
  }

  size() {
    return this._data.length;
  }
}

//const data = new Uint8Array(require("Storage").readArrayBuffer("rom.bin"));
//const rom = new ROM(data);
//setInterval(() => {
//  const r = (rom.size() * Math.random()) | 0;
//  const start = Date.now();
//  rom.getWord(r);
//  const dt = Date.now() - start;
//  console.log(`getWord() = ${dt}`);
//}, 1000);
