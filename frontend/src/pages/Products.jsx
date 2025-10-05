import React, { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { ShoppingCart, Search, Filter, Package } from "lucide-react";

import ProductCard from "../components/shop/ProductCard";
import CartDrawer from "../components/shop/CartDrawer";
import CheckoutModal from "../components/shop/CheckoutModal";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filterProducts = useCallback(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, categoryFilter]);

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error("Error loading products:", error);
      alert("Failed to load products. Please try again.");
    }
    setIsLoading(false);
  };

  const loadCart = () => {
    const savedCart = localStorage.getItem("shopping_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCart = (newCart) => {
    localStorage.setItem("shopping_cart", JSON.stringify(newCart));
  };

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    let newCart;

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert("Cannot add more items than available in stock");
        return;
      }
      newCart = cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(newCart);
    saveCart(newCart);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      handleRemoveItem(productId);
      return;
    }

    const product = products.find(p => p._id === productId);
    if (newQuantity > product.stock) {
      alert("Cannot add more items than available in stock");
      return;
    }

    const newCart = cart.map(item =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(newCart);
    saveCart(newCart);
  };

  const handleRemoveItem = (productId) => {
    const newCart = cart.filter(item => item._id !== productId);
    setCart(newCart);
    saveCart(newCart);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleConfirmOrder = async (customerInfo) => {
    setIsProcessing(true);
    try {
      const orderItems = cart.map(item => ({
        product_id: item._id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      await api.post('/orders', {
        items: orderItems,
        total_amount: total,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
      });

      setCart([]);
      saveCart([]);
      loadProducts();
      setIsProcessing(false);
      return true;
    } catch (error) {
      console.error("Error placing order:", error);
      alert(error.message || "Error placing order. Please try again.");
      setIsProcessing(false);
      return false;
    }
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 relative">
      {/* Cart Drawer and Checkout Modal - Placed outside the main content container */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={cartTotal}
        onConfirmOrder={handleConfirmOrder}
        isProcessing={isProcessing}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                Premium Shop
              </h1>
              <p className="text-gray-600 text-lg">Discover our curated collection</p>
            </div>
            
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl px-8 py-4 rounded-lg text-lg font-semibold transition-all"
            >
              <ShoppingCart className="w-6 h-6 inline mr-3" />
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold border-2 border-white">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          <div className="grid md:grid-cols-[1fr_auto] gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 h-14 text-lg bg-white shadow-md border-0 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none px-4"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full md:w-48 h-14 bg-white shadow-md border-0 text-lg rounded-lg px-4 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="home">Home</option>
              <option value="beauty">Beauty</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="w-4 h-4" />
            <span>{filteredProducts.length} products available</span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
