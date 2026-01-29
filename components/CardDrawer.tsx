import React, { useState } from 'react';
import { Box, Inspiration } from '../types';
import { ArrowLeft, RefreshCw, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CardDrawerProps {
  box: Box;
  onBack: () => void;
}

const CardDrawer: React.FC<CardDrawerProps> = ({ box, onBack }) => {
  const [currentCard, setCurrentCard] = useState<Inspiration | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const isCustomColor = box.themeColor.startsWith('#') || box.themeColor.startsWith('rgb');

  const drawCard = () => {
    if (box.inspirations.length === 0 || isDrawing) return;
    
    setIsDrawing(true);
    setCurrentCard(null); // Reset current card to trigger exit animation

    // Simulate animation delay
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * box.inspirations.length);
      setCurrentCard(box.inspirations[randomIndex]);
      setIsDrawing(false);
    }, 600);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the box draw click
    if (currentCard) {
      navigator.clipboard.writeText(currentCard.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden relative">
      {/* Header - Fixed Top */}
      <div className="flex-none p-4 md:p-6 flex items-center justify-between max-w-4xl mx-auto w-full z-50 bg-slate-50/90 backdrop-blur-sm">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-600 hover:text-slate-900 font-medium transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          返回
        </button>
        <h2 className="text-base md:text-xl font-bold text-slate-800 truncate max-w-[50%] text-center">
          {box.title}
        </h2>
        <div className="w-16"></div>
      </div>

      {/* Main Stage - Flex Grow to take available space */}
      <div className="flex-1 relative flex flex-col items-center justify-end pb-8 md:pb-12 w-full max-w-4xl mx-auto perspective-1000">
        
        {/* Animated Card - Absolute Centerish */}
        <AnimatePresence mode='wait'>
          {currentCard && (
            <motion.div
              key={currentCard.id}
              initial={{ y: 200, scale: 0.5, opacity: 0, rotateX: 60 }}
              animate={{ y: 0, scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ y: -50, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="absolute top-4 bottom-32 md:bottom-40 w-[85%] md:w-[400px] left-0 right-0 mx-auto z-50 pointer-events-none" // pointer-events handled by children
            >
              <div 
                className="w-full h-full bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 md:p-8 flex flex-col relative pointer-events-auto cursor-copy"
                onClick={handleCopy}
              >
                 <div className="absolute top-4 right-4 text-slate-300 text-xs font-mono">
                   #{currentCard.id.slice(-4)}
                 </div>
                 
                 {/* Scrollable Content Area */}
                 <div className="flex-1 overflow-y-auto custom-scrollbar flex items-center justify-center text-center my-4">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 leading-normal whitespace-pre-wrap">
                      {currentCard.content}
                    </h3>
                 </div>

                 {/* Card Footer */}
                 <div className="flex-none flex justify-center pt-4 border-t border-slate-50">
                   <button 
                     className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${copied ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                   >
                     {copied ? <Check size={16} className="mr-1" /> : <Copy size={16} className="mr-1" />}
                     {copied ? '已複製' : '點擊複製'}
                   </button>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Box Base - Always at bottom */}
        <div 
          onClick={drawCard}
          className={`
            relative w-[200px] h-[120px] md:w-[260px] md:h-[150px]
            transition-transform duration-300 z-10
            ${box.inspirations.length > 0 && !isDrawing ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default opacity-80'}
          `}
        >
           {/* Front Face */}
           <div 
             className={`absolute bottom-0 w-full h-full rounded-xl shadow-xl flex items-center justify-center overflow-hidden ${!isCustomColor ? box.themeColor : ''}`}
             style={isCustomColor ? { backgroundColor: box.themeColor } : {}}
           >
             {/* Decorative shine */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
             <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/10 rotate-45 transform"></div>
           </div>
           
           {/* Back/Inside illusion */}
           <div className="absolute -top-4 left-2 w-[96%] h-6 bg-slate-300/50 rounded-t-lg -z-10 transform skew-x-6"></div>
        </div>

        {/* Floating Controls below box */}
        <div className="mt-8 z-40">
          <button
            onClick={drawCard}
            disabled={isDrawing || box.inspirations.length === 0}
            className={`
              relative group px-8 py-3 rounded-full text-lg font-bold text-white shadow-lg
              transition-all duration-300 transform active:scale-95 flex items-center
              ${!isCustomColor ? box.themeColor : ''}
              ${(isDrawing || box.inspirations.length === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'}
            `}
            style={isCustomColor ? { backgroundColor: box.themeColor } : {}}
          >
            {isDrawing ? (
              <RefreshCw className="animate-spin mr-2" />
            ) : (
              <RefreshCw className="mr-2 group-hover:rotate-180 transition-transform duration-500" />
            )}
            {currentCard ? '再抽一張' : '抽取靈感'}
          </button>
        </div>

        {box.inspirations.length === 0 && (
           <p className="absolute bottom-24 text-slate-500 text-sm bg-white/80 px-4 py-2 rounded-full">
             這個盒子是空的，請先加入靈感卡片。
           </p>
        )}

      </div>
    </div>
  );
};

export default CardDrawer;