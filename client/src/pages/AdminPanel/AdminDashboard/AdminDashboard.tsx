import { useContext, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { EnhancedTableToolbar } from "components/Table/EnhancedTableToolbar";
import { EnhancedTableHead } from "components/Table/EnhancedTableHead";
import {
  adminsTableHead,
  filmsTableHead,
  categoriesTableHead,
} from "constants/table";
import { strCapitalize, strTrunc } from "utils";
import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Typography,
  Link,
  TablePagination,
  useTheme,
} from "@mui/material";
import {
  DONE_STORE_STATUS,
  IDLE_STORE_STATUS,
  PENDING_STORE_STATUS,
} from "constants/store";
import { observer } from "mobx-react-lite";
import { useStore } from "store/store";
import { notify } from "utils/helpers/helpers";
import { MiniLoader } from "components/Loader/MiniLoader";
import { FILM_DISPLAY_LIMIT } from "constants/common";
import { SortModeContext } from "App";

const styles = {
  noAdmins: {
    mt: 5,
    textAlign: "center",
  },
  adminTableBox: {
    flex: "1 1 100%",
    p: "2rem",
  },
  noFilms: {
    mt: 5,
    textAlign: "center",
  },
  filmTableBox: {
    flex: "1 1 100%",
    p: "2rem",
  },
  filmBox: {
    width: 400,
  },
  categoryTableBox: {
    flex: "1 1 100%",
    p: "2rem",
  },
  noCategories: {
    mt: 5,
    textAlign: "center",
  },
  loader: {
    textAlign: "center",
    marginTop: "2rem",
  },
};

