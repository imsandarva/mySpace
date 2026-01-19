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

// Function to get query parameter from URL
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to load and render the article
async function loadArticle() {
    const articleTitleElement = document.getElementById('article-title');
    const articleDateElement = document.getElementById('article-date');
    const articleContentElement = document.getElementById('article-content');

    const slug = getQueryParam('slug');

    if (!slug) {
        articleTitleElement.textContent = 'Error: Article Not Found';
        articleDateElement.textContent = '';
        articleContentElement.innerHTML = '<p>No article slug provided in the URL.</p>';
        return;
    }

    try {
        const markdownResponse = await fetch(`articles/${slug}.md`);
        if (!markdownResponse.ok) {
            if (markdownResponse.status === 404) {
                 articleTitleElement.textContent = 'Error: Article Not Found';
                 articleDateElement.textContent = '';
                 articleContentElement.innerHTML = `<p>The article "${slug}" could not be found.</p>`;
            } else {
                 articleTitleElement.textContent = 'Error Loading Article';
                 articleDateElement.textContent = '';
                 articleContentElement.innerHTML = `<p>An error occurred while fetching the article: ${markdownResponse.statusText}</p>`;
            }
            return;
        }
        const markdownContent = await markdownResponse.text();

        const { metadata, content } = parseFrontMatter(markdownContent);

        // Update page title
        document.title = `${metadata.title || 'Untitled Article'} - imsandarva`;
        articleTitleElement.textContent = metadata.title || 'Untitled Article';

        if (metadata.publishDate) {
            articleDateElement.textContent = new Date(metadata.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } else {
            articleDateElement.textContent = '';
        }
        
        // Render Markdown to HTML using marked.js
        articleContentElement.innerHTML = marked.parse(content);

    } catch (error) {
        console.error('Error loading article:', error);
        articleTitleElement.textContent = 'Error Loading Article';
        articleDateElement.textContent = '';
        articleContentElement.innerHTML = '<p>An unexpected error occurred while loading the article.</p>';
    }
}

// Initialize article loading when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadArticle);
