import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "store/store";
import { Typography, Box, Pagination } from "@mui/material";
import { MiniLoader } from "components/Loader/MiniLoader";
import { ACTOR_DISPLAY_LIMIT, SEARCH_ACTOR_QUERY_KEY } from "constants/common";
import { useLocation, useNavigate, useParams } from "react-router";
import { getPage, storeLoadingStatusDetector } from "utils";
import { IUser } from "models/user";
import queryString from "query-string";
import { NO_ACTORS } from "constants/messages";
import { StoredActorsData } from "models/actor";
import { ActorCard } from "components/ActorCard";
import { ActorsSorting } from "components/Sorting/ActorsSotring";
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

export const AllActors = observer(() => {
  const { manageActorsStore, userStore } = useStore();
  const { actorSort } = useContext(SortModeContext);
  const { search } = useLocation();
  const parsedSearchedQuery =
    queryString.parse(search)?.[SEARCH_ACTOR_QUERY_KEY];
  const isHaveSearchQuery = typeof parsedSearchedQuery === "string";
  const allActors = manageActorsStore.actors;
  const searchedActors = manageActorsStore.searchedActors;

  const navigate = useNavigate();
  const { page } = useParams();
  const pageNumber = getPage(page);
  const pages = Math.ceil(
    (manageActorsStore?.[isHaveSearchQuery ? "searchedActors" : "actors"]
      ?.totalActors || 0) / ACTOR_DISPLAY_LIMIT
  );

  const [actors, setActors] = useState<StoredActorsData | null>(null);

  const getAllActors = (page: number) => {
    manageActorsStore.getActors(
      ACTOR_DISPLAY_LIMIT,
      page,
      actorSort.sortType,
      actorSort.sortOrder
    );
  };

  const getSearchedActors = (page: number, searchedValue: string) => {
    manageActorsStore.getSearchedActors(
      ACTOR_DISPLAY_LIMIT,
      page,
      searchedValue,
      actorSort.sortType,
      actorSort.sortOrder
    );
  };

  const handlePagination = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    if (isHaveSearchQuery) {
      navigate(`/${page}?${SEARCH_ACTOR_QUERY_KEY}=${parsedSearchedQuery}`);
    } else {
      navigate(`/${page}`);
    }
  };

  useEffect(() => {
    if (!storeLoadingStatusDetector(manageActorsStore.statuses)) {
      if (isHaveSearchQuery) {
        getSearchedActors(pageNumber, parsedSearchedQuery);
      } else {
        getAllActors(pageNumber);
      }
    }
  }, [pageNumber, actorSort]);

  useEffect(() => {
    if (!storeLoadingStatusDetector(manageActorsStore.statuses)) {
      if (allActors) {
        setActors(allActors);
      }
      if (searchedActors) {
        setActors(searchedActors);
      }
    }
  }, [allActors, searchedActors]);

  if (!actors || storeLoadingStatusDetector(manageActorsStore.statuses)) {
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
              All actors
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
          All actors
        </Typography>
      </Box>
      <ActorsSorting dataLength={actors.data.length} />
      <Box sx={styles.films}>
        {actors?.data?.length ? (
          <Box>
            {actors.data.map((actor) => (
              <ActorCard actor={actor} key={actor.id} />
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
            {NO_ACTORS}
          </Typography>
        )}
      </Box>
    </Box>
  );
});
