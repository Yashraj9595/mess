#!/bin/bash

echo "🚀 Setting up Mess App Backend Authentication System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created from template"
    echo "⚠️  Please edit .env file with your configuration"
else
    echo "✅ .env file already exists"
fi

# Create logs directory
mkdir -p logs

echo ""
echo "🎉 Backend setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Set up MongoDB (local or cloud)"
echo "3. Configure email settings (Gmail recommended)"
echo "4. Start the server: npm run dev"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "🔧 Configuration checklist:"
echo "   □ MongoDB URI"
echo "   □ JWT Secret"
echo "   □ Email settings (Gmail)"
echo "   □ Frontend URL for CORS"
echo ""
echo "🧪 To test the API:"
echo "   npm test"
echo ""
echo "🚀 To start development server:"
echo "   npm run dev" 