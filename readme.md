# vpet-emu-zepp

**vpet-emu-zepp** is an experimental emulator for the first-generation of
virtual pets (E0C6200 CPU, Tamagotchi, Digimon), running on **Zepp OS 4**.

![](https://github.com/user-attachments/assets/2b3e0ffa-8f51-422d-a161-0c60b6fe77af)

![](https://github.com/user-attachments/assets/a5928884-cdeb-43d0-989b-71a3243f29bc)

> ⚠️ **Note:** This emulator is distributed **without a ROM** file. You must
> supply your own legally obtained ROM.

The implementation heavily inspired by
[BrickEmuPy](https://github.com/azya52/BrickEmuPy).

## 🚧 Status

This emulator is a work in progress, with many limitations:

- ✅ Only Tamagotchi P1 is known to run successfully.
- 🖼️ Status icons use the Tamagotchi P1 layout for all ROMs.
- ✅ Tested only on Amazfit T-Rex 3.
- ⏱️ Emulation speed varies by device; close to full speed on Amazfit T-Rex 3.
- 💾 Progress is saved automatically when leaving the emulator and every 5 minutes, and restored when re-selecting a ROM. Use the **...** button next to a ROM to open its configuration menu, where you can reset the save state.
- 🔇 Sound is not implemented.

## 🔧 Build & Run

### 1. Set up Zepp OS Development Environment

Follow the [Zepp OS documentation](https://docs.zepp.com/docs/intro/) to install prerequisites.

### 2. Clone the Repository

```sh
git clone https://github.com/mabuchner/vpet-emu-zepp.git
cd vpet-emu-zepp
```

### 3. Add Your ROM Files

Copy your ROM files to `./assets/raw/`. The emulator looks for the following
filenames:

| File                      | Device                |
| ------------------------- | --------------------- |
| `TamagotchiP1.bin`        | Tamagotchi P1         |
| `TamagotchiP1J.bin`       | Tamagotchi P1 (JP)    |
| `TamagotchiP2.bin`        | Tamagotchi P2         |
| `TamagotchiAngel.bin`     | Tamagotchi Angel      |
| `TamagotchiMorino.bin`    | Tamagotchi Morino     |
| `TamagotchiUmino.bin`     | Tamagotchi Umino      |
| `TamagotchiMothra.bin`    | Tamagotchi Mothra     |
| `TamagotchiGenjintch.bin` | Tamagotchi Genjintch  |
| `TamagotchiTamaotch.bin`  | Tamaotch              |
| `DigimonV1ES.bin`         | Digimon Ver. 1 (EU)   |
| `DigimonV1JA.bin`         | Digimon Ver. 1 (JP-A) |
| `DigimonV1JB.bin`         | Digimon Ver. 1 (JP-B) |
| `DigimonV2J.bin`          | Digimon Ver. 2 (JP)   |
| `DigimonV3J.bin`          | Digimon Ver. 3 (JP)   |
| `DigimonV4J.bin`          | Digimon Ver. 4 (JP)   |

You do not need all files — entries for missing ROMs are shown greyed out in
the selection screen and cannot be launched.

### 4. Run in Simulator

Start the Zepp OS Simulator and run the following commands:

```sh
nvm use
zeus dev
```

### 5. Run Benchmarks

To measure performance of the CPU emulator and display rendering locally:

```sh
npm run benchmark
```

### 6. Install on Your Zepp OS Watch

Generate a QR code and scan it with the Zepp App on your phone:

```sh
zeus preview
```
