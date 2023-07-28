import { FC } from "react";
import { IFilmCard } from "models/film";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { LINKS } from "constants/common";
import { observer } from "mobx-react-lite";
import { useStore } from "store/store";
import { MiniLoader } from "components/Loader/MiniLoader";
import { Link } from "react-router-dom";
import { storeLoadingStatusDetector, strTrunc } from "utils";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";

const styles = {
  cardMain: { display: "flex", width: "50%", margin: "0 auto 100px auto" },
  cardMedia: { width: 200 },
  contentBox: { display: "flex", flexDirection: "column" },
  cardContent: { flex: "1 0 auto" },
  chip: { margin: "10px 10px 0 auto" },
  filmTitle: { mb: 3 },
  loader: {
    display: "flex",
    justifyContent: "center",
  },
  manageBtn: { mt: 2, ml: 1 },
  posRat: { color: "green" },
  negRat: { color: "darkred" },
};

export const FilmCard: FC<IFilmCard> = observer(
  ({ film, watchLater, handleFilmUpdate }) => {
    const { userStore } = useStore();

    const removeFromWatchLater = (filmId: string) => {
      userStore.manageFilmFromWatchLater(filmId);
      handleFilmUpdate && handleFilmUpdate();
    };

    if (storeLoadingStatusDetector(userStore.statuses)) {
      return <MiniLoader style={styles.loader} />;
    }

    return (
      <Box>
        <Card sx={styles.cardMain}>
          <CardMedia
            component="img"
            sx={styles.cardMedia}
            image={film.thumbnail || LINKS.noContent}
            alt="Film cover"
          />
          <Box sx={styles.contentBox}>
            <CardContent sx={styles.cardContent}>
              <Button
                component={Link}
                to={`/films/${film.id}`}
                variant="text"
                color="secondary"
                sx={styles.filmTitle}
              >
                {film.title}
              </Button>
              <Typography variant="body1" color="text.secondary">
                {strTrunc(film.description, 100)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Release year: <b>{film.year}</b>
              </Typography>
              {film.rating !== 0 && (
                <Typography variant="body2" color="text.secondary">
                  Rating:{" "}
                  <span style={film.rating > 0 ? styles.posRat : styles.negRat}>
                    {film.rating}
                  </span>
                </Typography>
              )}
              {watchLater && (
                <Tooltip title="Remove from Watch later" sx={styles.manageBtn}>
                  <IconButton
                    onClick={() => removeFromWatchLater(film.id)}
                    color="secondary"
                  >
                    <PlaylistRemoveIcon />
                  </IconButton>
                </Tooltip>
              )}
            </CardContent>
          </Box>
          <Chip label={film.categoryInfo.name} sx={styles.chip} size="small" />
        </Card>
      </Box>
    );
  }
);
