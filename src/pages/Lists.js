import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid2,
  TextField,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import { useSelector } from "react-redux";

const Lists = () => {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchLists();
  }, []);

  // Fetch all saved lists
  const fetchLists = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/lists", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLists(response.data.result); // Ensure API response is correctly mapped
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  // Fetch list details by ID when user clicks "View"
  const openListDetails = async (list) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/lists/${list.list_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Convert API response to match expected format
      const formattedList = {
        id: list.list_id,
        name: list.name,
        response_code_ids: response.data.result.map((item) => item.response_code_id),
        response_codes: response.data.result.map((item) => item.response_code),
        image_urls: response.data.result.map((item) => item.image_url),
      };

      setSelectedList(formattedList);
      setOpenDialog(true);
      setEditMode(false);
    } catch (error) {
      console.error("Error fetching list details:", error);
    }
  };

  // Delete a saved list
  const deleteList = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/lists/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted list from UI
      setLists(lists.filter((list) => list.list_id !== id));
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  // Remove an image from a list (when editing)
  const removeImage = (index) => {
    if (!selectedList) return;
    const updatedList = { ...selectedList };
    updatedList.response_code_ids.splice(index, 1);
    updatedList.image_urls.splice(index, 1);
    updatedList.response_codes.splice(index, 1);
    setSelectedList(updatedList);
  };

  // Save the edited list
  const saveEditedList = async () => {
    try {
      const updatedData = {
        name: selectedList.name,
        response_codes: selectedList.response_code_ids,
      };

      const response = await axios.put(`http://localhost:3001/api/lists/edit/${selectedList.id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOpenDialog(false);
      setEditMode(false);
      fetchLists();
      alert(response.data.success ? "List updated successfully!" : "List with same name already exist!");
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Saved Lists
      </Typography>
      {lists.length === 0 ? (
        <Typography>No lists found. Try saving one!</Typography>
      ) : (
        <List>
          {lists.map((list) => (
            <ListItem key={list.list_id} sx={{ display: "flex", justifyContent: "space-between" }}>
              <ListItemText primary={list.name} />
              <Button onClick={() => openListDetails(list)} variant="contained">
                View
              </Button>
              &nbsp;
              <Button onClick={() => deleteList(list.list_id)} variant="contained" color="error">
                Delete
              </Button>
            </ListItem>
          ))}
        </List>
      )}

      {selectedList && (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
          <DialogTitle>
            {editMode ? (
              <TextField
                value={selectedList.name}
                onChange={(e) => setSelectedList({ ...selectedList, name: e.target.value })}
                fullWidth
                variant="outlined"
              />
            ) : (
              selectedList.name
            )}
          </DialogTitle>
          <DialogContent>
            <Grid2 container spacing={3}>
              {selectedList.image_urls.map((url, index) => (
                <Grid2 item xs={12} sm={6} md={4} key={selectedList.response_codes[index]} sx={{ position: "relative" }}>
                  <img
                    src={url}
                    alt={selectedList.response_codes[index]}
                    loading="lazy"
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  />
                  {editMode && (
                    <IconButton
                      onClick={() => removeImage(index)}
                      color="error"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "rgba(255,255,255,0.7)",
                        "&:hover": { backgroundColor: "rgba(255,0,0,0.8)", color: "#fff" },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Grid2>
              ))}
            </Grid2>
          </DialogContent>
          <DialogActions>
            {editMode ? (
              <>
                <Button onClick={() => setEditMode(false)}>Cancel</Button>
                <Button onClick={saveEditedList} variant="contained">
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setOpenDialog(false)}>Close</Button>
                <Button onClick={() => setEditMode(true)} variant="contained" color="primary">
                  Edit
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default Lists;
