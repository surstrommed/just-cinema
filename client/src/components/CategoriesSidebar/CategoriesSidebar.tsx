import { useEffect } from "react";
import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { observer } from "mobx-react-lite";
import { useStore } from "store/store";
import { IDLE_STORE_STATUS } from "constants/store";
import { useNavigate } from "react-router-dom";
import { MiniLoader } from "components/Loader/MiniLoader";

export const CategoriesSidebar = observer(() => {
  const { manageCategoryStore } = useStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (manageCategoryStore.statuses.getCategories === IDLE_STORE_STATUS) {
      manageCategoryStore.getCategories();
    }
  }, []);
  return (
    <Box>
      <Drawer anchor="right" variant="permanent">
        <Box sx={{ width: 250, pt: "5rem" }} role="presentation">
          <Typography variant="h4" textAlign="center" color="secondary">
            Categories
          </Typography>
          <List>
            {manageCategoryStore.categories?.length ? (
              manageCategoryStore.categories.map((category) => (
                <ListItem key={category.id} disablePadding>
                  <ListItemButton
                    onClick={() => navigate(`/films/category/${category.id}/1`)}
                  >
                    <ListItemIcon>
                      <PlayCircleOutlineIcon />
                    </ListItemIcon>
                    <ListItemText primary={category.name} />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <MiniLoader
                style={{ textAlign: "center" }}
                afterload={
                  <Typography variant="body2" textAlign="center">
                    Currently there are no categories
                  </Typography>
                }
              />
            )}
          </List>
          <Button
            onClick={() => navigate(`/actors/1`)}
            fullWidth
            color="secondary"
            size="large"
            sx={{ mt: 5 }}
          >
            Actors
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
});
