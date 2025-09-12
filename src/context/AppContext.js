import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  user: null,
  nrxBalance: 145.67,
  // Subscription state added here
  subscription: {
    isActive: false,
    tier: null, // 'comfort' or 'ultra'
    expiryDate: null,
  },
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_GFEL_BALANCE':
      return {
        ...state,
        nrxBalance: action.payload,
      };
    // Subscription reducer added here
    case 'SET_SUBSCRIPTION':
      return {
        ...state,
        subscription: action.payload
      };
    default:
      return state;
  }
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Subscription function added here
  const setSubscription = (tier, isActive = true) => {
    dispatch({
      type: 'SET_SUBSCRIPTION',
      payload: { 
        tier, 
        isActive, 
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
      }
    });
  };

  return (
    <AppContext.Provider value={{ 
      state, 
      dispatch,
      setSubscription // Added subscription function to context
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};