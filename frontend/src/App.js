// import logo from './logo.svg';
// import './App.css';
import React, { useState } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(localStorage.getItem('token') ? true : false);
  const [page, setPage] = useState('login');

  if (user) {
    return (
      <Dashboard
        onLogout={() => {
          localStorage.removeItem('token');
          setUser(false);
          setPage('login');
        }}
      />
    );
  }

  return (
    <div style={styles.appContainer}>
      {page === 'register' && <Register onRegistered={() => setPage('login')} />}
      {page === 'login' && <Login onLogin={() => setUser(true)} />}

      <div style={styles.linkContainer}>
        <button
          style={styles.linkButton}
          onClick={() => setPage(page === 'login' ? 'register' : 'login')}
        >
          {page === 'login' ? 'Go to Register' : 'Go to Login'}
        </button>
      </div>
    </div>
  );
}

export default App;

const styles = {
  appContainer: {
    position: 'relative',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
  },
  linkContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '-30px',
    paddingBottom: '20px',
  },
  linkButton: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#007bff',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};