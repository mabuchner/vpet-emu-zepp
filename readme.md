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
- ✅ Tested only on Amazfit T-Rex 3.
- 🐢 Performance is slow (about 10% of the original speed).
- 🧭 No status icons.
- 🔇 Sound is not implemented.
- 💾 No save states - restarting the app resets progress.

## 🔧 Build & Run

### 1. Set up Zepp OS Development Environment

Follow the [Zepp OS documentation](https://docs.zepp.com/docs/intro/) to install prerequisites.

### 2. Clone the Repository

```sh
git clone https://github.com/mabuchner/vpet-emu-zepp.git
cd vpet-emu-zepp
```

### 3. Add Your ROM File

Copy your ROM file to `./assets/raw/TamagotchiP1.bin`.

### 4. Run in Simulator

Start the Zepp OS Simulator and run the following commands:

```sh
nvm use
zeus dev
```

### 5. Install on Your Zepp OS Watch

Generate a QR code and scan it with the Zepp App on your phone:

```sh
zeus preview
```
