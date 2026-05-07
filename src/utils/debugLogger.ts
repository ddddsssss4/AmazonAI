export type LogLevel = 'info' | 'success' | 'error' | 'warning';

export interface DebugLog {
  timestamp: string;
  action: string;
  level: LogLevel;
  incomingParams?: any;
  filteredProductCount?: number;
  filteredProducts?: any[];
  responseMessage?: string;
  error?: string;
  result?: any;
}

const STORAGE_KEY = 'amazonai_debug_logs';

export const debugLogger = {
  getLogs: (): DebugLog[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  },

  log: (entry: Omit<DebugLog, 'timestamp'>) => {
    try {
      const logs = debugLogger.getLogs();
      logs.push({ ...entry, timestamp: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(-100)));
    } catch {
      // localStorage not available
    }
  },

  clearLogs: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  exportLogs: (): string => {
    return JSON.stringify(debugLogger.getLogs(), null, 2);
  },

  downloadLogs: () => {
    const data = debugLogger.exportLogs();
    const el = document.createElement('a');
    el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    el.setAttribute('download', `amazonai-debug-${new Date().toISOString()}.json`);
    el.style.display = 'none';
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  },
};
