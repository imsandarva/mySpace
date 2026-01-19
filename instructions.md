# How to Publish Articles on Your Static Website

This document outlines the seamless process for adding and managing articles on your static website, leveraging Markdown files and client-side JavaScript.

## 1. Article File Structure

All your articles will reside in the `articles/` directory. Each article should be a separate Markdown file (`.md`). The filename (without the `.md` extension) will serve as the unique identifier and URL slug for your article.

**Example:** `articles/my-first-article.md` will correspond to `yourwebsite.com/article.html?slug=my-first-article`.

## 2. Article File Content Format

Each Markdown file must begin with a YAML Front Matter block, enclosed by `---` lines, followed by the article's content written in standard Markdown.

```markdown
---
title: Your Article Title Here
publishDate: YYYY-MM-DD
author: Your Name (Optional, e.g., Sandarva)
excerpt: A concise summary of your article, displayed on the main page.
tags: [tag1, tag2, tag3] # Optional: A comma-separated list of keywords.
---

# Main Heading of Your Article

This is the body of your article. You can write using standard **Markdown** syntax.

## Subheading

- Use lists for items.
- Like this one.

Here's an *italic* phrase.

You can include [links](https://example.com) to external resources.

And embed images:
![Alt Text for Image](path/to/your/image.jpg)

Code blocks are also supported:
```javascript
function helloWorld() {
  console.log("Hello, Static World!");
}
```

> Blockquotes are great for emphasizing text or quoting sources.

---

Remember to keep your Markdown clean and semantic.
```

### Required Front Matter Fields:

*   `title`: The full title of your article.
*   `publishDate`: The date of publication in `YYYY-MM-DD` format (e.g., `2026-01-19`). This will be used for sorting articles on the main page.
*   `excerpt`: A short, compelling summary of your article. This will appear on the main listing page.

### Optional Front Matter Fields:

*   `author`: Your name or a pseudonym. If omitted, a default will be used (e.g., "Sandarva").
*   `tags`: A comma-separated list of relevant keywords or categories, enclosed in square brackets.

## 3. Writing Markdown Content

After the YAML Front Matter, write your article using standard Markdown syntax. The website's styling (`main.css`) is optimized for readability and a premium feel.

*   **Headings:** Use `#` for main titles (H1), `##` for major sections (H2), `###` for sub-sections (H3), etc.
*   **Paragraphs:** Just type your text.
*   **Text Formatting:**
    *   `**bold**` or `__bold__`
    *   `*italic*` or `_italic_`
    *   `~~strikethrough~~`
*   **Links:** `[Link Text](URL)`
*   **Images:** `![Alt Text](path/to/image.jpg)`
    *   For images, consider placing them in a logical subfolder within `assets/img/` and referencing them from your Markdown, e.g., `../assets/img/my-article-image.jpg` or `assets/img/my-article-image.jpg` (depending on the relative path from the `articles/` directory).
*   **Lists:**
    *   Unordered: `- Item 1`, `* Item 2`, `+ Item 3`
    *   Ordered: `1. First item`, `2. Second item`
*   **Code Blocks:** Enclose code between triple backticks (```) and optionally specify the language for syntax highlighting (e.g., ```javascript).
*   **Blockquotes:** Start a line with `>`.

## 4. How to "Publish" an Article

1.  **Create a new Markdown file** (`.md`) in the `articles/` directory. Ensure the filename is descriptive and URL-friendly (e.g., `my-new-insight.md`).
2.  **Add the YAML Front Matter** at the top of the file, filling in `title`, `publishDate`, `excerpt`, and optionally `author` and `tags`.
3.  **Write your article content** using Markdown.
4.  **Commit and push** your changes to your GitHub repository. Vercel (or your hosting provider) will automatically detect the changes and deploy the updated static website.

The JavaScript will automatically discover and render your new article on the homepage and create a dedicated page for it.

## 5. What Happens Behind the Scenes

*   **Homepage (`index.html`):** A JavaScript script fetches a list of all `.md` files from the `articles/` directory. It parses the YAML Front Matter of each to extract the title, date, and excerpt. These are then dynamically rendered as article cards. Articles are typically sorted by `publishDate` (newest first).
*   **Article Page (`article.html` - or similar):** When you navigate to an article (e.g., via a link from the homepage), a JavaScript script identifies the requested article's filename (slug) from the URL. It then fetches the corresponding `.md` file, parses its entire content, and renders the Markdown into HTML on the page.

This client-side approach provides a simple, fast, and efficient way to manage content on your static site without requiring a server-side component.