#!/bin/bash

# Simple deployment script for Sandarva's website
# This script helps deploy to various platforms

echo "🚀 Sandarva's Website Deployment Helper"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from the website root directory"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo "📄 Files found:"
ls -la *.html
echo ""

echo "🌐 Choose your deployment method:"
echo "1) GitHub Pages (Free)"
echo "2) Netlify (Free, drag & drop)"
echo "3) Vercel (Free, GitHub integration)"
echo "4) Traditional FTP/SFTP"
echo "5) Local preview"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "📚 GitHub Pages Deployment:"
        echo "1. Create a new repository on GitHub"
        echo "2. Upload all files to the repository"
        echo "3. Go to Settings → Pages"
        echo "4. Select 'Deploy from a branch' → 'main'"
        echo "5. Your site will be at: https://yourusername.github.io/repository-name"
        echo ""
        echo "💡 Pro tip: Use GitHub Desktop or git commands for easier updates"
        ;;
    2)
        echo ""
        echo "🌐 Netlify Deployment:"
        echo "1. Go to https://netlify.com"
        echo "2. Drag and drop this entire folder"
        echo "3. Your site will be live instantly!"
        echo "4. Connect to GitHub for automatic deployments"
        echo ""
        echo "📁 Ready to upload: $(pwd)"
        ;;
    3)
        echo ""
        echo "⚡ Vercel Deployment:"
        echo "1. Go to https://vercel.com"
        echo "2. Import your GitHub repository"
        echo "3. Deploy with zero configuration"
        echo "4. Get automatic HTTPS and global CDN"
        echo ""
        echo "💡 Make sure your code is pushed to GitHub first"
        ;;
    4)
        echo ""
        echo "📤 Traditional Hosting:"
        echo "1. Use FileZilla, WinSCP, or your hosting provider's file manager"
        echo "2. Upload all files to your web directory (usually public_html or www)"
        echo "3. Ensure index.html is in the root directory"
        echo ""
        echo "📁 Files to upload:"
        ls -la
        ;;
    5)
        echo ""
        echo "🖥️  Local Preview:"
        echo "Starting local server..."
        
        # Check if Python is available
        if command -v python3 &> /dev/null; then
            echo "Using Python 3..."
            python3 -m http.server 8000
        elif command -v python &> /dev/null; then
            echo "Using Python 2..."
            python -m SimpleHTTPServer 8000
        elif command -v php &> /dev/null; then
            echo "Using PHP..."
            php -S localhost:8000
        else
            echo "❌ No web server found. Please install Python or PHP"
            echo "Or simply open index.html in your browser"
        fi
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment instructions provided!"
echo "🎉 Your beautiful website is ready to go live!"
echo ""
echo "💡 Need help? Check the README.md file for detailed instructions"
