import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Checkbox, 
  FormGroup, 
  FormControlLabel, 
  Typography, 
  Button, 
  Container, 
  Paper 
} from '@mui/material';
import styled from 'styled-components';

interface ShortcutConfig {
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean; // Command key on Mac
}

interface ChromeStorageResult {
  shortcutConfig?: ShortcutConfig;
}

const StyledContainer = styled(Container)`
  padding: 16px;
  min-width: 300px;
`;

const StyledPaper = styled(Paper)`
  padding: 16px;
`;

const Title = styled(Typography)`
  margin-bottom: 16px;
`;

const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

const Popup: React.FC = () => {
  const [config, setConfig] = useState<ShortcutConfig>({
    ctrl: false,
    alt: false,
    shift: true,
    meta: true // Command key on Mac
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load configuration from storage on initial load
  useEffect(() => {
    // Safely access chrome API
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get('shortcutConfig', (result: ChromeStorageResult) => {
        if (result.shortcutConfig) {
          setConfig(result.shortcutConfig);
        }
        setIsLoaded(true);
      });
    } else {
      // For development without chrome API
      setIsLoaded(true);
    }
  }, []);

  // Handle checkbox changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setConfig({
      ...config,
      [name]: checked
    });
  };

  // Save configuration
  const saveConfig = () => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({ shortcutConfig: config }, () => {
        // Send message to content script to update configuration
        if (chrome.tabs) {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
              chrome.tabs.sendMessage(tabs[0].id, { action: 'configUpdated' });
            }
          });
        }
        
        // Show save confirmation
        alert('Shortcut configuration saved!');
      });
    } else {
      // For development without chrome API
      console.log('Configuration saved:', config);
      alert('Shortcut configuration saved! (Development mode)');
    }
  };

  // Get platform-specific names for keys
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const ctrlKeyName = isMac ? 'Control' : 'Ctrl';
  const metaKeyName = isMac ? 'Command' : 'Windows';

  if (!isLoaded) {
    return (
      <StyledContainer>
        <StyledPaper elevation={3}>
          <Typography>Loading configuration...</Typography>
        </StyledPaper>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledPaper elevation={3}>
        <Title variant="h5">Configure Keyboard Shortcut</Title>
        <Typography variant="body1" gutterBottom>
          Select the keys to hold while clicking a link to open it in an incognito tab.
        </Typography>
        
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox 
                checked={config.ctrl} 
                onChange={handleChange} 
                name="ctrl" 
              />
            }
            label={ctrlKeyName}
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={config.alt} 
                onChange={handleChange} 
                name="alt" 
              />
            }
            label="Alt"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={config.shift} 
                onChange={handleChange} 
                name="shift" 
              />
            }
            label="Shift"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={config.meta} 
                onChange={handleChange} 
                name="meta" 
              />
            }
            label={metaKeyName}
          />
        </FormGroup>
        
        <ButtonContainer>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={saveConfig}
          >
            Save Configuration
          </Button>
        </ButtonContainer>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Popup; 