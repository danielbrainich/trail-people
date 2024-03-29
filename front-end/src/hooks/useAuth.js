import { useState, useEffect } from 'react';
import useCsrfToken from './useCsrfToken';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const { csrfToken, updateCsrfToken } = useCsrfToken();
  const navigate = useNavigate();
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction ? '' : process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
  const [error, setError] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${baseUrl}/accounts/current_user/`, {
        method: 'GET',
        headers: {
          "X-CSRFToken": csrfToken,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        throw new Error('Failed to fetch user');
      }
    } catch (error) {
      console.error('Failed to fetch user', error);
      setUser(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (csrfToken) {
        await fetchCurrentUser();
      }
    };
    fetchData();
  }, [csrfToken]);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${baseUrl}/accounts/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login was unsuccessful, Please try again.');
      }

      updateCsrfToken();
      await fetchCurrentUser();
      navigate('/welcome');
    } catch (error) {
      console.error('Login error', error);
      throw new Error('Login was unsuccessful. Please try again.');
    }
  };

  const signup = async (formData) => {
    try {
      const response = await fetch(`${baseUrl}/accounts/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        updateCsrfToken();
        await login(formData.username, formData.password);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.username
          ? errorData.username[0]
          : errorData.detail || 'An unknown error occurred during signup.';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Signup error:", error.message);
      setError(error.message);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${baseUrl}/accounts/logout/`, {
        method: 'POST',
        headers: {
          "X-CSRFToken": csrfToken,
        },
        credentials: 'include',
      });

      if (response.ok) {
        updateCsrfToken();
        setUser(null);
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return { user, login, logout, fetchCurrentUser, updateUser, signup, setError };
};

export default useAuth;
