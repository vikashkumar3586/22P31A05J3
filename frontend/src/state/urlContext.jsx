import { createContext, useContext, useReducer } from 'react';
import { loggingApi } from '../api/loggingApi';

// Initial state
const initialState = {
  urls: [],
  loading: false,
  error: null,
  shortcodeToRedirect: null
};

// Action types
export const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_URLS: 'SET_URLS',
  ADD_URL: 'ADD_URL',
  UPDATE_URL: 'UPDATE_URL',
  SET_SHORTCODE_TO_REDIRECT: 'SET_SHORTCODE_TO_REDIRECT',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const urlReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTION_TYPES.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ACTION_TYPES.SET_URLS:
      return { ...state, urls: action.payload, loading: false };
    
    case ACTION_TYPES.ADD_URL:
      return { 
        ...state, 
        urls: [action.payload, ...state.urls], 
        loading: false 
      };
    
    case ACTION_TYPES.UPDATE_URL:
      return {
        ...state,
        urls: state.urls.map(url => 
          url.shortcode === action.payload.shortcode ? action.payload : url
        )
      };
    
    case ACTION_TYPES.SET_SHORTCODE_TO_REDIRECT:
      return { ...state, shortcodeToRedirect: action.payload };
    
    default:
      return state;
  }
};

// Context
const UrlContext = createContext();

// Provider component
export const UrlProvider = ({ children }) => {
  const [state, dispatch] = useReducer(urlReducer, initialState);

  const actions = {
    setLoading: (loading) => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading });
    },

    setError: async (error) => {
      // Non-blocking logging
      loggingApi.logError('state', `Error in URL state: ${error}`).catch(() => {});
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
    },

    clearError: () => {
      dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
    },

    setUrls: (urls) => {
      dispatch({ type: ACTION_TYPES.SET_URLS, payload: urls });
    },

    addUrl: (url) => {
      dispatch({ type: ACTION_TYPES.ADD_URL, payload: url });
    },

    updateUrl: (url) => {
      dispatch({ type: ACTION_TYPES.UPDATE_URL, payload: url });
    },

    setShortcodeToRedirect: (shortcode) => {
      dispatch({ type: ACTION_TYPES.SET_SHORTCODE_TO_REDIRECT, payload: shortcode });
    }
  };

  return (
    <UrlContext.Provider value={{ state, actions }}>
      {children}
    </UrlContext.Provider>
  );
};

// Custom hook to use the context
export const useUrlContext = () => {
  const context = useContext(UrlContext);
  if (!context) {
    throw new Error('useUrlContext must be used within a UrlProvider');
  }
  return context;
};
