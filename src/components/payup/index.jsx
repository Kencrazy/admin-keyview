import React from 'react';
import { motion } from 'framer-motion';

export default function Plan() {
  return (
    /* Animate from 0 opacity and 90% scale to full */
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex flex-col bg-white rounded-3xl absolute top-20 left-40 transition-all shadow-xl"
    >
      <div className="px-6 py-8 sm:p-10 sm:pb-6">
        <div className="grid items-center justify-center w-full grid-cols-1 text-left">
          <div>
            <h2 className="text-lg font-medium tracking-tighter text-gray-600 lg:text-3xl">
              Update your plan
            </h2>
            <p className="mt-2 text-sm text-gray-500">Suitable to grow steadily.</p>
          </div>
          <div className="mt-6">
            <p>
              <span className="text-5xl font-light tracking-tight text-black">$1</span>
              <span className="text-base font-medium text-gray-500"> /mo </span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex px-6 pb-8 sm:px-8">
        <button
          aria-describedby="tier-company"
          className="flex items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black"
        >
          Buy Now
        </button>
      </div>
    </motion.div>
  );
}
