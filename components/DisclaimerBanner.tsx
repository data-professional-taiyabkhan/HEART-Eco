"use client";

import Link from "next/link";

export default function DisclaimerBanner() {
  const disclaimerText = "HEART Scores use a mix of official data and carefully documented approximations where exact figures are unavailable. Values are indicative, not official statistics. If you have more accurate data, you can recalculate using our HEART Score Calculator.";

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 border-b border-indigo-100/50 shadow-sm backdrop-blur-sm overflow-hidden">
      <div className="py-2">
        <div className="flex items-center">
          {/* Left accent bar */}
          <div className="flex-shrink-0 w-1 h-6 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full ml-4"></div>
          
          {/* Scrolling ticker */}
          <div className="flex-1 overflow-hidden">
            <div className="flex animate-scroll">
              {/* Duplicate content for seamless loop */}
              <div className="flex items-center gap-4 whitespace-nowrap">
                <span className="font-medium text-slate-600 text-xs md:text-sm">Note:</span>
                <span className="text-slate-700 text-xs md:text-sm">{disclaimerText}</span>
                <span className="text-slate-500">•</span>
                <Link
                  href="/calculator"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors hover:underline text-xs md:text-sm"
                >
                  Recalculate using our Calculator →
                </Link>
                <span className="text-slate-500">•</span>
              </div>
              {/* Duplicate for seamless loop */}
              <div className="flex items-center gap-4 whitespace-nowrap ml-8">
                <span className="font-medium text-slate-600 text-xs md:text-sm">Note:</span>
                <span className="text-slate-700 text-xs md:text-sm">{disclaimerText}</span>
                <span className="text-slate-500">•</span>
                <Link
                  href="/calculator"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors hover:underline text-xs md:text-sm"
                >
                  Recalculate using our Calculator →
                </Link>
                <span className="text-slate-500">•</span>
              </div>
            </div>
          </div>
          
          {/* Right accent bar */}
          <div className="flex-shrink-0 w-1 h-6 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full mr-4"></div>
        </div>
      </div>
    </div>
  );
}

