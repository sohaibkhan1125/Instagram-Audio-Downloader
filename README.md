# Instagram Audio Downloader

A professional, responsive Instagram audio downloader built with React and Tailwind CSS. Download high-quality M4A audio files from any Instagram post or reel instantly.

## Features

- 🎵 **High-Quality Audio Extraction** - Get clear M4A audio from any Instagram video
- ⚡ **Fast & Secure Download** - Instant and safe file generation
- 🔓 **No Account Required** - Just paste the link and download
- 📱 **Mobile Friendly** - Works perfectly on phones and desktops
- 💰 **Free to Use** - No hidden fees or subscriptions

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.js          # Navigation component
│   ├── DownloaderTool.js  # Main downloader interface
│   ├── HowToUse.js        # How to use section
│   ├── KeyFeatures.js     # Features showcase
│   ├── FAQ.js             # Frequently asked questions
│   └── Footer.js          # Footer component
├── App.js                 # Main application component
├── App.css              # Custom styles
└── index.js              # Application entry point
```

## API Integration

The application uses the RapidAPI All-in-One Video Downloader API to extract audio from Instagram URLs:

- **Endpoint**: `all-in-one-video-downloader1.p.rapidapi.com`
- **Method**: GET
- **Authentication**: RapidAPI Key
- **Format**: Extracts M4A audio-only files

## Technologies Used

- **React** - Frontend framework
- **Tailwind CSS** - Utility-first CSS framework
- **RapidAPI** - Audio extraction service
- **HTML5 Audio** - Audio playback and download

## Features Overview

### Main Downloader Tool
- URL input field with validation
- Real-time audio preview
- Direct MP3 download
- Error handling and user feedback

### Responsive Design
- Mobile-first approach
- Smooth animations and transitions
- Modern gradient backgrounds
- Professional card layouts

### User Experience
- Intuitive 3-step process
- Clear error messages
- Loading states and feedback
- Accessibility features

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for educational purposes. Please respect Instagram's terms of service and only download content you have permission to use.

## Support

For support or questions, please contact us at support@instaaudio.com