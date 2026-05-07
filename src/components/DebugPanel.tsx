import { useState, useEffect } from 'react';
import { debugLogger, type DebugLog } from '../utils/debugLogger';
import { ChevronDown, ChevronUp, Trash2, Download, Bug } from 'lucide-react';

const LEVEL_STYLES: Record<string, { bg: string; border: string; label: string; dot: string }> = {
  info:    { bg: 'bg-blue-50',   border: 'border-blue-300',  label: 'text-blue-700',  dot: 'bg-blue-400' },
  success: { bg: 'bg-green-50',  border: 'border-green-400', label: 'text-green-700', dot: 'bg-green-500' },
  warning: { bg: 'bg-yellow-50', border: 'border-yellow-400',label: 'text-yellow-700',dot: 'bg-yellow-400' },
  error:   { bg: 'bg-red-50',    border: 'border-red-400',   label: 'text-red-700',   dot: 'bg-red-500' },
};

function LogEntry({ log, idx, expanded, onToggle }: { log: DebugLog; idx: number; expanded: boolean; onToggle: () => void }) {
  const level = LEVEL_STYLES[log.level] ?? LEVEL_STYLES.info;
  const time = new Date(log.timestamp).toLocaleTimeString();

  return (
    <div className={`border-2 ${level.border} ${level.bg}`}>
      <button
        onClick={onToggle}
        className="w-full text-left px-2 py-1.5 flex items-center gap-2 hover:brightness-95"
      >
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${level.dot}`} />
        <span className={`font-bold flex-shrink-0 ${level.label}`}>{log.action}</span>
        <span className="text-gray-500 flex-shrink-0 text-[10px]">{time}</span>
        {log.error && <span className="text-red-600 truncate text-[10px]">{log.error}</span>}
        <span className="ml-auto flex-shrink-0">{expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}</span>
      </button>

      {expanded && (
        <div className="border-t-2 border-current border-opacity-20 px-2 py-2 space-y-2">
          {log.error && (
            <div className="bg-red-100 border border-red-400 p-2 text-red-800 text-[11px]">
              <strong>Error:</strong> {log.error}
            </div>
          )}
          {log.incomingParams && (
            <div>
              <div className="font-bold text-gray-600 mb-1">Params sent by AI:</div>
              <pre className="bg-white border border-gray-300 p-1.5 overflow-x-auto text-[10px] leading-relaxed whitespace-pre-wrap">
                {JSON.stringify(log.incomingParams, null, 2)}
              </pre>
            </div>
          )}
          {log.filteredProducts && log.filteredProducts.length > 0 && (
            <div>
              <div className="font-bold text-gray-600 mb-1">Products found ({log.filteredProductCount}):</div>
              <div className="bg-white border border-gray-300 p-1.5 space-y-0.5">
                {log.filteredProducts.slice(0, 5).map((p, i) => (
                  <div key={i} className="text-[10px]">• {p.name} (${p.price}) — {p.category}</div>
                ))}
                {(log.filteredProductCount ?? 0) > 5 && (
                  <div className="text-[10px] text-gray-500">+{(log.filteredProductCount ?? 0) - 5} more</div>
                )}
              </div>
            </div>
          )}
          {log.result && (
            <div>
              <div className="font-bold text-gray-600 mb-1">Tool response to AI:</div>
              <pre className="bg-white border border-gray-300 p-1.5 overflow-x-auto text-[10px] leading-relaxed whitespace-pre-wrap">
                {JSON.stringify(log.result, null, 2)}
              </pre>
            </div>
          )}
          {log.responseMessage && !log.result && (
            <div className="bg-blue-50 border border-blue-200 p-1.5 text-[10px]">
              <strong>Message:</strong> {log.responseMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function DebugPanel() {
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(debugLogger.getLogs());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const errorCount = logs.filter(l => l.level === 'error').length;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 font-mono text-xs">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-black text-white font-bold hover:bg-gray-900 border-2 border-black neo-shadow"
      >
        <div className="flex items-center gap-2">
          <Bug size={14} />
          <span>Agent Logs ({logs.length})</span>
          {errorCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 font-bold">{errorCount} error{errorCount > 1 ? 's' : ''}</span>
          )}
        </div>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isOpen && (
        <div className="border-2 border-black border-t-0 bg-white neo-shadow max-h-[480px] flex flex-col">
          {/* Toolbar */}
          <div className="flex gap-2 p-2 border-b-2 border-black bg-gray-50 sticky top-0">
            <button
              onClick={() => debugLogger.downloadLogs()}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-black text-white hover:bg-gray-800"
            >
              <Download size={11} /> Export
            </button>
            <button
              onClick={() => { debugLogger.clearLogs(); setLogs([]); setExpandedIndex(null); }}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-red-500 text-white hover:bg-red-600"
            >
              <Trash2 size={11} /> Clear
            </button>
          </div>

          {/* Log list */}
          <div className="overflow-y-auto flex-1 space-y-1 p-2">
            {logs.length === 0 ? (
              <div className="p-4 text-center text-gray-400">No logs yet. Use the voice agent.</div>
            ) : (
              // Show newest first
              [...logs].reverse().map((log, idx) => (
                <LogEntry
                  key={idx}
                  log={log}
                  idx={idx}
                  expanded={expandedIndex === idx}
                  onToggle={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
