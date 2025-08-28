import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Card, CardContent, Typography, IconButton } from "@mui/material";

interface Props {
  note: { _id: string; title: string; body?: string; createdAt?: string };
  onDelete: (id: string) => void;
}

const NoteCard: React.FC<Props> = ({ note, onDelete }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <Typography variant="h6">{note.title}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {note.body}
            </Typography>
          </div>
          <IconButton onClick={() => onDelete(note._id)} size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          {note.createdAt ? new Date(note.createdAt).toLocaleString() : ""}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
