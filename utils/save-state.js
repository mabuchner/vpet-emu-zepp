import {
  writeFileSync,
  readFileSync,
  statSync,
  renameSync,
  rmSync,
} from "@zos/fs";

function saveFile(romId) {
  return `save_${romId}.sav`;
}

function tempFile(romId) {
  return `save_${romId}.sav.tmp`;
}

function backupFile(romId) {
  return `save_${romId}.sav.bak`;
}

export function hasSaveState(romId) {
  return (
    statSync({ path: saveFile(romId) }) !== undefined ||
    statSync({ path: backupFile(romId) }) !== undefined
  );
}

export function writeSaveState(romId, data) {
  writeFileSync({ path: tempFile(romId), data: data.buffer });
  if (statSync({ path: backupFile(romId) }) !== undefined) {
    rmSync({ path: backupFile(romId) });
  }
  if (statSync({ path: saveFile(romId) }) !== undefined) {
    renameSync({ oldPath: saveFile(romId), newPath: backupFile(romId) });
  }
  renameSync({ oldPath: tempFile(romId), newPath: saveFile(romId) });
}

export function readSaveState(romId) {
  if (statSync({ path: saveFile(romId) }) !== undefined) {
    return readFileSync({ path: saveFile(romId) });
  }
  return readFileSync({ path: backupFile(romId) });
}

export function deleteSaveState(romId) {
  if (statSync({ path: saveFile(romId) }) !== undefined) {
    rmSync({ path: saveFile(romId) });
  }
  if (statSync({ path: backupFile(romId) }) !== undefined) {
    rmSync({ path: backupFile(romId) });
  }
}
