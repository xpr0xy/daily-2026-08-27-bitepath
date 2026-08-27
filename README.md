# BITEPATH

a deterministic reese trajectory forge for bass-music producers. drag an eight-node spectral bite path, shape the voice, audition clean or driven, then export the exact stereo 48 kHz PCM WAV for Ableton.

## control contract

- **material:** eight directly dragged trajectory nodes, root, length, detune width, sub weight, attack bite, drive, metal tail
- **performance:** strike, stop, held clean comparison
- **transport/UI:** responsive material disclosure
- **state:** three musical-job recipes and exact recipe copy/paste

The authored boundary is a mono-safe sub under a detuned, phase-bent reese body with a short metallic tail. The user owns pitch, duration, width, sub/body balance, impact, saturation, decay, and the spectral motion phrase. Reachable jobs: neuro callout, UKG foghorn, and halftime pressure stab.

```bash
npm install
npm test
npm run build
python3 -m http.server 4277 --directory docs
npm run qa
npm run validate:wav -- qa/bitepath-export.wav
```
