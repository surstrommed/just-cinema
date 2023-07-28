import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "store/store";
import { Typography, Box, Pagination } from "@mui/material";
import { FilmCard } from "components/FilmCard";
import { MiniLoader } from "components/Loader/MiniLoader";
import { FILM_DISPLAY_LIMIT, SEARCH_FILM_QUERY_KEY } from "constants/common";
import { useLocation, useNavigate, useParams } from "react-router";
import { getPage, storeLoadingStatusDetector } from "utils";
import { IUser } from "models/user";
import queryString from "query-string";
import { StoredFilmsData } from "models/film";
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
    marginTop: "3rem",
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
  headerText: (user: IUser | null) => ({
    margin: user ? "0 0 3rem 0" : "5rem 0 3rem 0",
  }),
};

export const AllFilms = observer(() => {
  const { manageFilmStore, userStore } = useStore();
  const { filmSort } = useContext(SortModeContext);
  const { search } = useLocation();
  const parsedSearchedQuery =
    queryString.parse(search)?.[SEARCH_FILM_QUERY_KEY];
  const isHaveFilmSearchQuery = typeof parsedSearchedQuery === "string";
  const allFilms = manageFilmStore.films;
  const searchedFilms = manageFilmStore.searchedFilms;

  const navigate = useNavigate();
  const { page } = useParams();
  const pageNumber = getPage(page);
  const pages = Math.ceil(
    (manageFilmStore?.[isHaveFilmSearchQuery ? "searchedFilms" : "films"]
      ?.totalFilms || 0) / FILM_DISPLAY_LIMIT
  );

  const [films, setFilms] = useState<StoredFilmsData | null>(null);

  const getAllFilms = (page: number) => {
    manageFilmStore.getFilms(
      FILM_DISPLAY_LIMIT,
      page,
      filmSort.sortType,
      filmSort.sortOrder
    );
  };

  const getSearchedFilms = (page: number, searchedValue: string) => {
    manageFilmStore.getSearchedFilms(
      FILM_DISPLAY_LIMIT,
      page,
      searchedValue,
      filmSort.sortType,
      filmSort.sortOrder
    );
  };

  const handlePagination = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    if (isHaveFilmSearchQuery) {
      navigate(`/${page}?${SEARCH_FILM_QUERY_KEY}=${parsedSearchedQuery}`);
    } else {
      navigate(`/${page}`);
    }
  };

  useEffect(() => {
    if (!storeLoadingStatusDetector(manageFilmStore.statuses)) {
      if (isHaveFilmSearchQuery) {
        getSearchedFilms(pageNumber, parsedSearchedQuery);
      } else {
        getAllFilms(pageNumber);
      }
    }
  }, [pageNumber, filmSort]);

  useEffect(() => {
    if (!storeLoadingStatusDetector(manageFilmStore.statuses)) {
      if (allFilms) {
        setFilms(allFilms);
      }
      if (searchedFilms) {
        setFilms(searchedFilms);
      }
    }
  }, [allFilms, searchedFilms]);

  if (!films || storeLoadingStatusDetector(manageFilmStore.statuses)) {
    return (
      <MiniLoader
        time={10}
        style={styles.loader}
        afterload={
          <Box>
            <Typography
              variant="h3"
              textAlign="center"
              sx={styles.headerText(userStore.user)}
            >
              All films
            </Typography>
            <Typography variant="h5" textAlign="center">
              Nothing was found
            </Typography>
          </Box>
        }
      />
    );
  }

  return (
    <Box sx={styles.main}>
      <Box sx={styles.header}>
        <Typography
          variant="h3"
          textAlign="center"
          sx={styles.headerText(userStore.user)}
        >
          All films
        </Typography>
      </Box>
      <FilmsSorting dataLength={films.data.length} />
      <Box sx={styles.films}>
        {films?.data?.length ? (
          <Box>
            {films.data.map((film) => (
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
          <Typography variant="h5" textAlign="center" mt={5}>
            {NO_FILMS}
          </Typography>
        )}
      </Box>
    </Box>
  );
});
