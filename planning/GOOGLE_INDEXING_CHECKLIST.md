# Google Search Console: Manual Indexing Checklist

**Audience:** Product Owner. Everything below is a manual step in Google Search Console (GSC) -- none of it is a code change, and none of it can be done from this repository. It's the follow-up to `planning/SEO_CRAWLING_INDEXING_AUDIT.md`, which covers what was fixed in code (PR #159).

**Canonical domain:** `https://irpgenie.com`

---

## Why iRPGenie isn't showing up in Google search yet

Before doing anything below, it's worth internalizing three things:

1. **Google indexing is not instant.** A brand-new domain typically takes days to a few weeks to get its first pages crawled and indexed, even with no technical issues at all. Seeing nothing yet is not on its own evidence of a bug.
2. **Submitting a sitemap does not guarantee indexing.** It tells Google "these URLs exist and here's how important I think each one is" -- Google still decides independently whether, and when, to crawl and index each one.
3. **Content quality and backlinks matter for ranking**, separately from indexing. A page can be indexed and still rank low if nothing else on the web links to it yet and it's a new, unknown domain. Indexing is the first milestone; ranking is a longer game.

The steps below get iRPGenie in front of Google as fast as is realistically possible; they don't shortcut the waiting.

---

## One-time setup

- [ ] **Create a Google Search Console property for `https://irpgenie.com`.**
  Go to [search.google.com/search-console](https://search.google.com/search-console), add a property. Prefer the **Domain** property type (covers `http`/`https` and `www`/non-`www` variants together) if you can complete DNS verification; otherwise use the **URL prefix** property type for `https://irpgenie.com` specifically.

- [ ] **Verify ownership.**
  Domain properties verify via a DNS TXT record (added at your domain registrar/DNS provider -- not a Vercel or app code change). URL-prefix properties can verify via an HTML file upload, a meta tag, or DNS -- pick whichever is easiest given how DNS/Vercel are managed for this domain.

- [ ] **Submit the sitemap.**
  In GSC, go to **Sitemaps** (left nav) and submit:
  ```
  https://irpgenie.com/sitemap.xml
  ```
  GSC will confirm it can fetch and parse the file, and show a count of discovered URLs shortly after.

---

## Request indexing for key pages

GSC's **URL Inspection** tool (top search bar in GSC, or [search.google.com/search-console/inspect](https://search.google.com/search-console/inspect)) lets you check a specific URL's indexing status and manually request a crawl. Do this for:

- [ ] Homepage -- `https://irpgenie.com/`
- [ ] `https://irpgenie.com/learn`
- [ ] `https://irpgenie.com/deep-dives`
- [ ] `https://irpgenie.com/deep-dives/sql-on-ibm-i`
- [ ] `https://irpgenie.com/contact`

For each: paste the URL into URL Inspection, wait for GSC to report its current status, then click **Request Indexing** if it offers that option. GSC limits how many manual requests you can submit per day -- if you hit that limit, the rest will get picked up on Google's normal crawl schedule anyway once the sitemap is submitted.

---

## Reading the Coverage / Pages report

A few days after submitting the sitemap, check the **Pages** report (left nav, under "Indexing") for what Google has actually done with each URL. The three states you'll most likely see early on:

| Status | What it means | What to do |
|---|---|---|
| **Indexed** | The page is in Google's index and eligible to appear in search results. | Nothing -- this is the goal state. |
| **Crawled - currently not indexed** | Google fetched the page but chose not to index it yet (often just a timing/priority decision for a new site, not necessarily a problem). | Wait. If this persists for many pages after a few weeks, re-check content quality and internal linking. |
| **Discovered - currently not indexed** | Google knows the URL exists (from the sitemap or a link) but hasn't crawled it yet. | Wait, or use URL Inspection to request a crawl for that specific URL if it's high-priority. |

Don't be alarmed by "Crawled" or "Discovered - currently not indexed" on a new domain -- both are normal, temporary states, not equivalent to an error.

---

## Ongoing checks (do these periodically, not just once)

- [ ] Re-check the **Pages** report weekly for the first month, watching the Indexed count grow.
- [ ] Re-check **Sitemaps** to confirm the sitemap is still being read successfully after future deploys (a broken build could in theory serve an empty/invalid sitemap without anyone noticing).
- [ ] Check the **Page indexing** report's "Why pages aren't indexed" breakdown if a large number of pages stay stuck in a non-indexed state for more than a few weeks.
- [ ] After the Deep Dives / lesson catalog grows, re-submit the sitemap if GSC's discovered-URL count looks stale (it usually re-fetches automatically, but a manual re-submit after a big content batch doesn't hurt).

---

## Not covered by this checklist

- Ranking/position tracking for specific search terms -- that's a separate, longer-term SEO activity, not an indexing prerequisite.
- Backlink building -- outside the scope of this technical checklist entirely.
- Bing/other search engines -- Bing Webmaster Tools has an equivalent flow (and can import a GSC-verified site in some cases), but wasn't in scope for this pass.
