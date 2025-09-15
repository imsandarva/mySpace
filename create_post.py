#!/usr/bin/env python3
"""
Simple blog post creator for Sandarva's personal website.
This script creates new blog posts and updates the index page automatically.
"""

import os
import re
from datetime import datetime
import argparse

def create_post(title, content, filename=None):
    """Create a new blog post"""
    
    # Generate filename if not provided
    if not filename:
        filename = title.lower().replace(' ', '-').replace('?', '').replace('!', '').replace(',', '')
        filename = re.sub(r'[^a-z0-9-]', '', filename)
        filename += '.html'
    
    # Ensure filename ends with .html
    if not filename.endswith('.html'):
        filename += '.html'
    
    # Get current date
    current_date = datetime.now().strftime("%d %B, %Y")
    
    # Read the template
    template_path = 'thoughts/_template.html'
    with open(template_path, 'r') as f:
        template = f.read()
    
    # Replace placeholders
    post_content = template.replace('Your Title Here', title)
    post_content = post_content.replace('Month Year', current_date)
    post_content = post_content.replace('Your first paragraph goes here. Just write your content naturally.', content)
    
    # Remove template instructions
    post_content = re.sub(r'<p>Each paragraph.*?</p>', '', post_content, flags=re.DOTALL)
    post_content = re.sub(r'<h2>Section Headings</h2>.*?</p>', '', post_content, flags=re.DOTALL)
    post_content = re.sub(r'<h3>Subsection Headings</h3>.*?</p>', '', post_content, flags=re.DOTALL)
    post_content = re.sub(r'<blockquote>.*?</blockquote>', '', post_content, flags=re.DOTALL)
    post_content = re.sub(r'<p>To add an image.*?</p>', '', post_content, flags=re.DOTALL)
    post_content = re.sub(r'<p>Everything will be styled.*?</p>', '', post_content, flags=re.DOTALL)
    
    # Write the new post
    post_path = f'thoughts/{filename}'
    with open(post_path, 'w') as f:
        f.write(post_content)
    
    print(f"✅ Created new post: {post_path}")
    return filename, current_date

def update_index(title, filename, date, excerpt=""):
    """Update the index.html file with the new post"""
    
    # Read current index.html
    with open('index.html', 'r') as f:
        index_content = f.read()
    
    # Create new post HTML
    new_post_html = f'''      <article class="writing-item">
        <a href="thoughts/{filename}" class="writing-link">
          <h2 class="writing-title">{title}</h2>
          <p class="writing-excerpt">{excerpt}</p>
          <div class="writing-meta">
            <span class="date">{date}</span>
            <span class="read-time">3 min read</span>
          </div>
        </a>
      </article>

'''
    
    # Find the writings-list section and add the new post at the beginning
    writings_start = index_content.find('<div class="writings-list">')
    if writings_start != -1:
        # Find the first article tag
        first_article = index_content.find('<article class="writing-item">', writings_start)
        if first_article != -1:
            # Insert the new post before the first existing post
            updated_content = index_content[:first_article] + new_post_html + index_content[first_article:]
            
            # Write updated index.html
            with open('index.html', 'w') as f:
                f.write(updated_content)
            
            print("✅ Updated index.html with new post")
        else:
            print("❌ Could not find articles section in index.html")
    else:
        print("❌ Could not find writings-list section in index.html")

def main():
    parser = argparse.ArgumentParser(description='Create a new blog post')
    parser.add_argument('title', help='Title of the blog post')
    parser.add_argument('content', help='Content of the blog post')
    parser.add_argument('--filename', help='Custom filename (optional)')
    parser.add_argument('--excerpt', help='Short excerpt for the index page')
    
    args = parser.parse_args()
    
    # Create the post
    filename, date = create_post(args.title, args.content, args.filename)
    
    # Update index page
    excerpt = args.excerpt if args.excerpt else "A new thought to share."
    update_index(args.title, filename, date, excerpt)
    
    print(f"\n🎉 Successfully created post: {args.title}")
    print(f"📁 File: thoughts/{filename}")
    print(f"📅 Date: {date}")
    print(f"\n💡 To edit the post, open: thoughts/{filename}")

if __name__ == "__main__":
    main()
