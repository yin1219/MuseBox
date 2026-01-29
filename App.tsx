import React, { useState, useEffect, useRef } from 'react';
import { Box, ViewMode } from './types';
import { INITIAL_BOXES } from './constants';
import BoxCard from './components/BoxCard';
import CardDrawer from './components/CardDrawer';
import BoxEditor from './components/BoxEditor';
import { Plus, LayoutGrid, Sparkles, Download, Upload, Save, FileJson, RefreshCw, Check, AlertCircle, CheckCircle2 } from 'lucide-react';

// Type definitions for File System Access API
declare global {
  interface Window {
    showSaveFilePicker?: (options?: any) => Promise<any>;
    showOpenFilePicker?: (options?: any) => Promise<any[]>;
  }
}

const App: React.FC = () => {
  // Global State
  const [boxes, setBoxes] = useState<Box[]>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('musebox_data');
    if (saved) {
      try {
        const parsedBoxes: Box[] = JSON.parse(saved);
        
        // Smart Merge
        const existingIds = new Set(parsedBoxes.map(b => b.id));
        const newDefaults = INITIAL_BOXES.filter(b => !existingIds.has(b.id));
        
        if (newDefaults.length > 0) {
          return [...parsedBoxes, ...newDefaults];
        }
        
        return parsedBoxes;
      } catch (error) {
        console.error("Error parsing saved data:", error);
        return INITIAL_BOXES;
      }
    }
    return INITIAL_BOXES;
  });

  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [activeBoxId, setActiveBoxId] = useState<string | null>(null);
  
  // Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBox, setEditingBox] = useState<Box | undefined>(undefined);

  // File Input Ref for Legacy Import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- File System Sync State ---
  const [fileHandle, setFileHandle] = useState<any>(null);
  const [isSyncSupported, setIsSyncSupported] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Persistence (LocalStorage)
  useEffect(() => {
    localStorage.setItem('musebox_data', JSON.stringify(boxes));
  }, [boxes]);

  // Check Sync Support
  useEffect(() => {
    setIsSyncSupported(typeof window.showSaveFilePicker === 'function');
  }, []);

  // Persistence (File System Auto-Sync)
  useEffect(() => {
    if (fileHandle && boxes) {
      setSyncStatus('saving');
      const timer = setTimeout(async () => {
        try {
          // Create a writable stream to the file
          const writable = await fileHandle.createWritable();
          await writable.write(JSON.stringify(boxes, null, 2));
          await writable.close();
          setSyncStatus('saved');
        } catch (err) {
          console.error("Auto-sync failed:", err);
          setSyncStatus('error');
        }
      }, 1000); // Debounce saves by 1 second

      return () => clearTimeout(timer);
    }
  }, [boxes, fileHandle]);


  // Handlers
  const handleCreateBox = () => {
    setEditingBox(undefined);
    setIsEditorOpen(true);
  };

  const handleEditBox = (e: React.MouseEvent, box: Box) => {
    e.stopPropagation();
    setEditingBox(box);
    setIsEditorOpen(true);
  };

  const handleDeleteBox = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('確定要刪除這個卡片盒嗎？')) {
      setBoxes(boxes.filter(b => b.id !== id));
    }
  };

  const handleSaveBox = (box: Box) => {
    if (editingBox) {
      // Update existing
      setBoxes(boxes.map(b => b.id === box.id ? box : b));
    } else {
      // Create new
      setBoxes([...boxes, box]);
    }
  };

  const handleOpenBox = (id: string) => {
    setActiveBoxId(id);
    setViewMode('box_view');
  };

  const handleBackToDashboard = () => {
    setViewMode('dashboard');
    setActiveBoxId(null);
  };

  // --- Export / Import / Sync Logic ---

  const handleExportData = () => {
    const dataStr = JSON.stringify(boxes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().split('T')[0];
    link.download = `musebox-backup-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);

        if (!Array.isArray(parsedData)) throw new Error('格式錯誤');
        
        if (window.confirm(`即將匯入 ${parsedData.length} 個卡片盒。`)) {
          setBoxes(parsedData);
          setFileHandle(null); // Clear file handle on manual import to avoid accidental overwrite
          alert('匯入成功！');
        }
      } catch (error) {
        alert('匯入失敗');
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  // NEW: Handle Sync Connection
  const handleSyncConnect = async () => {
    if (!isSyncSupported) {
      alert("您的瀏覽器不支援本機檔案系統 API，請使用 Chrome 或 Edge。");
      return;
    }

    const choice = window.prompt(
      "【本機檔案同步】\n\n" +
      "1. 建立新同步檔案 (將目前資料存入新檔案)\n" +
      "2. 連結現有檔案 (讀取檔案並取代目前資料)\n\n" +
      "請輸入 1 或 2："
    );

    try {
      if (choice === '1') {
        // Save As... (Create new Sync)
        const handle = await window.showSaveFilePicker!({
          suggestedName: 'musebox-library.json',
          types: [{ description: 'JSON Files', accept: { 'application/json': ['.json'] } }],
        });
        
        // Initial Write
        const writable = await handle.createWritable();
        await writable.write(JSON.stringify(boxes, null, 2));
        await writable.close();
        
        setFileHandle(handle);
        setSyncStatus('saved');
        alert("已建立連結！之後的變更將自動寫入此檔案。");

      } else if (choice === '2') {
        // Open Existing
        const [handle] = await window.showOpenFilePicker!({
          types: [{ description: 'JSON Files', accept: { 'application/json': ['.json'] } }],
          multiple: false,
        });

        const file = await handle.getFile();
        const text = await file.text();
        const data = JSON.parse(text);

        if (Array.isArray(data)) {
          setBoxes(data);
          setFileHandle(handle);
          setSyncStatus('saved');
          alert("已讀取檔案並建立連結！");
        } else {
          alert("檔案格式不符");
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error(err);
        alert("連結失敗：" + err.message);
      }
    }
  };

  // Render Logic
  const activeBox = boxes.find(b => b.id === activeBoxId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      <BoxEditor 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveBox}
        initialBox={editingBox}
      />

      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden" 
      />

      {viewMode === 'box_view' && activeBox ? (
        <CardDrawer box={activeBox} onBack={handleBackToDashboard} />
      ) : (
        /* Dashboard View */
        <div className="max-w-6xl mx-auto px-6 py-12">
          
          {/* Header */}
          <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-12 space-y-6 xl:space-y-0">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                  <Sparkles className="text-white" size={24} />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">MuseBox</h1>
              </div>
              <p className="text-slate-500 text-lg ml-1">靈感卡片盒，為您的創意充電</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Sync Status Indicator / Button */}
              {isSyncSupported && (
                 <button
                   onClick={handleSyncConnect}
                   className={`flex items-center px-4 py-3 border rounded-xl font-medium transition-all shadow-sm ${
                     fileHandle 
                       ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' 
                       : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-indigo-600'
                   }`}
                   title={fileHandle ? "已連結本機檔案 (點擊重新連結)" : "連結本機檔案以自動同步"}
                 >
                   {fileHandle ? (
                      <>
                        {syncStatus === 'saving' ? (
                          <RefreshCw size={20} className="md:mr-2 animate-spin" />
                        ) : syncStatus === 'error' ? (
                          <AlertCircle size={20} className="md:mr-2 text-red-500" />
                        ) : (
                          <Check size={20} className="md:mr-2" />
                        )}
                        <span className="hidden md:inline">
                          {syncStatus === 'saving' ? '儲存中...' : '已同步本機'}
                        </span>
                      </>
                   ) : (
                      <>
                        <FileJson size={20} className="md:mr-2" />
                        <span className="hidden md:inline">啟用同步</span>
                      </>
                   )}
                 </button>
              )}

              <div className="h-8 w-px bg-slate-300 mx-1 hidden md:block"></div>

              <button
                onClick={handleImportClick}
                className="flex items-center px-4 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm"
              >
                <Upload size={20} className="md:mr-2" />
                <span className="hidden md:inline">匯入</span>
              </button>
              
              <button
                onClick={handleExportData}
                className="flex items-center px-4 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm"
              >
                <Download size={20} className="md:mr-2" />
                <span className="hidden md:inline">匯出</span>
              </button>

              <button
                onClick={handleCreateBox}
                className="flex items-center px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold shadow-lg hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <Plus className="mr-2" size={20} />
                建立新盒子
              </button>
            </div>
          </div>

          {/* Sync Warning Banner if Connected */}
          {fileHandle && (
            <div className="mb-8 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center text-green-800 text-sm animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={16} className="mr-2 text-green-600" />
              <span>自動同步已啟用。您的變更將即時寫入本機檔案，無需擔心瀏覽器清除紀錄。</span>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {boxes.map(box => (
              <BoxCard
                key={box.id}
                box={box}
                onClick={() => handleOpenBox(box.id)}
                onEdit={(e) => handleEditBox(e, box)}
                onDelete={(e) => handleDeleteBox(e, box.id)}
              />
            ))}
            
            {/* Empty State / Add Placeholder */}
            {boxes.length === 0 && (
              <div 
                onClick={handleCreateBox}
                className="col-span-full py-20 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all group"
              >
                <div className="p-4 bg-slate-100 rounded-full mb-4 group-hover:bg-white group-hover:shadow-md transition-all">
                  <LayoutGrid size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-1">還沒有卡片盒</h3>
                <p>點擊這裡開始建立您的第一個靈感庫</p>
              </div>
            )}
          </div>
          
          <footer className="mt-20 text-center text-slate-400 text-sm">
            <p>© {new Date().getFullYear()} MuseBox. Powered by Gemini AI.</p>
          </footer>
        </div>
      )}
    </div>
  );
};

export default App;