#!/usr/bin/env python3
"""
Simple Flask server for the admin panel.
Handles automatic post creation and file management.
"""

from flask import Flask, request, jsonify, send_from_directory
import os
import re
from datetime import datetime
import subprocess
import json

app = Flask(__name__)

def create_post_from_data(title, content, excerpt=""):
    """Create a new blog post using the existing create_post.py script"""
    
    # Generate filename
    filename = title.lower()
    filename = re.sub(r'[^a-z0-9\s]', '', filename)
    filename = re.sub(r'\s+', '-', filename)
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
    
    # Format content properly
    formatted_content = format_content_for_html(content)
    post_content = post_content.replace('Your first paragraph goes here. Just write your content naturally.', formatted_content)
    
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
    
    # Update index.html
    update_index_with_new_post(title, filename, current_date, excerpt)
    
    return filename, current_date

def format_content_for_html(content):
    """Convert markdown-like content to HTML"""
    # Convert markdown-style formatting to HTML
    html_content = content
    
    # Bold text
    html_content = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html_content)
    
    # Italic text
    html_content = re.sub(r'\*(.*?)\*', r'<em>\1</em>', html_content)
    
    # Headings
    html_content = re.sub(r'^## (.*$)', r'<h2>\1</h2>', html_content, flags=re.MULTILINE)
    html_content = re.sub(r'^### (.*$)', r'<h3>\1</h3>', html_content, flags=re.MULTILINE)
    
    # Quotes
    html_content = re.sub(r'^> (.*$)', r'<blockquote><p>\1</p></blockquote>', html_content, flags=re.MULTILINE)
    
    # Lists
    html_content = re.sub(r'^- (.*$)', r'<li>\1</li>', html_content, flags=re.MULTILINE)
    
    # Links
    html_content = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', html_content)
    
    # Convert paragraphs
    paragraphs = html_content.split('\n')
    formatted_paragraphs = []
    
    for paragraph in paragraphs:
        paragraph = paragraph.strip()
        if paragraph and not paragraph.startswith('<'):
            formatted_paragraphs.append(f'<p>{paragraph}</p>')
        elif paragraph:
            formatted_paragraphs.append(paragraph)
    
    return '\n\n'.join(formatted_paragraphs)

def update_index_with_new_post(title, filename, date, excerpt=""):
    """Update the index.html file with the new post"""
    
    # Read current index.html
    with open('index.html', 'r') as f:
        index_content = f.read()
    
    # Create new post HTML
    new_post_html = f'''      <article class="writing-item">
        <a href="thoughts/{filename}" class="writing-link">
          <h2 class="writing-title">{title}</h2>
          <p class="writing-excerpt">{excerpt or 'A new thought to share.'}</p>
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

@app.route('/create_post', methods=['POST'])
def create_post():
    """Handle post creation requests from the admin panel"""
    try:
        data = request.get_json()
        
        title = data.get('title', '').strip()
        content = data.get('content', '').strip()
        excerpt = data.get('excerpt', '').strip()
        
        if not title or not content:
            return jsonify({'error': 'Title and content are required'}), 400
        
        # Create the post
        filename, date = create_post_from_data(title, content, excerpt)
        
        return jsonify({
            'success': True,
            'filename': filename,
            'date': date,
            'message': 'Post created successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/')
def serve_index():
    """Serve the main index page"""
    return send_from_directory('.', 'index.html')

@app.route('/admin')
def serve_admin():
    """Serve the admin panel"""
    return send_from_directory('.', 'admin.html')

@app.route('/thoughts/<path:filename>')
def serve_thought(filename):
    """Serve individual thought pages"""
    return send_from_directory('thoughts', filename)

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    """Serve static assets"""
    return send_from_directory('assets', filename)

@app.route('/about.html')
def serve_about():
    """Serve the about page"""
    return send_from_directory('.', 'about.html')

@app.route('/writings.html')
def serve_writings():
    """Serve the writings page"""
    return send_from_directory('.', 'writings.html')

if __name__ == '__main__':
    print("🚀 Starting admin server...")
    print("📝 Admin panel: http://localhost:5000/admin")
    print("🏠 Website: http://localhost:5000")
    print("💡 Press Ctrl+C to stop the server")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
