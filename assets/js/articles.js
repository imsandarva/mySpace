// Function to parse YAML front matter from Markdown content
function parseFrontMatter(markdownContent) {
    const frontMatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = markdownContent.match(frontMatterRegex);

    if (!match) {
        return { metadata: {}, content: markdownContent };
    }

    const yamlString = match[1];
    const content = markdownContent.substring(match[0].length).trim();

    const metadata = {};
    yamlString.split('\n').forEach(line => {
        const separatorIndex = line.indexOf(':');
        if (separatorIndex > -1) {
            let key = line.substring(0, separatorIndex).trim();
            let value = line.substring(separatorIndex + 1).trim();
            
            // Handle array values (e.g., tags)
            if (value.startsWith('[') && value.endsWith(']')) {
                value = value.substring(1, value.length - 1).split(',').map(item => item.trim());
            }
            // Attempt to parse boolean and numbers
            if (value === 'true') value = true;
            if (value === 'false') value = false;
            if (!isNaN(Number(value)) && !isNaN(parseFloat(value))) value = Number(value);

            metadata[key] = value;
        }
    });

    return { metadata, content };
}

// Function to fetch and render articles on the index page
async function renderArticleSummaries() {
    const writingsList = document.querySelector('.writings-list');
    if (!writingsList) return;

    try {
        const response = await fetch('articles.json');
        const articlesMetadata = await response.json();

        // Sort articles by publishDate in descending order (newest first)
        articlesMetadata.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

        for (const articleMeta of articlesMetadata) {
            const articleItem = document.createElement('li');
            articleItem.className = 'writing-item';
            
            // Construct the link to the article detail page
            const articleLink = document.createElement('a');
            articleLink.href = `article.html?slug=${articleMeta.slug}`; // Link to generic article page
            articleLink.className = 'writing-link';

            // Article Title
            const articleTitle = document.createElement('h2');
            articleTitle.className = 'writing-title';
            articleTitle.textContent = articleMeta.title;

            // Article Excerpt
            const articleExcerpt = document.createElement('p');
            articleExcerpt.className = 'writing-excerpt';
            articleExcerpt.textContent = articleMeta.excerpt;

            // Article Meta (Date)
            const articleMetaDiv = document.createElement('div');
            articleMetaDiv.className = 'writing-meta';
            const dateSpan = document.createElement('span');
            dateSpan.className = 'date';
            dateSpan.textContent = new Date(articleMeta.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            articleMetaDiv.appendChild(dateSpan);
            articleLink.appendChild(articleTitle);
            articleLink.appendChild(articleExcerpt);
            articleLink.appendChild(articleMetaDiv);
            articleItem.appendChild(articleLink);
            writingsList.appendChild(articleItem);
        }
    } catch (error) {
        console.error('Error fetching or rendering articles:', error);
        writingsList.innerHTML = '<p>Failed to load articles. Please try again later.</p>';
    }
}

// Initialize rendering when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', renderArticleSummaries);
