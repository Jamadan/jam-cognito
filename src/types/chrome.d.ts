// Type definitions for Chrome extension API
// This is a simplified version to address linter errors

interface Chrome {
  storage: {
    sync: {
      get: (key: string, callback: (result: any) => void) => void;
      set: (items: object, callback?: () => void) => void;
    };
  };
  
  runtime: {
    onMessage: {
      addListener: (callback: (message: any, sender: any, sendResponse: any) => void) => void;
    };
    sendMessage: (message: any) => void;
    onInstalled: {
      addListener: (callback: () => void) => void;
    };
  };
  
  tabs: {
    create: (properties: any) => void;
    query: (queryInfo: any, callback: (tabs: any[]) => void) => void;
    sendMessage: (tabId: number, message: any) => void;
  };
  
  windows: {
    getAll: (getInfo: any, callback: (windows: any[]) => void) => void;
    create: (createData: any) => void;
  };
  
  contextMenus: {
    create: (properties: any) => void;
    onClicked: {
      addListener: (callback: (info: any, tab?: any) => void) => void;
    };
  };
}

declare const chrome: Chrome; 