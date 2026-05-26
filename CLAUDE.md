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
│   ├── favicon-*.png     # 16/32/48/180/192/512 — generated from AppIcon.png via sips
│   └── screenshots/      # Framed device screenshots for the showcase section
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
- **Images**: PNG for the app icon (sync from `/Users/greg/git/Kabynyt/KabynytiOS/Assets.xcassets/AppIcon.appiconset/AppIcon.png`). WebP for any screenshots / hero imagery added later.

## Security

- **CSP** is set per-page via `<meta http-equiv>`. Current policy is strict: `script-src 'self'`, no external origins, no inline scripts other than JSON-LD. Delivered via meta tag means `frame-ancestors`, `form-action`, `report-uri`, and `sandbox` are silently ignored — GitHub Pages can't inject HTTP headers. If we ever need those, move to Cloudflare Pages / Netlify.
- **External resources:** none. No fonts, no CDNs, no third-party images, no analytics. If you add anything, also update the CSP and `privacy.html` in the same PR.
- **JSON-LD inline scripts** are allowed under `script-src 'self'` only because the CSP is `'self'` not `'none'`. They contain no executable code (structured data only).

## Privacy claims

The privacy policy says: the app collects no data; this website uses no cookies and no analytics. Both must remain true. If you add an analytics service, **update `privacy.html` and the CSP in the same PR**, and document the change in this file.

## Common gotchas

- **CNAME goes in repo root, not a subdir.** GitHub Pages reads it from `/CNAME` to determine the custom domain. Don't move it.
- **DNS lives outside this repo.** A/AAAA records for `kabynyt.com` need to point at GitHub Pages (`185.199.108.153` / `109` / `110` / `111` for A; the IPv6 set similarly). The `www` subdomain should `CNAME` to `gregyuzik.github.io`. GitHub Pages will issue a Let's Encrypt cert automatically once DNS resolves.
- **`.nojekyll` must exist** or GitHub Pages skips any path starting with `_`. Don't delete it.
- **Don't hand-edit `sitemap.xml` lastmod blindly** — set it to the date the page actually changed. Stale lastmods are an SEO antipattern.
- **App icon sync:** the iOS app ships its icon as an iOS 26 Icon Composer bundle at `/Users/greg/git/Kabynyt/KabynytiOS/AppIcon.icon/` (the old `Assets.xcassets/AppIcon.appiconset` path is gone). The website icon is a deliberate aurora-themed variant — it does NOT match the solid-indigo iOS app icon. It uses the same white cabinet silhouette over a green / cyan / indigo aurora mesh, echoing the in-app AuroraCanvas. To regenerate:

  ```sh
  # 1. Aurora-mesh background (Shepards interpolation between control points)
  #    emerald top-left, cyan top-right, indigo bottom.
  magick -size 1024x1024 xc:'#0f1230' \
    -sparse-color Shepards '
      200,200 #4dd6a0
      720,260 #4d9dd6
      80,900  #2a1a55
      950,900 #1a0e3a
      512,512 #1f3070
    ' \
    \( /Users/greg/git/Kabynyt/KabynytiOS/AppIcon.icon/Assets/cabinet.png \
       -resize 620x620 \
       -channel A -evaluate multiply 0.95 +channel \
    \) -gravity center -compose Over -composite \
    assets/AppIcon.png

  # 2. Generate the favicon set from the new 1024x1024 source.
  sips -z 16 16   assets/AppIcon.png --out assets/favicon-16.png
  sips -z 32 32   assets/AppIcon.png --out assets/favicon-32.png
  sips -z 48 48   assets/AppIcon.png --out assets/favicon-48.png
  sips -z 180 180 assets/AppIcon.png --out assets/favicon-180.png
  sips -z 192 192 assets/AppIcon.png --out assets/favicon-192.png
  sips -z 512 512 assets/AppIcon.png --out assets/favicon-512.png
  magick assets/favicon-16.png assets/favicon-32.png assets/favicon-48.png favicon.ico
  ```

  If the cabinet silhouette changes (different shape, not just color), use the new `cabinet.png` path. If the aurora palette changes in the app, retune the Shepards control points so the icon stays in sync visually. Commit `assets/AppIcon.png`, `assets/favicon-*.png`, and `favicon.ico` together.
- **Theme color in `<meta name="theme-color">` is split into dark/light variants** matching `styles.css`. If you change the page background, update both meta tags too.
