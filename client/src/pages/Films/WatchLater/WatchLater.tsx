import { useContext, useEffect, useState } from "react";
import { Box, Pagination, Typography } from "@mui/material";
import { FilmCard } from "components/FilmCard";
import { observer } from "mobx-react-lite";
import { useStore } from "store/store";
import { MiniLoader } from "components/Loader/MiniLoader";
import { FILM_DISPLAY_LIMIT } from "constants/common";
import { useNavigate, useParams } from "react-router";
import { getPage, storeLoadingStatusDetector } from "utils";
import { NO_FILMS } from "constants/messages";
import { FilmsSorting } from "components/Sorting/FilmsSorting";
import { SortModeContext } from "App";

const styles = {
  main: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  loader: {
    display: "flex",
    justifyContent: "center",
  },
  header: {
    flex: "1 1 100%",
  },
  films: {
    flex: "1 1 100%",
    mt: 5,
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
  },
};

export const WatchLater = observer(() => {
  const { manageFilmStore } = useStore();
  const { filmSort } = useContext(SortModeContext);

  const navigate = useNavigate();
  const { page } = useParams();
  const pageNumber = getPage(page);
  const pages = Math.ceil(
    (manageFilmStore?.films?.totalFilms || 0) / FILM_DISPLAY_LIMIT
  );

  const [filmUpdated, setFilmUpdated] = useState(false);

  useEffect(() => {
    if (
      !storeLoadingStatusDetector(manageFilmStore.statuses) &&
      (filmUpdated || pageNumber)
    ) {
      manageFilmStore.getWatchLaterFilms(
        FILM_DISPLAY_LIMIT,
        pageNumber,
        filmSort.sortType,
        filmSort.sortOrder
      );
      if (filmUpdated) {
        setFilmUpdated(false);
      }
    }
  }, [filmUpdated, pageNumber, filmSort]);

  const handleFilmUpdate = () => {
    setFilmUpdated((prev) => !prev);
  };

  const handlePagination = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    navigate(`/watchLater/${page}`);
  };

  if (
    !manageFilmStore.films ||
    storeLoadingStatusDetector(manageFilmStore.statuses)
  ) {
    return (
      <MiniLoader
        time={10}
        style={styles.loader}
        afterload={<Typography variant="h5">Nothing was found</Typography>}
      />
    );
  }

  return (
    <Box sx={styles.main}>
      <Box sx={styles.header}>
        <Typography variant="h4" textAlign="center" mb={5}>
          Watch later playlist
        </Typography>
      </Box>
      <FilmsSorting dataLength={manageFilmStore.films.data.length} />
      <Box sx={styles.films}>
        {manageFilmStore.films?.data?.length ? (
          <Box>
            {manageFilmStore.films.data.map((film) => (
              <FilmCard
                film={film}
                watchLater
                handleFilmUpdate={handleFilmUpdate}
                key={film.id}
              />
            ))}
            <Pagination
              sx={styles.pagination}
              page={pageNumber}
              disabled={pages < 2}
              count={pages}
              onChange={handlePagination}
            />
          </Box>
        ) : (
          <Typography variant="h5" textAlign="center" mt={5}>
            {NO_FILMS}
          </Typography>
        )}
      </Box>
    </Box>
  );
});
