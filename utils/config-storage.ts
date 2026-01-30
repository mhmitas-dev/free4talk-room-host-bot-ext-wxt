// Define the shape of our configuration
export interface UserConfig {
  serverUrl: string;
  chatEndpoint: string;
  apiKey: string;
}

// Create a storage item with default values
export const userConfigStorage = storage.defineItem<UserConfig>(
  'local:userConfig',
  {
    fallback: {
      serverUrl: 'http://127.0.0.1:3000',
      chatEndpoint: 'chat',
      apiKey: '',
    },
  }
);
