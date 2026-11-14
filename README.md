# Abeera — Personal Portfolio

Personal portfolio website of **Abeera**, a web developer and BS Software Engineering student at COMSATS University Islamabad, Lahore Campus.

It is a single-page static site built with **HTML, Tailwind CSS (Play CDN) and plain JavaScript**. There is no build step: the files in this repository are the website.

## Features

- Responsive layout for phones, tablets and desktops
- Sections: Home, About, Technical Skills, Featured Projects, Education, Contact
- Project cards with a full-size screenshot viewer (gallery dialog)
- Typewriter effect for the hero role line (turned off for visitors who prefer reduced motion)
- Working contact form through [Web3Forms](https://web3forms.com), with honest error messages if sending fails
- Accessibility: skip link, visible focus styles, ARIA labels, keyboard-friendly mobile menu
- SEO and social sharing meta tags, SVG favicon

## Tech stack

| Area | Used |
|---|---|
| Markup | HTML5 |
| Styling | Tailwind CSS (Play CDN + forms plugin), custom CSS |
| Scripts | Vanilla JavaScript (no frameworks) |
| Fonts | Google Fonts: Margarine, Plus Jakarta Sans, JetBrains Mono |
| Contact form | Web3Forms |
| Hosting | Any static host (Cloudflare Pages, GitHub Pages, Netlify, Vercel) |

## Project structure

```
abeera-portfolio/
├── index.html              all page content + Tailwind colour/font config
├── assets/
│   ├── css/styles.css      focus styles, mobile menu, form states, reduced motion
│   ├── js/main.js          site settings, menu, active nav, contact form, gallery, typewriter
│   ├── images/             portrait and project screenshots
│   │   └── projects/       restaurant/, couchly/ and other project images
│   └── favicon.svg
├── .editorconfig
├── .gitattributes
├── .gitignore
└── README.md
```

## Run locally

Double-clicking `index.html` works, but a local server is closer to the real site:

```bash
cd abeera-portfolio
python -m http.server 8000
```

Then open <http://localhost:8000>. You can also use the VS Code **Live Server** extension.
An internet connection is needed for Tailwind and the fonts.

## Deploy

### Cloudflare Pages
1. Push this repository to GitHub.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → connect the repository.
3. Framework preset: **None**, build command: *(empty)*, output directory: `/`.

### GitHub Pages
1. In the repository, go to **Settings → Pages**.
2. Source: **Deploy from a branch**, branch: `main`, folder: `/ (root)`.
3. The site will be live at `https://<username>.github.io/<repository-name>/`.

After the site is live, add the `canonical` and `og:url` tags noted near the top of `index.html`.

---

## Editing guide

### Site settings
Open `assets/js/main.js` and edit the `SITE` block at the top:

| Setting | What it does |
|---|---|
| `email` | Email shown on the page and used in every mailto link |
| `githubUrl` | Every GitHub link on the page |
| `linkedinUrl` | LinkedIn links stay **hidden** until this is filled in |
| `web3formsAccessKey` | Turns the contact form on (see below) |

### Contact form (free)
1. Go to <https://web3forms.com> and enter the email that should receive messages.
2. Copy the access key they email you into `web3formsAccessKey`.
3. Deploy and send yourself a test message.

Until the key is set, submitting the form shows "Message not sent." with a link to email instead. It never pretends to send.
The Web3Forms access key is designed to be public (it can only send to your own inbox), so it is safe to commit.

### Projects
- Add a big project: copy the **BIG PROJECT TEMPLATE** at the bottom of the Projects section in `index.html`.
- Smaller / academic projects: use the **SMALL PROJECT CARDS** template there (two cards per row).
- Add a "Live demo" button only after a project is deployed; the code is in the note at the top of the Projects section.
- Project images live in `assets/images/projects/`:
  - `restaurant/` and `couchly/`: real screenshots (full size + `-thumb` versions); clicking one opens the full-size viewer.
  - `cover-showcase.webp` in each folder is the card's main picture.
  - Expression Evaluator and NoteHub use illustrations marked "Illustration". Replace them with real screenshots (4:3, e.g. 1600×1200) and remove the `illus-badge` line.

### Colours and fonts
All colours and fonts are set in the `tailwind.config` block near the top of `index.html`
(cream background, sun yellow, berry pink, charcoal text). `assets/css/styles.css` uses the same hex values, so search and replace a hex code to change it everywhere.

Fonts: Margarine for the logo, hero name and section headings (`font-brand`); Plus Jakarta Sans for body text; JetBrains Mono for small labels.

The role line under the hero name is typed out by `setupTypewriter()` in `main.js`. To change it, edit the text in both the `sr-only` span and the two `tw-` spans in the hero of `index.html`.

### Portrait
The hero photo is `assets/images/abeera.jpg` (4:5 ratio), shown inside the arched frame. Replace that file with a new photo of the same name to change it.

## License

© Abeera. All rights reserved. The photos, project screenshots and written content belong to the author and may not be reused without permission.
