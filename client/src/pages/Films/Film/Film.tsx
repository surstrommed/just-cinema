import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router";
import { useStore } from "store/store";
import { PENDING_STORE_STATUS } from "constants/store";
import { MiniLoader } from "components/Loader/MiniLoader";
import {
  Box,
  Chip,
  IconButton,
  ImageListItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { LINKS } from "constants/common";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import moment from "moment";
import { apiLink } from "utils/helpers/helpers";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import { CommentBox } from "components/CommentBox";
import {
  UNAUTHORIZED_TO_LIKE,
  UNAUTHORIZED_TO_WATCH_LATER,
  UNAUTHORIZED_TO_DISLIKE,
} from "constants/messages";
import { IUser } from "models/user";

const styles = {
  mainBox: (user: IUser | null) => ({
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    mt: user ? 0 : "5rem",
  }),
  imageBox: { pr: 20, flex: "1 1 50%" },
  infoBox: { flex: "1 1 50%" },
  image: { width: "500px", margin: "0 auto" },
  ratingBox: {
    flex: "1 1 100%",
    mt: 5,
  },
  ratingManageBox: {
    width: "20%",
    p: 2,
    border: "1px solid darkred",
    borderRadius: "20px",
    margin: "0 auto",
  },
  ratingBtnsBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  chip: { margin: "10px 10px 0 auto" },
  description: { mt: 5 },
  createdAt: { textAlign: "right" },
  filmBox: {
    mt: 5,
    display: "flex",
    justifyContent: "center",
  },
  film: {
    width: "80%",
  },
  loader: (user: IUser | null) => ({
    display: "flex",
    justifyContent: "center",
    marginTop: user ? "0" : "5rem",
  }),
  commentBox: {
    flex: "1 1 100%",
    display: "flex",
    justifyContent: "center",
  },
  posRat: { color: "green" },
  negRat: { color: "darkred" },
};

export const Film = observer(() => {
  const { manageFilmStore, userStore } = useStore();

  const { filmId } = useParams();

  const [filmManaged, setFilmManaged] = useState(false);

  useEffect(() => {
    if (
      filmId &&
      manageFilmStore.statuses.getFilmById !== PENDING_STORE_STATUS
    ) {
      manageFilmStore.getFilmById(filmId);
      if (filmManaged) {
        setFilmManaged(false);
      }
    }
  }, [filmId, filmManaged]);

  const likeFilm = (filmId: string | undefined) => {
    if (filmId && userStore.user) {
      manageFilmStore.likeFilm(filmId);
    }
  };

  const dislikeFilm = (filmId: string | undefined) => {
    if (filmId && userStore.user) {
      manageFilmStore.dislikeFilm(filmId);
    }
  };

  const manageFilmFromWatchLater = (filmId: string | undefined) => {
    if (filmId) {
      userStore.manageFilmFromWatchLater(filmId);
    }
  };

  const isFilmLoading =
    manageFilmStore.statuses.getFilmById === PENDING_STORE_STATUS;

  if (!manageFilmStore.film || isFilmLoading) {
    return (
      <MiniLoader
        style={styles.loader(userStore.user)}
        afterload={
          <Typography variant="body2" textAlign="center">
            The page for this film could not be loaded, please try again later
          </Typography>
        }
      />
    );
  }

  return (
    <Box sx={styles.mainBox(userStore.user)}>
      <Box sx={styles.imageBox}>
        <ImageListItem>
          <img
            src={manageFilmStore.film.thumbnail || LINKS.noContent}
            alt={manageFilmStore.film.title}
            loading="lazy"
            style={styles.image}
          />
        </ImageListItem>
      </Box>
      <Box sx={styles.infoBox}>
        <Typography variant="h3">{manageFilmStore.film.title}</Typography>
        <Chip
          label={manageFilmStore.film.categoryInfo.name}
          sx={styles.chip}
          size="small"
        />
        <Typography variant="body2" sx={styles.description}>
          {manageFilmStore.film.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Release year: <b>{manageFilmStore.film.year}</b>
        </Typography>
        <Typography variant="body2" sx={styles.description}>
          Uploaded {moment(manageFilmStore.film.createdAt).fromNow()}
        </Typography>
      </Box>
      <br />
      <Box sx={styles.ratingBox}>
        <Box sx={styles.ratingManageBox}>
          {isFilmLoading ? (
            <MiniLoader
              style={styles.loader(userStore.user)}
              afterload={<Typography variant="h5">Failed to load</Typography>}
            />
          ) : (
            <Box sx={styles.ratingBtnsBox}>
              <Tooltip
                title={
                  userStore.user
                    ? manageFilmStore.film.likes.includes(userStore.user.id)
                      ? "Remove like"
                      : "Like"
                    : UNAUTHORIZED_TO_LIKE
                }
              >
                <span>
                  {manageFilmStore.film.likes?.length || 0}{" "}
                  <IconButton
                    color="success"
                    component="label"
                    onClick={() => likeFilm(manageFilmStore?.film?.id)}
                    disabled={!userStore.user}
                  >
                    {userStore.user &&
                    manageFilmStore.film.likes.includes(userStore.user.id) ? (
                      <ThumbUpIcon />
                    ) : (
                      <ThumbUpOffAltIcon />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip
                title={
                  userStore.user
                    ? userStore.user.watchLater.includes(
                        manageFilmStore.film.id
                      )
                      ? "Remove from Watch later"
                      : "Save to Watch later"
                    : UNAUTHORIZED_TO_WATCH_LATER
                }
                sx={{ mx: 3 }}
              >
                <IconButton
                  color="secondary"
                  component="label"
                  onClick={() =>
                    manageFilmFromWatchLater(manageFilmStore?.film?.id)
                  }
                  disabled={!userStore.user}
                >
                  {userStore.user?.watchLater.includes(
                    manageFilmStore?.film?.id
                  ) ? (
                    <PlaylistRemoveIcon />
                  ) : (
                    <WatchLaterIcon />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip
                title={
                  userStore.user
                    ? manageFilmStore.film.dislikes.includes(userStore.user.id)
                      ? "Remove dislike"
                      : "Dislike"
                    : UNAUTHORIZED_TO_DISLIKE
                }
              >
                <span>
                  <IconButton
                    color="error"
                    component="label"
                    onClick={() => dislikeFilm(manageFilmStore?.film?.id)}
                    disabled={!userStore.user}
                  >
                    {userStore.user &&
                    manageFilmStore.film.dislikes.includes(
                      userStore.user.id
                    ) ? (
                      <ThumbDownIcon />
                    ) : (
                      <ThumbDownOffAltIcon />
                    )}
                  </IconButton>{" "}
                  {manageFilmStore.film.dislikes?.length || 0}
                </span>
              </Tooltip>
            </Box>
          )}
          <Typography variant="body2" textAlign="center" mt={2}>
            {manageFilmStore.film.views} views
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mt={2}
          >
            Rating:{" "}
            {manageFilmStore.film.rating !== 0 ? (
              <span
                style={
                  manageFilmStore.film.rating > 0
                    ? styles.posRat
                    : styles.negRat
                }
              >
                {manageFilmStore.film.rating}
              </span>
            ) : (
              <span>not determined</span>
            )}
          </Typography>
        </Box>
      </Box>
      <Box sx={styles.filmBox}>
        <video
          src={`${apiLink}/manageFilms/getFilmByFilename/${manageFilmStore.film.filename}`}
          controls
          preload="metadata"
          style={styles.film}
        />
      </Box>
      <Box sx={styles.commentBox}>
        <CommentBox />
      </Box>
    </Box>
  );
});
