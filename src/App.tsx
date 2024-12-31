// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:id" element={<div>Product Detail Page</div>} />
            <Route path="/cart" element={<div>Cart Page</div>} />
            <Route path="/wishlist" element={<div>Wishlist Page</div>} />
            <Route path="/mypage" element={<div>My Page</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;