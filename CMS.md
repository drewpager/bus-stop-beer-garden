# Managing site content

The site is built from Markdown files in `src/content/`. Editors don't touch
those files directly — they use the CMS at:

**https://www.beerbusstop.com/admin/**

Saving in the CMS commits to `main`, which triggers the GitHub Actions build.
Changes appear on the live site about a minute later.

| CMS section      | Controls                          | Files                 |
| ---------------- | --------------------------------- | --------------------- |
| Menu Items       | The "On Tap" page                 | `src/content/menu/`   |
| Happenings       | The events page                   | `src/content/events/` |
| Plants           | The gardens page                  | `src/content/plants/` |
| Stops / Location | Address, hours, phone on homepage | `src/content/stops/`  |

> **Custom domain.** The repo is configured to serve from
> `www.beerbusstop.com`: `public/CNAME` holds the domain, and
> `astro.config.mjs` sets `site: 'https://www.beerbusstop.com'` and `base: '/'`.
> What's left is outside this repo — pointing DNS at GitHub Pages and setting
> the custom domain in the repo's *Settings → Pages*. See "DNS" at the bottom.

## One-time setup: "Sign in with GitHub"

GitHub's OAuth flow needs a server to exchange the login code for a token.
GitHub Pages only serves static files, so it can't do this itself. Until the
relay below is deployed, **the GitHub button will not work** — use the token
method in the next section.

1. **Register a GitHub OAuth App** — <https://github.com/settings/developers> →
   *New OAuth App*.
   - Homepage URL: `https://www.beerbusstop.com/`
   - Authorization callback URL: leave blank for now; you'll set it in step 3.
   - Save the **Client ID**, and generate and copy a **Client Secret**.

2. **Deploy the auth relay** to Cloudflare Workers:

   ```sh
   git clone https://github.com/sveltia/sveltia-cms-auth.git
   cd sveltia-cms-auth
   npx wrangler deploy
   ```

   Then in the Cloudflare dashboard, under the Worker's *Settings → Variables*,
   add these as **encrypted** secrets:

   | Name                   | Value                                |
   | ---------------------- | ------------------------------------ |
   | `GITHUB_CLIENT_ID`     | from step 1                          |
   | `GITHUB_CLIENT_SECRET` | from step 1                          |
   | `ALLOWED_DOMAINS`      | `www.beerbusstop.com`                |

   The allowlist takes a comma-separated list, so while the custom domain is
   still being set up you can permit both: `www.beerbusstop.com,
   drewpager.github.io`. Drop the old host once the domain has cut over.

3. **Point the OAuth App at the Worker.** Back in the GitHub OAuth App settings,
   set the callback URL to `https://YOUR-WORKER.workers.dev/callback`.

4. **Enable it in this repo.** In `public/admin/config.yml`, uncomment the
   `base_url` line under `backend:` and set it to your Worker URL (no trailing
   slash, no `/callback`). Commit and push.

Anyone with write access to the repo can then sign in with their own GitHub
account. To give a staff member access, invite them as a repo collaborator.

## Fallback: "Sign in with Token"

Works today with no setup, and is a useful backup if the Worker ever goes down.

1. Create a fine-grained personal access token at
   <https://github.com/settings/personal-access-tokens/new>.
2. Scope it to **only** the `bus-stop-beer-garden` repository, with
   **Contents: Read and write** permission.
3. On the CMS login screen, choose **Sign in with Token** and paste it.

Tokens expire and are per-person, so this is workable for one or two technical
editors but not a good long-term answer for staff.

## Editing locally

Sveltia CMS can write straight to your working copy — no proxy server, and the
`local_backend` option other CMSes use is ignored here.

```sh
npm run dev
```

Open <http://localhost:4321/admin/index.html>, click
**Work with Local Repository**, and pick the project folder. Requires Chrome,
Edge, or another Chromium browser — the File System Access API this relies on
isn't available in Firefox or Safari.

## Notes on specific fields

**Happenings disappear on their own.** The page only lists events dated today or
later, so there's no need to delete old ones — keep them as a record. Because
the site is statically built, `.github/workflows/deploy.yml` runs a nightly
build so an event that passed yesterday is gone without anyone pushing.

**Tapping out a beer.** Switch *Currently on tap* off rather than deleting the
entry — it stays on the page greyed out and marked "Tapped Out", and flipping it
back on is one click when the keg returns.

**Menu ordering.** *Sort order* controls position, lowest first; beers sharing a
number are sorted alphabetically. Leaving everything at `0` keeps the whole list
alphabetical.

## DNS

The domain's nameservers are delegated to **Cloudflare**
(`dahlia.ns.cloudflare.com`, `hugh.ns.cloudflare.com`), so records must be
created in the Cloudflare dashboard for the `beerbusstop.com` zone. Records
entered at the registrar are ignored while that delegation is in place.

| Type  | Name | Value                                                            |
| ----- | ---- | ---------------------------------------------------------------- |
| A     | `@`  | `185.199.108.153`                                                  |
| A     | `@`  | `185.199.109.153`                                                  |
| A     | `@`  | `185.199.110.153`                                                  |
| A     | `@`  | `185.199.111.153`                                                  |
| CNAME | `www`| `drewpager.github.io`                                              |

Set both `@` and `www` to **DNS only** (grey cloud), not proxied. With the
Cloudflare proxy on, Cloudflare terminates TLS itself and GitHub can't complete
the certificate challenge — "Enforce HTTPS" stays greyed out. The proxy can be
switched on later, once GitHub has issued the certificate.

Then in the repo's *Settings → Pages*, set the custom domain to
`www.beerbusstop.com` and enable **Enforce HTTPS** once the cert provisions.

Leave the `4r23mwv3pi7r` CNAME alone — it's a Google domain-verification record.
There are no MX records, so `@beerbusstop.com` email won't work until some are
added; the site's contact address is a Gmail account.
