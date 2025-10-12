"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className={`text-center text-white mb-16 ${mounted ? 'animate-fadeIn' : 'opacity-0'}`}>
          <h1 className="text-6xl md:text-7xl font-black mb-6 drop-shadow-lg">
            HEART Score
          </h1>
          <p className="text-2xl md:text-3xl font-light mb-4 opacity-90">
            Economic Model Dashboard
          </p>
          <p className="text-lg md:text-xl opacity-80">
            Developed by <span className="font-semibold">Khurshid Imtiyaz</span>
          </p>
        </div>

        {/* Main Content Card */}
        <div className={`max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-12 ${mounted ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          {/* What is HEART Score */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              What is the HEART Score?
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                The HEART Score is a comprehensive economic indicator that combines two critical dimensions:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-indigo-100">
                  <h3 className="text-xl font-bold text-indigo-900 mb-3">
                    Heart Value (HV)
                  </h3>
                  <p className="text-gray-700 mb-3">
                    A normalized score (0-1) based on:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• <strong>Housing</strong> contribution to GDP</li>
                    <li>• <strong>Health</strong> contribution to GDP</li>
                    <li>• <strong>Energy</strong> contribution to GDP</li>
                    <li>• <strong>Education</strong> contribution to GDP</li>
                    <li>• Global GDP Share (+)</li>
                    <li>• Interest Payments (-)</li>
                    <li>• Trade Balance (±)</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100">
                  <h3 className="text-xl font-bold text-amber-900 mb-3">
                    Heart Affordability Ranking (HAR)
                  </h3>
                  <p className="text-gray-700 mb-3">
                    A letter grade (A+ to D-) based on:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Adjusted Per Capita Income (APCI)</li>
                    <li>• Human Development Index (HDI)</li>
                    <li>• Income Inequality (GINI)</li>
                    <li>• Economic Affordability</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-3">
                    HAR measures the purchasing power and living standards relative to income inequality.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl border border-purple-200 my-6">
                <h3 className="text-xl font-bold text-purple-900 mb-3">
                  Final HEART Score Format
                </h3>
                <p className="text-gray-700 mb-4">
                  The HEART Score combines both components: <strong>HV + HAR</strong>
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="bg-white px-6 py-3 rounded-lg shadow">
                    <span className="text-sm text-gray-600">Saudi Arabia</span>
                    <p className="text-2xl font-bold text-indigo-600">0.76C</p>
                  </div>
                  <div className="bg-white px-6 py-3 rounded-lg shadow">
                    <span className="text-sm text-gray-600">China</span>
                    <p className="text-2xl font-bold text-indigo-600">0.73D+</p>
                  </div>
                  <div className="bg-white px-6 py-3 rounded-lg shadow">
                    <span className="text-sm text-gray-600">United States</span>
                    <p className="text-2xl font-bold text-indigo-600">0.65A</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-700">
                This model provides a holistic view of a country&apos;s economic health, combining infrastructure 
                investment, social development, and affordability metrics to assess overall economic performance.
              </p>
            </div>
          </section>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/dashboard"
              className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="relative z-10">🌍 Explore Countries</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity"></div>
            </Link>

            <Link
              href="/ai"
              className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="relative z-10">💬 Ask AI Assistant</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity"></div>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white opacity-75">
          <p className="text-sm">
            © 2025 HEART Score Economic Model. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
