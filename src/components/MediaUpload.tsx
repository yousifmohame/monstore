'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Plus, Video, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  name: string;
  file?: File; // Made optional
}

interface MediaUploadProps {
  media: MediaItem[];
  onMediaChange: (media: MediaItem[]) => void;
  maxItems?: number;
  className?: string;
  acceptVideo?: boolean;
}

export default function MediaUpload({
  media,
  onMediaChange,
  maxItems = 10,
  className = '',
  acceptVideo = true
}: MediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newMedia: MediaItem[] = [];
    const remainingSlots = maxItems - media.length;
    const filesToProcess = Math.min(files.length, remainingSlots);

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (isImage || (isVideo && acceptVideo)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newMedia.push({
              id: `${Date.now()}-${i}`,
              url: e.target.result as string,
              type: isImage ? 'image' : 'video',
              name: file.name,
              file: file
            });
            if (newMedia.length === filesToProcess) {
              onMediaChange([...media, ...newMedia]);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeMedia = (id: string) => {
    onMediaChange(media.filter(item => item.id !== id));
  };

  return (
    <div className={className}>
      <label className="block text-gray-700 font-semibold mb-4">
        <ImageIcon className="inline h-5 w-5 ml-2" />
        صور وفيديوهات المنتج ({media.length}/{maxItems})
      </label>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
        <AnimatePresence>
          {media.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="relative group aspect-square"
            >
              {item.type === 'image' ? (
                <Image
                  src={item.url}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover rounded-lg border-2 border-gray-200 group-hover:border-primary-300 transition-colors"
                />
              ) : (
                <div className="relative w-full h-full">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover rounded-lg border-2 border-gray-200 group-hover:border-primary-300 transition-colors"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
              )}
              <button
                onClick={() => removeMedia(item.id)}
                className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {media.length < maxItems && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <Plus className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500 text-center">
              إضافة ملف
            </span>
          </motion.div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptVideo ? "image/*,video/*" : "image/*"}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
    </div>
  );
}
