// models/types.ts
export interface User {
  id: number;
  name: string;
  email: string;
  // Add other user properties
}

export interface Product {
  id: number;
  name: string;
  price: number;
  // Add other product properties
}

export interface ErrorResponse {
  status: number;
  data: {
    message: string;
    errors?: Record<string, string[]>;
  };
}

// api/baseApi.ts
import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

// Base API configuration
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://your-api-base-url.com',
    prepareHeaders: (headers) => {
      // Add any common headers here
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});

// api/userApi.ts
import { User } from '../models/types';

export interface UpdateUserRequest {
  id: number;
  name?: string;
  email?: string;
  // Other fields
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
    }),
    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
    }),
    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

// api/productApi.ts
import { Product } from '../models/types';

export interface AddProductRequest {
  name: string;
  price: number;
  // Other fields
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
    }),
    addProduct: builder.mutation<Product, AddProductRequest>({
      query: (data) => ({
        url: '/products',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

// store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../models/types';

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;

// store/productSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../models/types';

interface ProductState {
  selectedProduct: Product | null;
  searchQuery: string;
}

const initialState: ProductState = {
  selectedProduct: null,
  searchQuery: '',
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<Product>) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setSelectedProduct, clearSelectedProduct, setSearchQuery } =
  productSlice.actions;
export const productReducer = productSlice.reducer;

// store/index.ts
import {
  combineReducers,
  configureStore,
  isRejectedWithValue,
  Middleware,
  MiddlewareAPI,
} from '@reduxjs/toolkit';
import { baseApi } from '../api/baseApi';
import { userApi } from '../api/userApi';
import { productApi } from '../api/productApi';
import { userReducer } from './userSlice';
import { productReducer } from './productSlice';
import { ErrorResponse } from '../models/types';

// Error handling middleware with TypeScript
export const errorMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      const { payload, error } = action;
      const status = (payload as ErrorResponse)?.status || error?.status;
      const message =
        (payload as ErrorResponse)?.data?.message ||
        error?.message ||
        'An error occurred';

      switch (status) {
        case 400:
          console.error('Bad Request:', message);
          // You could dispatch an action to show an error notification
          // api.dispatch(setError(message));
          break;
        case 401:
          console.error('Unauthorized:', message);
          // Handle token expiration, redirect to login, etc.
          break;
        case 404:
          console.error('Not Found:', message);
          break;
        case 500:
          console.error('Server Error:', message);
          break;
        default:
          console.error(`Error ${status}:`, message);
          break;
      }
    }
    return next(action);
  };

// Root reducer
const rootReducer = combineReducers({
  user: userReducer,
  products: productReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

// Store configuration
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware).concat(errorMiddleware),
});

// Export types
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Export hooks
export const { useGetUsersQuery, useGetUserByIdQuery, useUpdateUserMutation } =
  userApi;

export const { useGetProductsQuery, useAddProductMutation } = productApi;
