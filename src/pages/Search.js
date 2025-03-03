import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Grid2,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";

const Search = () => {
  const [filter, setFilter] = useState("");
  const [images, setImages] = useState([]);
  const [listName, setListName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/response-codes/list?filter=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages(response.data.result);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const saveList = async () => {
    if (!listName || images.length === 0) return;

    const listData = {
      name: listName,
      response_codes: images.map((img) => img.id),
    };

    try {
      const response = await axios.post("http://localhost:3001/api/lists", listData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpenDialog(false);
      setListName("");
      alert(response.data.success ? "List saved successfully!" : "List with same name already exist!");
    } catch (error) {
      console.error("Error saving list:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Search/Filter HTTP Status Codes
      </Typography>
      <TextField
        label="Filter by Response Code (e.g., 2xx, 20x, 3xx)"
        fullWidth
        variant="outlined"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        autoComplete="off"
      />
      <Button onClick={fetchImages} variant="contained" sx={{ mt: 2 }}>
        Search
      </Button>

      {images.length > 0 && (
        <Button onClick={() => setOpenDialog(true)} variant="contained" color="success" sx={{ mt: 2, ml: 2 }}>
          Save List
        </Button>
      )}

      <Grid2 container spacing={3} sx={{ mt: 2 }}>
        {images.map((image) => (
          <Grid2 item size={{ xs: 12, md: 6, lg: 3 }} key={image.id}>
            <img src={image.image_url} alt={image.description} loading="lazy" style={{ width: "100%" }} />
          </Grid2>
        ))}
      </Grid2>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Save List</DialogTitle>
        <DialogContent>
          <TextField
            label="List Name"
            fullWidth
            variant="outlined"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={saveList} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Search;
