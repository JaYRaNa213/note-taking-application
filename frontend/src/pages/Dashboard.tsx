import React, { useEffect, useState } from "react";
import api from "../api/api";
import { getUser, clearAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import NoteCard from "../components/NoteCard";

interface Note {
  _id: string;
  title: string;
  body?: string;
  createdAt?: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const user = getUser();

  // fetch notes
  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes");
      // backend returns { notes: [...] }
      setNotes(res.data?.notes || []);
    } catch (err) {
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const handleAddNote = async () => {
    if (!newTitle.trim() && !newBody.trim()) return;
    try {
      // backend expects { title, body }
      const res = await api.post("/notes", {
        title: newTitle,
        body: newBody,
      });
      // backend returns { note }
      const created = res.data?.note;
      if (created) {
        setNotes((prev) => [created, ...prev]);
      } else {
        // in case backend returns the note directly
        setNotes((prev) => [res.data, ...prev]);
      }
      setShowModal(false);
      setNewTitle("");
      setNewBody("");
    } catch (err) {
      console.error("Error adding note:", err);
      alert("Failed to add note");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete note");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name || "User"} 👋</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg">
          Logout
        </button>
      </div>

      {/* Add Note Button */}
      <button onClick={() => setShowModal(true)} className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg">
        + Add Note
      </button>

      {/* Notes List */}
      {loading ? (
        <p>Loading notes...</p>
      ) : notes.length === 0 ? (
        <p className="text-gray-600">No notes yet. Start by adding one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Add Note Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Note</h2>
            <input
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />
            <textarea
              placeholder="Content"
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              className="w-full border p-2 rounded mb-3 h-28"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">
                Cancel
              </button>
              <button onClick={handleAddNote} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
