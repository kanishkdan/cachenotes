import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              About CacheNotes
            </h3>
            <p className="mt-4 text-base text-gray-500">
              A simple, browser-based note-taking app that saves notes / twitter threads locally. Always free and built entirely by AI—no human wrote a single line of code.            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Created by
            </h3>
            <div className="mt-4">
              <p className="text-base text-gray-500">
                Kanishk Razdan
              </p>
              <a
                href="https://twitter.com/kanishk_razdan"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-sm text-indigo-600 hover:text-indigo-500"
              >
                @kanishk_razdan
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Other Tools
            </h3>
            <div className="mt-4 space-y-2">
              <a
                href="https://howsthisgoing.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-base text-gray-500 hover:text-indigo-600 transition-colors"
              >
                HowsThisGoing - AI Project Manager for Slack
              </a>
              <a
                href="https://obsess.life"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-base text-gray-500 hover:text-indigo-600 transition-colors"
              >
                Obsess.Life - Track Your Obsessions
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-100 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} CacheNotes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}