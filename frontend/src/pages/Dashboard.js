import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard({ onLogout }) {
  const [message, setMessage] = useState('');
  const [error, setError]     = useState('');

  useEffect(() => {
    async function fetchData() {
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        setMessage(res.data.message);
      } catch (error) {
        setError(error.response?.data?.error || 'Session expired. Please login again.');
      }
    }
    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Dashboard</h2>
        {error && <p style={styles.error}>{error}</p>}
        {message && <p>{message}</p>}
        <button style={styles.logoutButton} onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
  },
  card: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
    width: '300px',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
  logoutButton: {
    marginTop: '16px',
    padding: '12px',
    width: '100%',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#dc3545',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
};
