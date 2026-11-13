import { useEffect, useRef } from 'react';
import { Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { setCredentials } from '../redux/slices/authSlice';

export default function GoogleCallbackPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const url = api.getUri({ url: '/auth/google/complete' });
    fetch(url, { method: 'POST', credentials: 'include' })
      .then(response => {
        if (!response.ok) throw new Error('Google sign-in could not be completed');
        return response.json();
      })
      .then(credentials => {
        dispatch(setCredentials(credentials));
        navigate('/', { replace: true });
      })
      .catch(() => navigate('/login?error=auth_failed', { replace: true }));
  }, [dispatch, navigate]);

  return <Typography role="status" sx={{ p: 4 }}>Finishing Google sign-in…</Typography>;
}
