---
name: review-blog-post
description: Review an OnlyRSS blog post (posts/*.html) for spelling, grammar, factual errors, em/en-dash usage, ellipsis and smart-quote typography, heading hierarchy, duplicate words, and broken internal links. Use whenever the user asks to "review the blog post", "review this post/article", or similar, in this repo.
tools: Read, Glob, Grep, Edit
---

# Review Blog Post

Review a post under `posts/*.html` against this repo's writing conventions.

## 1. Identify the target file

- If the user names a post, or a `posts/*.html` file is open/selected, use that.
- Otherwise, ask which post to review (or list recently modified files in `posts/` as candidates).

## 2. Scope the review to body content

Each post follows the structure in `posts/0-template.html`: an `<article>` element containing the actual post content (`<header>`, `<section>` blocks, etc.).

- **Review**: visible text inside `<article>...</article>` — headings, paragraphs, list items, captions, blockquotes, table cells.
- **Ignore**: everything in `<head>` (meta tags, JSON-LD, title tags), `<script>` blocks, HTML comments, HTML attributes (`href`, `alt`, `style`, etc.), and code/`<pre>`/`<code>` samples. Straight quotes and hyphens are expected and correct in those places.

## 3. Checks to perform

Read through the article content and flag every instance of:

1. **Spelling errors.**
2. **Grammar errors** — subject/verb agreement, tense consistency, punctuation, run-ons, dangling modifiers, etc.
3. **Factual errors** — claims that are wrong, internally inconsistent (e.g. a number stated one way then contradicted later), or that don't match reality as far as you can tell. Flag anything you're not confident about rather than silently accepting it.
4. **Em dash spacing** — em dashes (`—`) must NOT have spaces on either side: `done—no exceptions` is correct, `done — no exceptions` or `done -- no exceptions` is wrong. Flag any em dash with a preceding or trailing space, and any double-hyphen (`--`) used where an em dash belongs.
5. **En dashes for ranges** — number, date, or page ranges should use an en dash (`–`), not a hyphen: `2020–2023`, `pages 10–12`, not `2020-2023`. Flag hyphens used this way.
6. **Ellipsis character** — a proper ellipsis (`…`) should be used instead of three periods (`...`). Flag any `...` in body text.
7. **Smart/typographic punctuation** — in body content, straight quotes/apostrophes should be curly:
   - `'` → `‘`/`’` (opening/closing single quote or apostrophe)
   - `"` → `“`/`”` (opening/closing double quote)
   - Flag any straight `'` or `"` found in the visible article text, and flag inconsistency if some quotes in the post are already curly and others aren't.
8. **Heading hierarchy** — heading levels inside `<article>` shouldn't skip a level (e.g. an `<h2>` followed directly by an `<h4>` with no `<h3>`).
9. **Duplicate words** — accidental repeated words (e.g. "the the", "is is").
10. **Broken internal links** — for every `href` inside `<article>` that points to a relative path (e.g. `../posts/...`, `../pages/...`), verify the target file actually exists in the repo via Glob. Flag any that don't resolve. Skip external (`http(s)://`) links and anchors (`#...`).

## 4. Report findings

Present findings grouped by category, each with the offending snippet and its location (nearby heading or a short quote of surrounding text — line numbers if easy to pin down). For factual errors, briefly explain why the claim looks wrong or unverifiable.

Do not edit the file yet. After presenting the report, ask the user whether to apply fixes; if they agree, make the corrections with Edit, keeping every other aspect of the post unchanged.
