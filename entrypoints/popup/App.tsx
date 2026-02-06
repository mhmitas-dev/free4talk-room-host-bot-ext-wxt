import { useState, useEffect } from 'react';
import { userConfigStorage } from '../../utils/config-storage';

function App() {
  const [serverUrl, setServerUrl] = useState('');
  const [chatEndpoint, setChatEndpoint] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  // Load the current values from storage when component mounts
  useEffect(() => {
    const loadConfig = async () => {
      const config = await userConfigStorage.getValue();
      if (config) {
        setServerUrl(config.serverUrl);
        setChatEndpoint(config.chatEndpoint);
        setApiKey(config.apiKey);
      }
      setLoading(false);
    };

    loadConfig();
  }, []);

  // Save the configuration to storage
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    await userConfigStorage.setValue({
      serverUrl,
      chatEndpoint,
      apiKey,
    });

    setSaved(true);

    // Hide success message after 2 seconds
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="w-96 p-6 bg-gray-900 min-h-100 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-96 p-6 bg-gray-900 min-h-100">
      <h1 className='text-2xl font-bold text-gray-100 mb-6'>Free4Talk Room Host Bot</h1>

      <h1 className="text-2xl font-semibold text-gray-100 mb-6">Configuration</h1>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Server URL Input */}
        <div>
          <label htmlFor="serverUrl" className="block text-sm font-medium text-gray-300 mb-1">
            Server URL
          </label>
          <input
            type="text"
            id="serverUrl"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
            placeholder="http://127.0.0.1:3000"
          />
        </div>

        {/* Chat Endpoint Input */}
        <div>
          <label htmlFor="chatEndpoint" className="block text-sm font-medium text-gray-300 mb-1">
            Chat Endpoint
          </label>
          <input
            type="text"
            id="chatEndpoint"
            value={chatEndpoint}
            onChange={(e) => setChatEndpoint(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
            placeholder="chat"
          />
        </div>

        {/* API Key Input */}
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-1">
            API Key
          </label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
            placeholder="Enter your API key"
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium shadow-lg"
        >
          Save Configuration
        </button>

        {/* Success Message */}
        {saved && (
          <div className="bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded">
            Configuration saved successfully!
          </div>
        )}
      </form>
      <p>https://free4talk-bot-server-api-mh1124.vercel.app/</p>
      <p>chat-room-host-bot</p>
    </div>
  );
}

export default App;