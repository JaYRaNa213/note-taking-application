import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, TextField, Button, Grid, Paper, IconButton } from '@mui/material';
import { api } from '../api/api';
import { getToken, removeToken } from '../utils/auth';
import { setAuthToken } from '../api/api';
import DeleteIcon from '@mui/icons-material/Delete';

interface Note { _id: string; title: string; body: string; createdAt: string; }

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await api.get('/notes');
      setNotes(res.data.notes);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load notes');
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = '/';
      return;
    }
    setAuthToken(token);
    load();
  }, []);

  const create = async () => {
    try {
      await api.post('/notes', { title, body });
      setTitle(''); setBody('');
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Create failed');
    }
  };

  const del = async (id: string) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(n => n.filter(x => x._id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Delete failed');
    }
  };

  const logout = () => {
    removeToken();
    setAuthToken(undefined);
    window.location.href = '/';
  };

  return (
    <Container sx={{ pt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Welcome</Typography>
        <Button onClick={logout}>Logout</Button>
      </Box>

      <Box sx={{ mt: 3 }}>
        <TextField label="Title" fullWidth value={title} onChange={e => setTitle(e.target.value)} />
        <TextField label="Body" fullWidth multiline rows={4} value={body} onChange={e => setBody(e.target.value)} sx={{ mt: 2 }} />
        <Button variant="contained" sx={{ mt: 2 }} onClick={create}>Create Note</Button>
      </Box>

      <Grid container spacing={2} sx={{ mt: 3 }}>
        {notes.map(n => (
          <Grid item xs={12} sm={6} key={n._id}>
            <Paper sx={{ p:2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1">{n.title || '(no title)'}</Typography>
                <IconButton onClick={() => del(n._id)}><DeleteIcon/></IconButton>
              </Box>
              <Typography variant="body2">{n.body}</Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>{new Date(n.createdAt).toLocaleString()}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
