import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VideoPreview({ videoData }) {
    return (
        <AnimatePresence>
            {videoData && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white/5 rounded-2xl p-4 flex gap-4 border border-white/10 mt-2"
                >
                    <img src={videoData.thumbnail} alt="Thumbnail" className="w-28 h-20 object-cover rounded-xl shadow-lg" />
                    <div className="overflow-hidden flex-1 flex flex-col justify-center">
                        <h3 className="font-bold text-sm truncate mb-1">{videoData.title}</h3>
                        <p className="text-xs text-text-secondary truncate mb-2">{videoData.channelTitle}</p>
                        <div className="flex gap-1.5 flex-wrap">
                            {videoData.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-[10px] bg-white/10 px-2 py-1 rounded-md text-text-secondary border border-white/5">#{tag}</span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
