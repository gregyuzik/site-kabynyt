# site-kabynyt — project notes for Claude

This is a **static website** (HTML/CSS, no build framework) for the [Kabynyt](https://github.com/gregyuzik/Kabynyt) iOS app. Hosted on **GitHub Pages** at <https://kabynyt.com>.

The shared `~/git/CLAUDE.md` is Swift-focused — most of it does not apply here. Use the conventions in this file instead.

## Architecture

```
site-kabynyt/
├── index.html        # Landing page (hand-written)
├── 404.html          # Not-found (hand-written)
├── privacy.html      # Privacy policy (hand-written)
├── support.html      # Support / FAQ (hand-written)
├── styles.css        # Single shared stylesheet
├── manifest.json     # PWA manifest
├── sitemap.xml       # Update lastmod when pages change
├── robots.txt
├── CNAME             # `kabynyt.com`
├── .nojekyll         # Disables Jekyll so paths starting with `_` work
├── assets/
│   ├── AppIcon.png       # Re-rendered from KabynytiOS/AppIcon.icon/ — see "App icon sync" below
│   └── favicon-*.png     # 16/32/48/180/192/512 — generated from AppIcon.png via sips
├── favicon.ico           # 16+32+48 multi-resolution ICO, generated from the favicon-*.png set
├── .github/
│   ├── workflows/    # codeql, gitleaks, deploy-pages
│   ├── dependabot.yml
│   └── CODEOWNERS
└── scripts/git-hooks/pre-push   # Local validation hook
```

**No build step.** Every page is hand-written HTML pointing at `styles.css`. If we add localization later (mirroring site-klosyt's pattern), the build script lands at `build-i18n.js` and the deploy workflow gains a Node step. For now, GitHub Pages serves the raw files.

## App context

Kabynyt is iOS-only as of this writing (iPhone and iPad). The marketing copy reflects that. When macOS, tvOS, or visionOS targets ship, update:

- `index.html` → `<script type="application/ld+json">` → `operatingSystem` field
- `index.html` → "iCloud sync" feature card text
- `support.html` → "device you're on" line
- `privacy.html` → both "iPhone or iPad" mentions
- `README.md` → one-liner

## Workflow

- **Edit HTML / CSS directly.** No generator. Save and reload.
- **Local preview:** `python3 -m http.server 8000` (then http://localhost:8000/).
- **Validate before push:** the pre-push hook checks each HTML file is valid XML-ish (well-formed enough to render). Bypass with `git push --no-verify` only if you understand why.
- **GitHub Pages deploys automatically on push to `main`** via `.github/workflows/deploy.yml`. No manual deploy step.

## Branching & PRs

- **Never commit directly to `main`** (except this scaffold's bootstrap commit). Create a feature branch first: `git checkout main && git pull --ff-only && git checkout -b <topic>` (kebab-case, no `claude/` prefix). The full rationale lives in `~/.claude/CLAUDE.md` under "Session-start branch guard" and "One feature branch → one PR → one merge".
- One branch per logical change. Don't mix unrelated fixes.
- **Push uses SSH.** `git push` (no flags — `push.autoSetupRemote=true` is global) talks to `git@github.com:gregyuzik/site-kabynyt.git`. If push fails with `Permission denied (publickey)`, run `ssh-add --apple-use-keychain ~/.ssh/github` and retry. **Never `gh push` or `gh repo clone` — `gh` is for the GitHub API only, not git transport.**
- **Open a PR with `gh pr create` and auto-merge per the global default** in `~/.claude/CLAUDE.md` ("Pull Requests — auto-merge by default"). Don't leave PRs sitting open waiting for a manual merge command.
- Read-only tasks (audits, exploration) don't need a branch.

## Code style

- **HTML**: 4-space indent, lowercase tags, double-quoted attributes. Lang attribute on every `<html>` element (currently always `en`).
- **CSS**: Custom properties live in `:root`. Avoid `!important` except in the reduced-motion override. One stylesheet, no preprocessor.
- **JS**: None yet. If we add any, keep it small, no frameworks, no `eval` / `new Function`, must be CSP-safe.
- **Images**: PNG for the app icon (re-rendered from the simulator screenshot of `/Users/greg/git/Kabynyt/KabynytiOS/AppIcon.icon/` — see the "App icon sync" gotcha for the full capture flow). WebP for any future hero imagery; keep PNGs run through `oxipng -o max --strip safe` before committing.

## Security

- **CSP** is set per-page via `<meta http-equiv>`. Current policy is strict: `script-src 'self'`, no external origins, no inline scripts other than JSON-LD. Delivered via meta tag means `frame-ancestors`, `form-action`, `report-uri`, and `sandbox` are silently ignored — GitHub Pages can't inject HTTP headers. If we ever need those, move to Cloudflare Pages / Netlify.
- **External resources:** none. No fonts, no CDNs, no third-party images, no analytics. If you add anything, also update the CSP and `privacy.html` in the same PR.
- **JSON-LD inline scripts** are allowed under `script-src 'self'` only because the CSP is `'self'` not `'none'`. They contain no executable code (structured data only).

## Privacy claims

The privacy policy says: the app collects no data; this website uses no cookies and no analytics. Both must remain true. If you add an analytics service, **update `privacy.html` and the CSP in the same PR**, and document the change in this file.

## Common gotchas

- **CNAME goes in repo root, not a subdir.** GitHub Pages reads it from `/CNAME` to determine the custom domain. Don't move it.
- **DNS + TLS live outside this repo, and traffic flows through Cloudflare.** `kabynyt.com` is proxied (orange cloud) — `dig kabynyt.com` returns Cloudflare anycast IPs (e.g. `104.21.x.x` / `172.67.x.x`), not the GitHub Pages `185.199.108.x` set. Cloudflare terminates TLS at the edge; the origin is GitHub Pages (served by Fastly behind the scenes). Implications:
  - **HTTP-header security policies (HSTS, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Content-Security-Policy` with `frame-ancestors` / `form-action` / `report-uri`)** must be configured in the Cloudflare dashboard via SSL/TLS settings + Transform Rules. They cannot be set via `<meta http-equiv>`.
  - **Cloudflare features that auto-inject content** (Web Analytics, Rocket Loader, Auto Minify, Email Address Obfuscation) will fight the in-page CSP. The strict `script-src 'self'` blocks Web Analytics' `beacon.min.js`, but the attempt happens and the request flows through Cloudflare regardless. If you enable any of these, also update `privacy.html` to disclose them.
  - GitHub Pages **still issues the origin certificate** that Cloudflare validates the origin connection against. Don't disable Pages' Let's Encrypt cert.
- **`.nojekyll` must exist** or GitHub Pages skips any path starting with `_`. Don't delete it.
- **Don't hand-edit `sitemap.xml` lastmod blindly** — set it to the date the page actually changed. Stale lastmods are an SEO antipattern.
- **App icon sync:** the iOS app ships its icon as an iOS 26 Icon Composer bundle at `/Users/greg/git/Kabynyt/KabynytiOS/AppIcon.icon/` (the old `Assets.xcassets/AppIcon.appiconset` path is gone). The website icon must be the **actual iOS-rendered output** of that bundle — Icon Composer applies a Liquid Glass effect (translucency, refraction, automatic-gradient) at runtime that no static magick composite can fully replicate. The only reliable way to capture it is to screenshot the rendered icon from a booted simulator's home screen:

  ```sh
  # 1. Build + install Kabynyt on the canonical iOS 26 simulator.
  cd /Users/greg/git/Kabynyt
  [ -d Kabynyt.xcodeproj ] || xcodegen generate
  xcodebuild -scheme KabynytiOS \
    -destination 'platform=iOS Simulator,name=iPhone 17 Pro' \
    -derivedDataPath /tmp/kabynyt-build build
  APP=$(find /tmp/kabynyt-build -name 'Kabynyt.app' -type d | head -1)
  xcrun simctl boot "iPhone 17 Pro" 2>/dev/null
  xcrun simctl install booted "$APP"

  # 2. Send the sim to the home screen and screenshot it.
  xcrun simctl terminate booted com.legend.kabynyt 2>/dev/null
  sleep 1
  mkdir -p /tmp/icon-work
  xcrun simctl io booted screenshot /tmp/icon-work/springboard.png

  # 3. Find the Kabynyt icon's 180x180 region in the screenshot — coordinates
  #    depend on the home-screen layout. Crop a 200x200 area near where the
  #    icon sits, inspect visually, then tighten to 180x180 at the exact
  #    top-left of the icon. (For the current home-screen layout the icon
  #    was at +382+880, but that will drift as new apps install.)
  magick /tmp/icon-work/springboard.png -crop 180x180+382+880 /tmp/icon-work/icon-raw.png

  # 4. Mask the iOS continuous-corner squircle (radius ≈ 22.5% of icon size)
  #    so the corners are transparent rather than carrying home-screen
  #    wallpaper bleed, then Lanczos-upscale to 1024×1024.
  cd /Users/greg/git/site-kabynyt
  magick -size 180x180 xc:none -fill white \
    -draw "roundrectangle 0,0 179,179 41,41" /tmp/icon-work/mask.png
  magick /tmp/icon-work/icon-raw.png /tmp/icon-work/mask.png \
    -compose DstIn -composite /tmp/icon-work/icon-rounded.png
  magick /tmp/icon-work/icon-rounded.png -filter Lanczos \
    -resize 1024x1024 assets/AppIcon.png

  # 5. Regenerate the favicon set from the new 1024×1024 source.
  for s in 16 32 48 180 192 512; do
    sips -z $s $s assets/AppIcon.png --out assets/favicon-$s.png
  done
  magick assets/favicon-16.png assets/favicon-32.png assets/favicon-48.png favicon.ico
  ```

  The 180×180 native capture is the highest resolution iOS exposes for the rendered icon — the upscale to 1024 will be soft. The .app bundle also ships a legacy `AppIcon60x60@2x.png` at 120×120 as a fallback, but it's not higher quality. Commit `assets/AppIcon.png`, `assets/favicon-*.png`, and `favicon.ico` together.
- **Theme color in `<meta name="theme-color">` is split into dark/light variants** matching `styles.css`. If you change the page background, update both meta tags too.
