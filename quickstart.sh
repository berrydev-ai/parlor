#!/bin/bash

# Parlor Quick Start Script
# Run this to get started with Parlor development

set -e

echo "🎭 Parlor - Quick Start"
echo "======================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must be run from the parlor directory"
    echo "   cd /Users/eberry/Code/github.com/berrydev-ai/parlor"
    exit 1
fi

echo "📦 Installing dependencies..."
bun install

echo ""
echo "🔨 Building library..."
bun run build

echo ""
echo "✅ Parlor is ready!"
echo ""
echo "🚀 Try running the examples:"
echo "   bun run example:basic     # All panel types"
echo "   bun run example:streaming # Streaming content"
echo "   bun run example:agent     # Complete agent response"
echo "   bun run example:advanced  # Multi-stage interaction"
echo "   bun run example:openai    # API integration template"
echo ""
echo "📚 Documentation:"
echo "   README.md          # Main documentation"
echo "   GETTING_STARTED.md # Setup guide"
echo "   API.md             # API reference"
echo "   SUMMARY.md         # Implementation summary"
echo ""
echo "Happy coding! 🎉"