export const AdminDashboard = observer(() => {
  const { manageAdminsStore, manageFilmStore, manageCategoryStore } =
    useStore();

  const theme = useTheme();
  const { filmSort } = useContext(SortModeContext);

  const [adminsManaged, setAdminsManaged] = useState(false);
  const [filmsManaged, setFilmsManaged] = useState(false);
  const [categoriesManaged, setCategoriesManaged] = useState(false);
  const [filmsPage, setFilmsPage] = useState(0);

  const filmsPages = Math.ceil(
    (manageFilmStore?.films?.totalFilms || 0) / FILM_DISPLAY_LIMIT
  );

  const handleDeleteAdmin = (adminId: string) => {
    manageAdminsStore.deleteAdmin(adminId);
    setAdminsManaged(true);
  };

  const handleDeleteFilm = async (filmId: string, filename: string) => {
    manageFilmStore.deleteFilm(filmId, filename);
    setFilmsManaged(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    manageCategoryStore.deleteCategory(categoryId);
    setCategoriesManaged(true);
  };

  const handleChangeFilmsPage = (event: unknown, newPage: number) => {
    setFilmsPage(newPage);
  };

  useEffect(() => {
    if (
      adminsManaged ||
      (!manageAdminsStore.admins &&
        manageAdminsStore.statuses.getAdmins === IDLE_STORE_STATUS)
    ) {
      manageAdminsStore.getAdmins();
      if (adminsManaged) {
        setAdminsManaged(false);
      }
    }
  }, [manageAdminsStore.admins, adminsManaged]);

  useEffect(() => {
    if (
      filmsManaged ||
      (!manageFilmStore.films &&
        manageFilmStore.statuses.getFilms !== PENDING_STORE_STATUS)
    ) {
      manageFilmStore.getFilms(
        FILM_DISPLAY_LIMIT,
        filmsPage + 1,
        filmSort.sortType,
        filmSort.sortOrder
      );
      if (filmsManaged) {
        setFilmsManaged(false);
      }
    }
  }, [manageFilmStore.films, filmsManaged]);

  useEffect(() => {
    if (
      filmsPage >= 0 &&
      manageFilmStore.statuses.getFilms === DONE_STORE_STATUS
    ) {
      manageFilmStore.getFilms(
        FILM_DISPLAY_LIMIT,
        filmsPage + 1,
        filmSort.sortType,
        filmSort.sortOrder
      );
    }
  }, [filmsPage]);

  useEffect(() => {
    if (
      categoriesManaged ||
      (!manageCategoryStore.categories &&
        manageCategoryStore.statuses.getCategories === IDLE_STORE_STATUS)
    ) {
      manageCategoryStore.getCategories();
      if (categoriesManaged) {
        setCategoriesManaged(false);
      }
    }
  }, [manageCategoryStore.categories, categoriesManaged]);

  useEffect(() => {
    if (manageAdminsStore.responseMessage) {
      notify({
        text: manageAdminsStore.responseMessage,
        theme: theme.palette.mode,
      });
      manageAdminsStore.getAdmins();
      manageAdminsStore.handleResponseMessage(null);
    }
  }, [manageAdminsStore.responseMessage]);

  useEffect(() => {
    if (manageFilmStore.responseMessage) {
      notify({
        text: manageFilmStore.responseMessage,
        theme: theme.palette.mode,
      });
      manageFilmStore.getFilms(
        FILM_DISPLAY_LIMIT,
        filmsPage + 1,
        filmSort.sortType,
        filmSort.sortOrder
      );
      manageFilmStore.handleResponseMessage(null);
    }
  }, [manageFilmStore.responseMessage]);

  useEffect(() => {
    if (manageCategoryStore.responseMessage) {
      notify({
        text: manageCategoryStore.responseMessage,
        theme: theme.palette.mode,
      });
      manageCategoryStore.getCategories();
      manageCategoryStore.handleResponseMessage(null);
    }
  }, [manageCategoryStore.responseMessage]);

  return (
    <Box>
      <Box sx={styles.adminTableBox}>
        {manageAdminsStore.admins?.length ? (
          <Paper>
            <EnhancedTableToolbar numSelected={0} title="Admins" />
            <TableContainer>
              <Table aria-labelledby="tableTitle">
                <EnhancedTableHead headCells={adminsTableHead} />
                <TableBody>
                  {manageAdminsStore.admins.map((admin) => (
                    <TableRow hover tabIndex={-1} key={admin.id}>
                      <TableCell>{admin.name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{strCapitalize(admin.role)}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleDeleteAdmin(admin.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ) : (
          <MiniLoader
            style={styles.loader}
            afterload={
              <Typography variant="h5" sx={styles.noAdmins}>
                Currently there are no admins
              </Typography>
            }
          />
        )}
      </Box>
      <Box sx={styles.filmTableBox}>
        {manageFilmStore.films?.data?.length ? (
          <Paper>
            <EnhancedTableToolbar numSelected={0} title="Films" />
            <TableContainer>
              <Table aria-labelledby="tableTitle">
                <EnhancedTableHead headCells={filmsTableHead} />
                <TableBody>
                  {manageFilmStore.films.data.map((film) => (
                    <TableRow hover tabIndex={-1} key={film.id}>
                      <TableCell>{film.title}</TableCell>
                      <TableCell>{strTrunc(film.description, 100)}</TableCell>
                      <TableCell>{film.categoryInfo.name}</TableCell>
                      <TableCell>{film.views}</TableCell>
                      <TableCell>
                        <Box>
                          {film.filename ? (
                            <Link
                              href={`/films/${film.id}`}
                              color="inherit"
                              underline="always"
                              target="_blank"
                              rel="noopener"
                            >
                              Link
                            </Link>
                          ) : (
                            <Typography>Film not found</Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() =>
                            handleDeleteFilm(film.id, film.filename)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {filmsPages > 1 && (
              <TablePagination
                component="div"
                rowsPerPageOptions={[FILM_DISPLAY_LIMIT]}
                rowsPerPage={FILM_DISPLAY_LIMIT - 1}
                count={filmsPages}
                page={filmsPage}
                onPageChange={handleChangeFilmsPage}
              />
            )}
          </Paper>
        ) : (
          <MiniLoader
            style={styles.loader}
            afterload={
              <Typography variant="h5" sx={styles.noFilms}>
                Currently there are no films
              </Typography>
            }
          />
        )}
      </Box>
      <Box sx={styles.categoryTableBox}>
        {manageCategoryStore.categories?.length ? (
          <Paper>
            <EnhancedTableToolbar numSelected={0} title="Categories" />
            <TableContainer>
              <Table aria-labelledby="tableTitle">
                <EnhancedTableHead headCells={categoriesTableHead} />
                <TableBody>
                  {manageCategoryStore.categories.map((category) => (
                    <TableRow hover tabIndex={-1} key={category.id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ) : (
          <MiniLoader
            style={styles.loader}
            afterload={
              <Typography variant="h5" sx={styles.noCategories}>
                Currently there are no categories
              </Typography>
            }
          />
        )}
      </Box>
    </Box>
  );
});
