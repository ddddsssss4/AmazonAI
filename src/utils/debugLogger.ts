export interface DebugLog {
  timestamp: string;
  action: string;
  incomingParams?: any;
  filteredProductCount?: number;
  filteredProducts?: any[];
  responseMessage?: string;
}

export const debugLogger = {
  getLogs: (): DebugLog[] => {
    try {
      return JSON.parse(localStorage.getItem('voiceFilterDebug') || '[]');
    } catch (e) {
      return [];
    }
  },

  clearLogs: () => {
    localStorage.removeItem('voiceFilterDebug');
  },

  exportLogs: (): string => {
    const logs = debugLogger.getLogs();
    return JSON.stringify(logs, null, 2);
  },

  downloadLogs: () => {
    const logs = debugLogger.exportLogs();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(logs));
    element.setAttribute('download', `voice-filter-debug-${new Date().toISOString()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  },
};
