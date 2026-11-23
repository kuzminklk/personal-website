## About

### Description

Daniel Cosmo's (me) personal website project

### Technologies

Development: Visual Studio Code, Artificial intelligence assistance  
Programming language: JavaScript → TypeScript  
Environment: Node.js → pnpm  
Framework: React → Next.js (app router, “/src” directory)  
Internationalization: next-intl (English, Russian, Belarusian, Polish)  
Markup languages: HTML, CSS  
Design: Dark & Light Theme, Animations, Variable Font (Amstelvar), Pixel Font (Pixelify Sans), Custom Pixel Icons  
Formatting: “.editorconfig”, “.vscode/…”, Prettier, Husky, lint-staged  
Linting: ESLint, TypeScript checks  
Search Engine and Social Media Optimization: Open Graph metadata, localized Open Graph images, Twitter (X) metadata, Structured Data, hreflang, Sitemap  
Version Control: Git, GitHub

## State

### Branches

- **main—production ready for Vercel**
- **typescript-next—Next.js and TypeScript implementation**
- **typescript-next-deepseek—Visual redesign, pixel icon system, four locales, Open Graph and multilingual SEO (current work)**
- javascript-express-vite-react—Express as a server and React plus Vite as front-end implementation
- javascript-express—Express as a server and static front-end implementation
- javascript-vite-react—React and Vite front-end implementation
- python-flask—Python plus Flask as a server with static front-end implementation

### Path

1. Developed with Python and Flask
   1. Developed major design vision (colors, fonts)
2. Implemented with Express
3. Implemented with React and Vite
4. Tried to combine Express and React plus Vite
5. **Implemented with Next.js and TypeScript**
   1. Filled the website with about, code, sports, photography sections
   2. Developed mobile layout
   3. Translated with next-intl
   4. Improved code formatting with Prettier, ESLint, Husky, lint-staged
   5. Added Open Graph metadata and do Search Engine Optimization
   6. Improved code quality via TypeScipt
6. **Redesigned in the “observatory archive” style on typescript-next-deepseek**
   1. Reworked the visual design (cream paper, ink, pixel details, grain)
   2. Added Belarusian and Polish locales with localized pathnames
   3. Replaced OS emoji with custom 16×16 pixel icons
   4. Rebuilt Open Graph metadata and generated localized 1200×630 previews
   5. Fixed Telegram previews, hreflang, sitemap and structured data

### To-dos

- ~~Review Search Engine Optimization and Open Graph (works badly in Telegram)~~ — resolved: absolute metadata with `metadataBase`, per-page canonical and hreflang, localized 1200×630 Open Graph images (see [docs/specs/open-graph-telegram.md](docs/specs/open-graph-telegram.md))
- ~~Change emoji appearance so it is the same between different operating systems~~ — resolved: custom pixel icon system rendered as SVG (see [docs/specs/pixel-emoji.md](docs/specs/pixel-emoji.md))

## Usage

### Visit

You could visit [a deployed website at Vercel](https://kuzminklk.vercel.app/)

### Clone

Clone the codebase via `git clone https://github.com/kuzminklk/personal-website`

### Run

1. Install dependencies by `pnpm install`
2. Run development server via `pnpm dev`
3. Build and start a production server via `pnpm build` and `pnpm start`

### Verify

1. Lint the code via `pnpm lint`
2. Check types via `pnpm typecheck`
3. Build the project via `pnpm build`

### Regenerate assets

1. Regenerate the localized Open Graph images via `pnpm og` (requires Google Chrome/Chromium); use `pnpm og -- --only=en,ru` for selected locales
2. Regenerate the pixel-art portrait, project thumbnails and icon via `pnpm pixel-assets` (requires Python 3 and Pillow)

## Documentation

See [docs/README.md](docs/README.md) for the design system, development guide,
feature specs (visual redesign, Open Graph/Telegram, pixel emoji, internationalization)
and decision records.
