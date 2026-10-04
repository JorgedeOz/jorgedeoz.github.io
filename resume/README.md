# Resume website

This folder contains the resume website published at [`/resume/`](../). The page is a static site: it has no build step, package manager, framework, or third-party runtime dependencies. Resume content is stored separately from the page layout so it can be updated in one place.

## How it works

- [`index.html`](./index.html) defines the accessible page structure, section navigation, and loading/error status. It loads the styles and JavaScript files.
- [`resume-info.json`](./resume-info.json) is the source of truth for profile details, About copy, focus areas, tech stack, services, work history, skills, education, languages, and contact information.
- [`resume-content.js`](./resume-content.js) fetches the JSON, validates required data, and builds the resume sections in the browser. It uses DOM methods and `textContent` for data values, and validates external links before adding them.
- [`resume.css`](./resume.css) contains the responsive layout, light and dark themes, sticky navigation, print styles, and reduced-motion support.
- [`theme.js`](./theme.js) applies the saved theme preference, follows the operating-system preference when no choice has been saved, and updates the sticky header background as sections scroll underneath it.
- [`favicon.svg`](./favicon.svg) is the resume's site icon.
- [`Resume.pdf`](./Resume.pdf) is the downloadable PDF linked from the page.

There are no dependencies to install.

## Update the resume

Edit [`resume-info.json`](./resume-info.json) to change content. Keep it valid JSON:

- Use double quotes around property names and string values.
- Separate properties and array items with commas.
- Do not add comments or leave a trailing comma.
- Experience entries render in the order they appear in the `experience` array.
- Each experience entry needs a role, company and HTTPS company URL, start and end dates, a location, highlights, and technologies. An optional client can have its own HTTPS URL and location prefix.
- Contact links accept email and telephone URLs; external company and LinkedIn links must use HTTPS.

Contact details and the **Download PDF** text link appear together directly below the About label. There is no separate Contact section.

The PDF file path is set by `profile.resumeFile` and must resolve to a same-origin HTTP(S) URL. Keep the PDF in this folder or update that value and the matching repository file together.

## Run locally

The page fetches `resume-info.json`, so it must be served over HTTP; opening `index.html` directly with a `file://` URL will prevent the browser from loading the data.

### Python

From the repository root, run:

```powershell
python -m http.server 8000
```

Then open <http://localhost:8000/resume/>. Stop the server with `Ctrl+C`.

To serve only this folder:

```powershell
python -m http.server 8000 --directory .\resume
```

Then open <http://localhost:8000/>. Stop the server with `Ctrl+C`.

### VS Code Live Server

If the Live Server extension is installed, open `resume/index.html`, choose **Open with Live Server**, and visit the resulting `/resume/` URL.

## Debugging and verification

1. Open the site through a local HTTP server, not as a local file.
2. Open the browser developer tools (**F12**).
3. In **Console**, look for JSON loading, validation, or JavaScript errors. A failed data load displays an error message on the page.
4. In **Network**, reload and confirm `resume-info.json`, `resume.css`, `resume-content.js`, `theme.js`, `favicon.svg`, and `Resume.pdf` return successfully. If data looks stale, disable the cache and reload.
5. After editing the JSON, verify that the experience cards, service cards, tags, and contact links render as expected.
6. Test the layout at desktop and mobile widths. Use the theme toggle to check light and dark appearances; with no saved theme choice, the page follows the browser or operating-system color preference.

This site is static and GitHub Pages compatible: committing changes to this folder publishes them at the repository's `/resume/` path.
