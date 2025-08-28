import React from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  note: { _id: string; title: string; body: string };
  onDelete: (id: string) => void;
}

const NoteCard: React.FC<Props> = ({ note, onDelete }) => {
  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">{note.title}</Typography>
        <Typography variant="body2" sx={{ marginBottom: 1 }}>{note.body}</Typography>
        <IconButton onClick={() => onDelete(note._id)}>
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
