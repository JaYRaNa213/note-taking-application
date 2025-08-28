import { Request, Response } from 'express';
import Note from '../models/note.model';
import { AuthRequest } from '../middlewares/auth.middleware';

export async function getNotes(req: AuthRequest, res: Response) {
  const userId = req.user._id;
  const notes = await Note.find({ userId }).sort({ createdAt: -1 });
  res.json({ notes });
}

export async function createNote(req: AuthRequest, res: Response) {
  const { title, body } = req.body;
  if (!title && !body) return res.status(400).json({ message: 'Provide title or body' });
  const note = await Note.create({ userId: req.user._id, title, body });
  return res.status(201).json({ note });
}

export async function deleteNote(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const note = await Note.findOneAndDelete({ _id: id, userId: req.user._id });
  if (!note) return res.status(404).json({ message: 'Note not found or not yours' });
  return res.json({ message: 'Deleted' });
}
