---
title: My First Dynamic Article
publishDate: 2026-01-20
author: Sandarva
excerpt: This is a sample article to demonstrate the dynamic loading and rendering of content using Markdown and JavaScript.
tags: [sample, dynamic, markdown]
---

# Welcome to My First Dynamic Article!

This article is loaded and rendered entirely using client-side JavaScript.

## How it works

1.  **Markdown Files:** Articles are written in Markdown format and stored in the `articles/` directory.
2.  **YAML Front Matter:** Each Markdown file starts with a YAML Front Matter block containing metadata like title, publish date, and excerpt.
3.  **`index.html`:** The main page uses JavaScript to fetch a list of articles and display summaries.
4.  **`article.html` (or similar):** A generic template page loads the full Markdown content of a selected article and renders it using `marked.js`.

### Features

*   **Easy Publishing:** Just create a new Markdown file.
*   **No Backend:** Entirely client-side, hosted on Vercel.
*   **Rich Content:** Use full Markdown features, including:
    *   **Bold** and *italic* text.
    *   [Links](https://www.google.com)
    *   Code blocks:
        ```javascript
        console.log("Hello from marked.js!");
        ```
    *   > Blockquotes
    *   Images (e.g., ![Example Image](https://via.placeholder.com/150))

Enjoy writing!
