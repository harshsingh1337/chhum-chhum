import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'chhumchhum_cart';

function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function cartReducer(state, action) {
  let newState;
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.find(
        (item) => item.id === action.payload.id && item.size === action.payload.size
      );
      if (existing) {
        newState = state.map((item) =>
          item.id === action.payload.id && item.size === action.payload.size
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newState = [...state, { ...action.payload }];
      }
      break;
    }
    case 'REMOVE_FROM_CART':
      newState = state.filter(
        (item) => !(item.id === action.payload.id && item.size === action.payload.size)
      );
      break;
    case 'UPDATE_QUANTITY':
      newState = state.map((item) =>
        item.id === action.payload.id && item.size === action.payload.size
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );
      break;
    case 'CLEAR_CART':
      newState = [];
      break;
    default:
      return state;
  }
  saveCart(newState);
  return newState;
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [], loadCart);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxAmount = Math.round(cartTotal * 0.05); // 5% GST approx

  return (
    <CartContext.Provider value={{ cart, dispatch, cartCount, cartTotal, taxAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
