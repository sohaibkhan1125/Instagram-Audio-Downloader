import React, { useState, useEffect } from 'react';
import { fetchHeroSectionData, subscribeToHeroSection } from '../utils/supabaseService';

const DownloaderTool = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showClearIcon, setShowClearIcon] = useState(false);

  // Hero section data state
  const [heroData, setHeroData] = useState({
    title: 'Download Instagram Audio Instantly',
    subtitle: 'Paste your link and get high-quality audio in seconds.',
    buttonText: 'Download Now'
  });

  // Listen for hero section updates from Supabase
  useEffect(() => {
    let unsubscribe = null;

    const init = async () => {
      const data = await fetchHeroSectionData();
      if (data) {
        setHeroData(data);
      }

      unsubscribe = subscribeToHeroSection((newData) => {
        if (newData) {
          setHeroData(newData);
        }
      });
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleDownload = async () => {
    if (!url.trim()) {
      setError('Please enter an Instagram URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    // Smooth scroll to result section
    setTimeout(() => {
      const resultSection = document.getElementById('result-section');
      if (resultSection) {
        resultSection.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);

    try {
      // Validate Instagram URL format
      if (!url.includes('instagram.com')) {
        throw new Error('Please enter a valid Instagram URL');
      }

      // Clean the URL (remove tracking parameters)
      const cleanUrl = url.split('?')[0];

      // Encode the URL for the API
      const encodedUrl = encodeURIComponent(cleanUrl);

      // Use the new API endpoint
      const apiUrl = `https://all-in-one-video-downloader1.p.rapidapi.com/download?url=${encodedUrl}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '90f18d95c0msh12900f8ecdc4a4bp1d499ejsn6903806411b3',
          'x-rapidapi-host': 'all-in-one-video-downloader1.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audio data');
      }

      const data = await response.json();

      // Debug: Log the response to understand the structure
      console.log('API Response:', data);

      // Check if we have valid data structure
      if (data && data.title && data.audios && data.audios.length > 0) {
        // Find the audio-only format (M4A)
        const audioOnly = data.audios.find(audio => audio.resolution === 'audio only');

        if (audioOnly) {
          // Create result object with only audio data
          const resultData = {
            title: data.title,
            uploader: data.uploader,
            thumbnail: data.thumbnail,
            duration: data.duration,
            audioUrl: audioOnly.url,
            audioFormat: audioOnly.ext
          };
          setResult(resultData);
        } else {
          throw new Error('No audio-only format found in the response');
        }
      } else {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch audio. Please check the URL and try again.';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async () => {
    if (result && result.audioUrl) {
      setDownloading(true);
      setDownloadProgress(0);
      const downloadUrl = result.audioUrl;
      // Sanitize filename to remove invalid characters
      const sanitizedTitle = (result.title || 'audio').replace(/[<>:"/\\|?*]/g, '').trim();
      const fileName = `${sanitizedTitle || 'audio'}.${result.audioFormat || 'm4a'}`;

      try {
        console.log('Starting download:', fileName, 'from:', downloadUrl);

        // Fetch the audio file as a blob with progress tracking
        const response = await fetch(downloadUrl, {
          method: 'GET',
          headers: {
            'Accept': 'audio/*',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentLength = response.headers.get('content-length');
        const total = parseInt(contentLength, 10);
        let loaded = 0;

        // Create a new response with progress tracking
        const reader = response.body.getReader();
        const chunks = [];

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          chunks.push(value);
          loaded += value.length;

          // Update progress
          if (total) {
            const progress = Math.round((loaded / total) * 100);
            setDownloadProgress(progress);
          } else {
            // If we don't know the total size, show indeterminate progress
            setDownloadProgress(prev => Math.min(prev + 10, 90));
          }
        }

        // Create blob from chunks
        const blob = new Blob(chunks);
        setDownloadProgress(100);

        // Create a blob URL
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a temporary anchor element for download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.style.display = 'none';

        // Add to DOM, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the blob URL after a short delay
        setTimeout(() => {
          window.URL.revokeObjectURL(blobUrl);
        }, 1000);

        console.log('Download completed:', fileName);

        // Show success message
        setTimeout(() => {
          setDownloading(false);
          setDownloadProgress(0);
        }, 1000);

      } catch (error) {
        console.error('Download failed:', error);
        setDownloading(false);
        setDownloadProgress(0);

        // Fallback: Try the old method if the new one fails
        try {
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = fileName;
          link.style.display = 'none';

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setTimeout(() => {
            setDownloading(false);
            setDownloadProgress(0);
          }, 1000);
        } catch (fallbackError) {
          console.error('Fallback download also failed:', fallbackError);
          setError('Download failed. Please try right-clicking the audio player and selecting "Save audio as..."');
        }
      }
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        setUrl(text.trim());
        setShowClearIcon(true);
        // Clear any existing results when pasting new URL
        if (result || error) {
          clearResults();
        }
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      // Fallback for older browsers or when clipboard API is not available
      setError('Unable to access clipboard. Please paste manually.');
    }
  };

  const handleClear = () => {
    setUrl('');
    setShowClearIcon(false);
    clearResults();
  };

  const clearResults = () => {
    setResult(null);
    setError('');
    setUrl('');
    setDownloadProgress(0);
    setShowClearIcon(false);
  };

  return (
    <section id="home" className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {heroData.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {heroData.subtitle}
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> This tool extracts only the audio (M4A format) from Instagram content.
              No video files are downloaded. Audio files will download directly to your device when you click the download button.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            {/* URL Input */}
            <div>
              <label htmlFor="instagram-url" className="block text-sm font-medium text-gray-700 mb-2">
                Instagram URL
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="url"
                    id="instagram-url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setShowClearIcon(e.target.value.length > 0);
                      if (result || error) {
                        clearResults();
                      }
                    }}
                    placeholder="Paste your Instagram post or reel URL here..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                  {/* Paste/Clear Icon */}
                  <button
                    type="button"
                    onClick={showClearIcon ? handleClear : handlePaste}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                    title={showClearIcon ? "Clear URL" : "Paste from clipboard"}
                  >
                    {showClearIcon ? (
                      // Clear Icon (X)
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      // Paste Icon
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
                <button
                  onClick={handleDownload}
                  disabled={loading}
                  className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    heroData.buttonText || 'Download Audio'
                  )}
                </button>
              </div>
            </div>


            {/* Result Display */}
            <div id="result-section">
              {/* Loading Skeleton */}
              {loading && (
                <div className="bg-gray-50 rounded-lg p-6 animate-pulse">
                  <div className="flex flex-col sm:flex-row gap-6 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-300 rounded-xl"></div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  </div>
                  <div className="bg-gray-200 rounded-xl p-6">
                    <div className="h-12 bg-gray-300 rounded-lg mb-4"></div>
                    <div className="h-12 bg-gray-300 rounded-lg"></div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-700 font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Success Result */}
              {(result && !loading) && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Audio Found!
                    </h3>
                    <button
                      onClick={clearResults}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>


                  {/* Thumbnail and Title Section */}
                  <div className="flex flex-col sm:flex-row gap-6 mb-6">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      {result.thumbnail && (
                        <img
                          src={result.thumbnail}
                          alt={result.title || 'Audio thumbnail'}
                          className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl shadow-lg border-2 border-gray-100"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                    </div>

                    {/* Audio Info */}
                    <div className="flex-1 space-y-3">
                      <h4 className="text-2xl font-bold text-gray-900">{result.title || 'Audio Track'}</h4>
                      {result.uploader && (
                        <p className="text-lg text-gray-600 flex items-center gap-2">
                          <svg className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {result.uploader}
                        </p>
                      )}
                      {result.duration && (
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Duration: {Math.round(result.duration)}s
                        </p>
                      )}
                      {result.audioFormat && (
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Format: {result.audioFormat.toUpperCase()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Audio Player and Download Section */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
                    {result.audioUrl ? (
                      <>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                            <svg className="h-4 w-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                            Preview Audio ({result.audioFormat?.toUpperCase() || 'M4A'})
                          </label>
                          <audio
                            controls
                            preload="auto"
                            className="w-full h-12 rounded-lg shadow-sm border border-gray-200"
                            src={result.audioUrl}
                            onLoadStart={() => console.log('Audio loading started')}
                            onCanPlay={() => console.log('Audio ready to play')}
                            onError={(e) => {
                              console.error('Audio loading error:', e);
                            }}
                            style={{
                              background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%)',
                              border: '1px solid #d1d5db'
                            }}
                          >
                            Your browser does not support the audio element.
                          </audio>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span className="flex items-center gap-2">
                              <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              High Quality {result.audioFormat?.toUpperCase() || 'M4A'}
                            </span>
                            <span className="text-gray-500">
                              {downloading ? (downloadProgress < 100 ? `Downloading... ${downloadProgress}%` : 'Preparing download...') : 'Ready to Download'}
                            </span>
                          </div>

                          <div className="space-y-3">
                            {/* Progress Bar */}
                            {downloading && (
                              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300 ease-out"
                                  style={{ width: `${downloadProgress}%` }}
                                ></div>
                              </div>
                            )}

                            {/* Progress Text */}
                            {downloading && (
                              <div className="text-center">
                                <p className="text-sm text-gray-600">
                                  {downloadProgress < 100 ? `Downloading... ${downloadProgress}%` : 'Preparing download...'}
                                </p>
                              </div>
                            )}

                            <button
                              onClick={handleDownloadFile}
                              disabled={downloading}
                              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                              {downloading ? (
                                <>
                                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  {downloadProgress < 100 ? 'Downloading...' : 'Preparing Audio...'}
                                </>
                              ) : (
                                <>
                                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  Download Audio
                                </>
                              )}
                            </button>

                            {/* Alternative download methods */}
                            <div className="text-center space-y-2">
                              <p className="text-xs text-gray-500">If download button doesn't work:</p>
                              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                <span className="text-xs text-gray-500">Right-click audio player → "Save audio as..."</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6 bg-yellow-50 rounded-lg">
                        <svg className="h-12 w-12 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <h4 className="font-semibold text-yellow-800 mb-2">Audio URL Not Found</h4>
                        <p className="text-yellow-700 text-sm">
                          The API response doesn't contain a downloadable audio URL.
                          This might be due to the content type or API limitations.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloaderTool;
