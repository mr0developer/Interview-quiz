import React, { useState } from 'react';
import axios from 'axios';

export default function Register({ onRegistered }) {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  async function register() {
    setError('');
    try {
      await axios.post('http://localhost:3001/api/register', {
        username,
        email,
        password,
      });
      alert('✅ Registration successful!');
      onRegistered();
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred');
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input
          placeholder="Username"
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={styles.button} onClick={register}>
          Register
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
  input: {
    marginTop: '12px',
    padding: '12px',
    width: '100%',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  button: {
    marginTop: '16px',
    padding: '12px',
    width: '100%',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#007bff',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
};
