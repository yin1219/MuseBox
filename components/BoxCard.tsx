import React from 'react';
import { Box } from '../types';
import { Package, Trash2, Edit } from 'lucide-react';

interface BoxCardProps {
  box: Box;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

const BoxCard: React.FC<BoxCardProps> = ({ box, onClick, onEdit, onDelete }) => {
  const isCustomColor = box.themeColor.startsWith('#') || box.themeColor.startsWith('rgb');

  return (
    <div 
      onClick={onClick}
      className={`relative group cursor-pointer rounded-2xl p-6 h-64 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 text-white overflow-hidden ${!isCustomColor ? box.themeColor : ''}`}
      style={isCustomColor ? { backgroundColor: box.themeColor } : {}}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
          <Package size={24} />
        </div>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onEdit}
            className="p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-md transition-colors"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={onDelete}
            className="p-2 bg-white/20 hover:bg-red-500/40 rounded-full backdrop-blur-md transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-2 relative z-10 drop-shadow-md">{box.title}</h3>
      <p className="text-white/90 text-sm line-clamp-3 relative z-10 leading-relaxed drop-shadow-sm">
        {box.description}
      </p>

      <div className="absolute bottom-6 left-6 z-10 flex items-center text-sm font-medium bg-black/10 px-3 py-1 rounded-full backdrop-blur-sm">
        <span className="mr-2">{box.inspirations.length}</span> 張卡片
      </div>
    </div>
  );
};

export default BoxCard;