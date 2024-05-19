import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Routes/AppRoutes';
import { UserContext } from './Contexts/UserContext';
import { UserProvider } from './Contexts/UserContext';
import { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { user } = useContext(UserContext);
  return (
    <>
    <UserProvider>
      <Router>
        <div className="main-content">
          <AppRoutes />
          <ToastContainer />
        </div>
      </Router>
    </UserProvider>
    </>
  );
}

<ToastContainer
  position="top-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
/>

export default App;