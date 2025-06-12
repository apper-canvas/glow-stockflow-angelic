import React from 'react';

const LoadingIndicator = ({ className = 'p-6 space-y-6', numCards = 6, numRows = 5 }) => {
  return (
    &lt;div className={className}&gt;
      &lt;div className="flex justify-between items-center"&gt;
        &lt;div className="h-8 bg-gray-200 rounded w-32 animate-pulse"&gt;&lt;/div&gt;
        &lt;div className="h-10 bg-gray-200 rounded w-32 animate-pulse"&gt;&lt;/div&gt;
      &lt;/div&gt;
      
      {numCards &gt; 0 &amp;&amp; (
        &lt;div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"&gt;
          {[...Array(numCards)].map((_, i) => (
            &lt;div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse"&gt;
              &lt;div className="h-4 bg-gray-200 rounded w-32 mb-4"&gt;&lt;/div&gt;
              &lt;div className="h-4 bg-gray-200 rounded w-24 mb-2"&gt;&lt;/div&gt;
              &lt;div className="h-4 bg-gray-200 rounded w-28"&gt;&lt;/div&gt;
            &lt;/div&gt;
          ))}
        &lt;/div&gt;
      )}

      {numRows &gt; 0 &amp;&amp; numCards === 0 &amp;&amp; ( // Only show table skeleton if no cards
        &lt;div className="bg-white rounded-lg shadow-sm"&gt;
          &lt;div className="p-6 space-y-4"&gt;
            {[...Array(numRows)].map((_, i) => (
              &lt;div key={i} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg animate-pulse"&gt;
                &lt;div className="h-4 bg-gray-200 rounded w-20"&gt;&lt;/div&gt;
                &lt;div className="h-4 bg-gray-200 rounded w-40"&gt;&lt;/div&gt;
                &lt;div className="h-4 bg-gray-200 rounded w-16"&gt;&lt;/div&gt;
                &lt;div className="h-4 bg-gray-200 rounded w-20"&gt;&lt;/div&gt;
              &lt;/div&gt;
            ))}
          &lt;/div&gt;
        &lt;/div&gt;
      )}
    &lt;/div&gt;
  );
};

export default LoadingIndicator;