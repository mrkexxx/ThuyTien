import React from 'react';

interface ImagePlaceholderProps {
  label: string;
  icon?: React.ReactNode;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ label, icon }) => (
  <div className="flex flex-col items-center justify-center w-full h-full bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-xl text-gray-400">
    {icon && <div className="mb-2">{icon}</div>}
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default ImagePlaceholder;
