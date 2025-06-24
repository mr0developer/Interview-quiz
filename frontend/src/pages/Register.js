import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Register({ onRegistered }) {
  const [username, setUsername]           = useState('');
  const [email, setEmail]               = useState('');
  const [password, setPassword]           = useState('');
  const [departmentId, setDepartmentId]     = useState('');
  const [jobCategoryId, setJobCategoryId]     = useState('');
  const [phoneNumber, setPhoneNumber]       = useState('');
  const [address, setAddress]           = useState('');

  const [departments, setDepartments]       = useState([]);
  const [jobCategories, setJobCategories]     = useState([]);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const departmentsRes = await axios.get("http://localhost:3001/api/departments");
        const jobsRes = await axios.get("http://localhost:3001/api/job_categories");
        setDepartments(departmentsRes.data);
        setJobCategories(jobsRes.data);
      } catch (err) {
        setError("Error loading departments or jobs.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function register() {
    setError('');
    setSuccess('');
    try {
      await axios.post("http://localhost:3001/api/register", {
        username,
        email,
        password,
        department_id: departmentId,
        job_category_id: jobCategoryId,
        phone_number: phoneNumber,
        address,
      });
      setSuccess("✅ Registration successful! You can now login.");
      onRegistered();
    } catch (error) {
      setError(error.response?.data?.error || "Registration error");
    }
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Register</h2>
          <p>Loading departments and jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

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
          type="password"
        />

        <select
          style={styles.input}
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
        >
          <option value="">Select Department</option>
          {departments.map((dep) => (
            <option key={dep.id} value={dep.id}>
              {dep.name}
            </option>
          ))}
        </select>

        <select
          style={styles.input}
          value={jobCategoryId}
          onChange={(e) => setJobCategoryId(e.target.value)}
        >
          <option value="">Select Job Category</option>
          {jobCategories.map((job) => (
            <option key={job.id} value={job.id}>
              {job.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Phone Number"
          style={styles.input}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          placeholder="Address"
          style={styles.input}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
  },
  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
    width: "300px",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
  success: {
    color: "green",
    marginTop: "10px",
  },
  input: {
    marginTop: "12px",
    padding: "12px",
    width: "100%",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    marginTop: "16px",
    padding: "12px",
    width: "100%",
    fontSize: "16px",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#007bff",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
};
