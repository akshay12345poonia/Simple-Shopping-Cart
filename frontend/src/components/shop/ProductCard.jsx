import React from "react";
import { ShoppingCart, Package } from "lucide-react";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {product.stock < 10 && product.stock > 0 && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg text-lg font-bold">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 leading-tight">
              {product.name}
            </h3>
            <span className="text-xs shrink-0 capitalize border border-blue-200 text-blue-700 px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-blue-900">
              ${product.price}
            </span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Package className="w-3 h-3" />
          <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
        </div>
      </div>
    </div>
  );
}