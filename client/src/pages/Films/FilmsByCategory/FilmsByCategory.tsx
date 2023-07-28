import { useContext, useEffect } from "react";
import { useStore } from "store/store";
import { Box, Pagination, Typography } from "@mui/material";
import { FilmCard } from "components/FilmCard";
import { MiniLoader } from "components/Loader/MiniLoader";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { PENDING_STORE_STATUS } from "constants/store";
import { getPage } from "utils";
import { FILM_DISPLAY_LIMIT } from "constants/common";
import { NO_FILMS } from "constants/messages";
import { FilmsSorting } from "components/Sorting/FilmsSorting";
import { SortModeContext } from "App";

const styles = {
  pagination: {
    display: "flex",
    justifyContent: "center",
  },
  loader: {
    display: "flex",
    justifyContent: "center",
  },
};

export const FilmsByCategory = observer(() => {
  const { manageFilmStore } = useStore();
  const { filmSort } = useContext(SortModeContext);

  const navigate = useNavigate();
  const { categoryId, page } = useParams();
  const pageNumber = getPage(page);
  const pages = Math.ceil(
    (manageFilmStore?.filmsByCategory?.totalFilms || 0) / FILM_DISPLAY_LIMIT
  );

  const handlePagination = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    navigate(`/films/category/${categoryId}/${page}`);
  };

  useEffect(() => {
    if (
      categoryId &&
      pageNumber &&
      manageFilmStore.statuses.getFilmsByCategory !== PENDING_STORE_STATUS
    ) {
      manageFilmStore.getFilmsByCategory(
        categoryId,
        FILM_DISPLAY_LIMIT,
        pageNumber,
        filmSort.sortType,
        filmSort.sortOrder
      );
    }
  }, [categoryId, pageNumber, filmSort]);

  if (
    !manageFilmStore.filmsByCategory ||
    manageFilmStore.statuses.getFilmsByCategory === PENDING_STORE_STATUS
  ) {
    return <MiniLoader style={styles.loader} />;
  }

  return (
    <Box>
      <Typography variant="h4" textAlign="center" mb={5}>
        Films in category:{" "}
        {manageFilmStore.filmsByCategory.data[0].categoryInfo.name}
      </Typography>
      <FilmsSorting dataLength={manageFilmStore.filmsByCategory.data.length} />
      {manageFilmStore.filmsByCategory?.data?.length ? (
        <Box>
          {manageFilmStore.filmsByCategory.data.map((film) => (
            <FilmCard film={film} key={film.id} />
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
        <MiniLoader
          time={10}
          style={{ textAlign: "center" }}
          afterload={
            <Typography variant="body2" textAlign="center" mt={5}>
              {NO_FILMS}
            </Typography>
          }
        />
      )}
    </Box>
  );
});
