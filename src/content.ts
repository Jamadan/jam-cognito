// Log that content script is loaded
console.log('jam-cognito content script loaded');

interface ShortcutConfig {
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean; // Command key on Mac
}

interface ConfigResult {
  shortcutConfig?: ShortcutConfig;
}

interface Message {
  action: string;
  url?: string;
}

// Default configuration
let shortcutConfig: ShortcutConfig = {
  ctrl: false,
  alt: false,
  shift: true,
  meta: true // Command key
};

// Track key states
const keyState = {
  ctrl: false,
  alt: false,
  shift: false,
  meta: false
};

// Load configuration from storage
const loadConfig = (): void => {
  console.log('Loading configuration from storage');
  chrome.storage.sync.get('shortcutConfig', (result: ConfigResult) => {
    if (result.shortcutConfig) {
      console.log('Configuration loaded:', result.shortcutConfig);
      shortcutConfig = result.shortcutConfig;
    } else {
      console.log('No saved configuration found, using defaults');
    }
  });
};

// Check if current key state matches the configured shortcut
const isShortcutActive = (): boolean => {
  const active = (
    keyState.ctrl === shortcutConfig.ctrl &&
    keyState.alt === shortcutConfig.alt &&
    keyState.shift === shortcutConfig.shift &&
    keyState.meta === shortcutConfig.meta
  );
  
  if (active) {
    console.log('Shortcut activated:', keyState);
  }
  
  return active;
};

// Track keydown events
document.addEventListener('keydown', (e: KeyboardEvent) => {
  const prevState = {...keyState};
  
  if (e.key === 'Control') keyState.ctrl = true;
  if (e.key === 'Alt') keyState.alt = true;
  if (e.key === 'Shift') keyState.shift = true;
  if (e.key === 'Meta') keyState.meta = true; // Command key on Mac
  
  // Only log if the state actually changed
  if (prevState.ctrl !== keyState.ctrl || 
      prevState.alt !== keyState.alt || 
      prevState.shift !== keyState.shift || 
      prevState.meta !== keyState.meta) {
    console.log('Key state updated (down):', keyState);
  }
});

// Track keyup events
document.addEventListener('keyup', (e: KeyboardEvent) => {
  const prevState = {...keyState};
  
  if (e.key === 'Control') keyState.ctrl = false;
  if (e.key === 'Alt') keyState.alt = false;
  if (e.key === 'Shift') keyState.shift = false;
  if (e.key === 'Meta') keyState.meta = false; // Command key on Mac
  
  // Only log if the state actually changed
  if (prevState.ctrl !== keyState.ctrl || 
      prevState.alt !== keyState.alt || 
      prevState.shift !== keyState.shift || 
      prevState.meta !== keyState.meta) {
    console.log('Key state updated (up):', keyState);
  }
});

// Handle click events on links
document.addEventListener('click', (e: MouseEvent) => {
  if (!isShortcutActive()) return;

  // Find if we clicked on a link or a child of a link
  let target = e.target as HTMLElement;
  let linkElement: HTMLAnchorElement | null = null;

  while (target && target !== document.body) {
    if (target.tagName.toLowerCase() === 'a') {
      linkElement = target as HTMLAnchorElement;
      break;
    }
    target = target.parentElement as HTMLElement;
  }

  // If we found a link and the shortcut is active
  if (linkElement && isShortcutActive()) {
    e.preventDefault();
    const url = linkElement.href;
    
    console.log('Opening link in incognito:', url);
    
    // Send message to background script to open link in incognito
    chrome.runtime.sendMessage({ action: 'openIncognito', url });
  }
});

// Listen for configuration changes
chrome.runtime.onMessage.addListener((message: Message) => {
  console.log('Content script received message:', message);
  
  if (message.action === 'configUpdated') {
    console.log('Configuration updated, reloading');
    loadConfig();
  }
});

// Initialize
console.log('Initializing content script');
loadConfig(); 