# PulseAI – Unique Slide Theater MVP

## Start
```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Wo die Bilder hinmüssen
Next.js served statics aus `/public`.

**Lege die 10 Hintergründe hier ab:**
```
public/pulse/bg/bg-01.jpg
public/pulse/bg/bg-02.jpg
...
public/pulse/bg/bg-10.jpg
```

**Grain-Overlay:**
```
public/pulse/grain.png
```

In der App werden die Backgrounds automatisch pro Slide gewechselt (IntersectionObserver) in:
`components/BackgroundStage.tsx`

## Deine eigenen Bilder verwenden
- Ersetze die Dateien in `public/pulse/bg/`
- Behalte die Namen `bg-01..bg-10` bei
- Oder ändere das Array `BG` in `BackgroundStage.tsx`

## Warum das "nicht Standard" ist
- Slide Theater: jede Sektion = eigenes Set, eigener Hintergrund
- Cinematic Overlay + Scanlines + Film Grain
- Keine Charts-Hölle, sondern Editorial SaaS Look

