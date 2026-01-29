import React, { useState, useEffect } from 'react';
import { Box, Inspiration } from '../types';
import { THEME_COLORS } from '../constants';
import { X, Plus, Trash2, Sparkles, Loader2, Palette } from 'lucide-react';
import { generateAIInspirations } from '../services/geminiService';

// Simple ID generator to avoid external dependency for just this
const generateId = () => Math.random().toString(36).substr(2, 9);

interface BoxEditorProps {
  initialBox?: Box;
  isOpen: boolean;
  onClose: () => void;
  onSave: (box: Box) => void;
}

const BoxEditor: React.FC<BoxEditorProps> = ({ initialBox, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [themeColor, setThemeColor] = useState(THEME_COLORS[0]);
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [newInspirationText, setNewInspirationText] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Sync state with initialBox whenever isOpen changes or initialBox changes
  useEffect(() => {
    if (isOpen) {
      setTitle(initialBox?.title || '');
      setDescription(initialBox?.description || '');
      setThemeColor(initialBox?.themeColor || THEME_COLORS[0]);
      setInspirations(initialBox?.inspirations || []);
      setNewInspirationText('');
      setAiError(null);
    }
  }, [isOpen, initialBox]);

  if (!isOpen) return null;

  const handleAddInspiration = () => {
    if (!newInspirationText.trim()) return;
    const newCard: Inspiration = {
      id: generateId(),
      content: newInspirationText.trim(),
      createdAt: Date.now()
    };
    setInspirations([...inspirations, newCard]);
    setNewInspirationText('');
  };

  const handleRemoveInspiration = (id: string) => {
    setInspirations(inspirations.filter(i => i.id !== id));
  };

  const handleSave = () => {
    if (!title.trim()) return;
    
    const boxToSave: Box = {
      id: initialBox?.id || generateId(),
      title,
      description,
      themeColor,
      icon: 'Package', // Default icon
      inspirations
    };
    
    onSave(boxToSave);
    onClose();
  };

  const handleAIGenerate = async () => {
    if (!title.trim()) {
      setAiError('請先輸入卡片盒標題以便 AI 理解主題');
      return;
    }

    setIsGenerating(true);
    setAiError(null);

    try {
      const generatedTexts = await generateAIInspirations(title, description, 5);
      
      const newCards = generatedTexts.map(text => ({
        id: generateId(),
        content: text,
        createdAt: Date.now()
      }));

      setInspirations(prev => [...prev, ...newCards]);
    } catch (err) {
      setAiError('AI 生成失敗，請檢查網路或 API Key');
    } finally {
      setIsGenerating(false);
    }
  };

  // Check if current themeColor is a hex code (simple check)
  const isCustomColor = themeColor.startsWith('#');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            {initialBox ? '編輯卡片盒' : '建立新卡片盒'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">標題</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如：每日寫作靈感"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">描述 (選填)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="這個盒子是用來做什麼的？"
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">主題顏色</label>
                <div className="flex gap-3 flex-wrap items-center">
                  {/* Presets */}
                  {THEME_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setThemeColor(color)}
                      className={`w-10 h-10 rounded-full ${color} transition-all hover:scale-110 shadow-sm ${themeColor === color ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : ''}`}
                    />
                  ))}
                  
                  {/* Divider */}
                  <div className="w-px h-8 bg-slate-200 mx-1"></div>

                  {/* Custom Color Picker */}
                  <div className="relative group">
                    <div className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center border-2 transition-all ${isCustomColor ? 'ring-2 ring-offset-2 ring-slate-800 border-transparent' : 'border-slate-200 bg-white'}`}>
                      {isCustomColor ? (
                        <div className="w-full h-full" style={{ backgroundColor: themeColor }} />
                      ) : (
                        <Palette size={18} className="text-slate-400" />
                      )}
                      <input
                        type="color"
                        value={isCustomColor ? themeColor : '#000000'}
                        onChange={(e) => setThemeColor(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        title="自訂顏色"
                      />
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">自訂</span>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Inspirations Management */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-medium text-slate-700">靈感卡片 ({inspirations.length})</label>
                
                {/* AI Button */}
                <button
                  onClick={handleAIGenerate}
                  disabled={isGenerating}
                  className="flex items-center text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors"
                >
                  {isGenerating ? (
                    <Loader2 size={14} className="mr-1.5 animate-spin" />
                  ) : (
                    <Sparkles size={14} className="mr-1.5" />
                  )}
                  {isGenerating ? '正在發想...' : 'AI 幫我產生'}
                </button>
              </div>

              {aiError && (
                <div className="mb-3 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                  {aiError}
                </div>
              )}

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newInspirationText}
                  onChange={(e) => setNewInspirationText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddInspiration()}
                  placeholder="輸入靈感內容..."
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  onClick={handleAddInspiration}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {inspirations.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    還沒有卡片，手動新增或使用 AI 生成
                  </div>
                ) : (
                  inspirations.map((card) => (
                    <div key={card.id} className="group flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors">
                      <span className="text-slate-700 text-sm">{card.content}</span>
                      <button
                        onClick={() => handleRemoveInspiration(card.id)}
                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-slate-600 hover:bg-slate-200 font-medium transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            儲存變更
          </button>
        </div>

      </div>
    </div>
  );
};

export default BoxEditor;