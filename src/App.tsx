import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { router } from './router';
import Menu from './components/Menu';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Menu />
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;