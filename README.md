# vite-sass-bug

> **Bug repro**: Vite 8 + pnpm + Windows — SCSS `@use` fails when the package `exports` field maps a wildcard path via the `sass` condition to an underscore-prefixed partial.

## The Bug

When using `@use` to import an SCSS partial from a package that exposes it via the `sass` exports condition:

```scss
@use '@vite-sass-bug/example/styles/mixins';
```

The package's `exports` field is:

```jsonc
"./styles/*.scss": "./dist/styles/*.scss",
"./styles/*": {
  "sass": "./dist/styles/*.scss"   // maps  styles/mixins  →  dist/styles/_mixins.scss
}
```

- **Linux / macOS** – Vite constructs the sub-path as `./styles/_mixins` (forward slash), which correctly matches the `./styles/*` pattern. **Build succeeds. ✔**
- **Windows** – Vite constructs the sub-path as `./styles\_mixins` (**backslash**), which does **not** match `./styles/*`. **Build fails. ✘**

### Error on Windows

```
[vite] Pre-transform error: [sass] Error:
  "./styles\_mixins" is not exported under the conditions
  ["sass", "style", "development", "import"]
  from package @vite-sass-bug/example
  (see exports field in …\node_modules\@vite-sass-bug\example\package.json)
```

## Repo Structure

```
packages/
  example/          ← Package with underscore-prefixed _mixins.scss + exports `sass` condition
  vite-app/         ← Vite 8 starter that does @use 'example/styles/mixins'
```

## Reproduce Locally

```sh
pnpm install
pnpm --filter vite-app run build   # succeeds on Linux/macOS, fails on Windows
```

## CI Results

The [GitHub Actions workflow](.github/workflows/ci.yml) runs `vite build` on all three platforms:

| Platform       | Expected result |
| -------------- | --------------- |
| ubuntu-latest  | ✅ passes       |
| macos-latest   | ✅ passes       |
| windows-latest | ❌ fails (bug)  |