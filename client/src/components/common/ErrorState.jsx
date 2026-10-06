import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ title = 'Oops! Something went sideways', message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-3xl bg-red-50/80 border border-sceptre/20 my-6 max-w-md mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-sceptre/10 flex items-center justify-center text-sceptre mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="font-heading font-bold text-base sm:text-lg text-soil">{title}</h3>
      <p className="mt-1 text-xs sm:text-sm text-soil/70 leading-relaxed">
        {message || 'We could not fetch this data right now. Please check your connection or try again.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sceptre hover:bg-sceptre-dark text-cream font-heading font-bold text-xs shadow-warm transition-transform active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
