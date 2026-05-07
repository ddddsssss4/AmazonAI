import { useState, useEffect } from 'react';
import { debugLogger, type DebugLog } from '../utils/debugLogger';
import { ChevronDown, ChevronUp, Trash2, Download } from 'lucide-react';

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

  const handleClear = () => {
    debugLogger.clearLogs();
    setLogs([]);
  };

  const handleDownload = () => {
    debugLogger.downloadLogs();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 bg-white border-2 border-black neo-shadow font-mono text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-black text-white font-bold hover:bg-gray-900"
      >
        <span>Debug Panel - Voice Filters ({logs.length})</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className="overflow-y-auto max-h-96 border-t-2 border-black">
          <div className="flex gap-2 p-2 border-b-2 border-black sticky top-0 bg-gray-50">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-black text-white hover:bg-gray-900 border border-black"
            >
              <Download size={12} /> Export
            </button>
            <button
              onClick={handleClear}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-red-500 text-white hover:bg-red-600 border border-red-600"
            >
              <Trash2 size={12} /> Clear
            </button>
          </div>

          {logs.length === 0 ? (
            <div className="p-3 text-gray-500">No logs yet. Try using the voice filter.</div>
          ) : (
            <div className="space-y-2 p-2">
              {logs.map((log, idx) => (
                <div key={idx} className="border-2 border-black p-2 space-y-1">
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                    className="w-full text-left font-bold flex items-center justify-between bg-gray-100 p-1 hover:bg-gray-200"
                  >
                    <span>
                      {log.action} - {log.filteredProductCount ?? '?'} products
                    </span>
                    {expandedIndex === idx ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>

                  {expandedIndex === idx && (
                    <div className="bg-gray-50 p-2 space-y-1 max-h-64 overflow-y-auto border-t-2 border-gray-200">
                      <div>
                        <strong>Time:</strong> {log.timestamp}
                      </div>
                      {log.incomingParams && (
                        <div>
                          <strong>Filters:</strong>
                          <pre className="bg-white p-1 border border-gray-300 mt-1 overflow-x-auto">
                            {JSON.stringify(log.incomingParams, null, 2)}
                          </pre>
                        </div>
                      )}
                      {log.filteredProducts && log.filteredProducts.length > 0 && (
                        <div>
                          <strong>Products Found:</strong>
                          <div className="bg-white p-1 border border-gray-300 mt-1 space-y-1">
                            {log.filteredProducts.slice(0, 3).map((p, i) => (
                              <div key={i} className="text-xs">
                                • {p.name} (${p.price}) - {p.category}
                              </div>
                            ))}
                            {log.filteredProducts.length > 3 && (
                              <div className="text-xs text-gray-500">
                                +{log.filteredProducts.length - 3} more...
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {log.responseMessage && (
                        <div>
                          <strong>AI Response:</strong>
                          <div className="bg-blue-50 p-1 border border-blue-200 mt-1 text-xs">
                            {log.responseMessage}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
