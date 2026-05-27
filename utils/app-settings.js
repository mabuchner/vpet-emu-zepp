import { LocalStorage } from "@zos/storage";

const _storage = new LocalStorage();

export function getDebugUIEnabled() {
  return _storage.getItem("debugUI", false);
}

export function setDebugUIEnabled(value) {
  _storage.setItem("debugUI", value);
}
