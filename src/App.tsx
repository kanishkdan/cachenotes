import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { NotePage } from './pages/NotePage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductHuntBanner } from './components/ProductHuntBanner';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/note/:id" element={<NotePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <ProductHuntBanner />
      </div>
    </BrowserRouter>
  );
}