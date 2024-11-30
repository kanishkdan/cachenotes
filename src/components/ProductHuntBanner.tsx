import React from 'react';

export function ProductHuntBanner() {
  return (
    <div className="bg-gradient-to-r from-orange-400 to-orange-500">
      <a
        href="https://www.producthunt.com/products/howsthisgoing-another-ai-standup-bot"
        target="_blank"
        rel="noopener noreferrer"
        className="block text-white py-2 text-center hover:from-orange-500 hover:to-orange-600 transition-colors"
      >
        <span className="font-medium">🎉 Support howsthisgoing.com on Product Hunt!</span>
      </a>
    </div>
  );
}