export class RLEArray {
  constructor(maxCapacity) {
    this._length = 0;
    this._indexTable = new Uint8Array(maxCapacity);
    this._values = [];
  }

  push(count, value) {
    const valueIndex = this._values.length;
    this._indexTable.set(new Array(count).fill(valueIndex), this._length);
    this._values.push(value);
    this._length += count;
    return this;
  }

  at(index) {
    return this._values[this._indexTable[index]];
  }

  length() {
    return this._length;
  }
}

export class RLEArrayBuilder {
  constructor() {
    this._counts = [];
    this._values = [];
  }

  push(count, value) {
    this._counts.push(count);
    this._values.push(value);
    return this;
  }

  build() {
    const len = this._counts.reduce((sum, count) => (sum += count), 0);
    const arr = new RLEArray(len);
    for (let i = 0; i < this._counts.length; i += 1) {
      const count = this._counts[i];
      const value = this._values[i];
      arr.push(count, value);
    }
    return arr;
  }
}

/*
const t = new RLEArrayBuilder()
  .push(1, 1)
  .push(2, 2)
  .push(3, 3)
  .push(4, 4)
  .build();
for (let i = 0; i < t.length(); i += 1) {
  console.log(`t[${i}]=${t.at(i)}`);
}

const execute = new RLEArrayBuilder()
  .push(256, {})
  .push(256, {})
  .push(256, {})
  .push(256, {})
  .push(256, {})
  .push(256, {})
  .push(256, {})
  .push(256, {})
  .push(256, {})
  .push(256, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(256, {})
  .push(64, {})
  .push(64, {})
  .push(64, {})
  .push(64, {})
  .push(64, {})
  .push(64, {})
  .push(64, {})
  .push(64, {})
  .push(64, {})
  .push(32, {})
  .push(16, {})
  .push(16, {})
  .push(4, {})
  .push(4, {})
  .push(4, {})
  .push(4, {})
  .push(4, {})
  .push(4, {})
  .push(4, {})
  .push(4, {})
  .push(4, {})
  .push(4, {})
  .push(4, {})
  .push(4, {})
  .push(4, {})
  .push(4, {})
  .push(4, {})
  .push(4, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(8, {})
  .push(4, {})
  .push(4, {})
  .push(8, {})
  .push(4, {})
  .push(4, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(16, {})
  .push(4, {})
  .push(1, {})
  .push(1, {})
  .push(1, {})
  .push(1, {})
  .push(1, {})
  .push(1, {})
  .push(1, {})
  .push(1, {})
  .push(4, {})
  .push(4, {})
  .push(1, {})
  .push(1, {})
  .push(1, {})
  .push(1, {})
  .push(1, {})
  .push(1, {})
  .push(1, {})
  .push(1, {})
  .push(2, {})
  .push(1, {})
  .push(1, {})
  .push(4, {})
  .push(4, {})
  .push(1, {})
  .push(7, {})
  .push(4, {})
  .push(4, {})
  .push(1, {})
  .push(2, {})
  .push(1, {})
  .push(3, {})
  .push(1, {})
  .build();

const times = [];
setInterval(() => {
  const r = (execute.length() * Math.random()) | 0;
  const start = Date.now();
  execute.at(r);
  times.push(Date.now() - start);
  if (times.length > 100) {
    times.shift();
  }
}, 10);

setInterval(() => {
  const avg = times.reduce((acc, time) => acc += time, 0) / times.length;
  console.log(`dt:${avg}ms`);
}, 1000);
*/
