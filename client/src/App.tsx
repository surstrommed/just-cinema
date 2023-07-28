import "react-toastify/dist/ReactToastify.css";
import { createContext, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { teal } from "@mui/material/colors";
import { ToastContainer } from "react-toastify";
import { Layout } from "components/Layout";
import { CssBaseline } from "@mui/material";
import { storagePersister } from "utils/persister/persister";
import {
  DARK_THEME,
  defaultFilmSort,
  defaultActorSort,
  LIGHT_THEME,
  LOCAL_STORAGE_FILM_SORT,
  LOCAL_STORAGE_ACTOR_SORT,
  LOCAL_STORAGE_THEME,
} from "constants/common";
import { ThemeMode } from "models/theme";
import { themeModeToggle } from "utils";
import { IAdminSidebarContext } from "models/adminpanel";
import { ADMIN_PANEL_ROUTES } from "constants/routes";
import {
  ISort,
  ISortContext,
  SortKey,
  SortOrder,
  SortType,
} from "models/sorting";

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const AdminSidebarContext = createContext<IAdminSidebarContext>({
  isAdminSidebarOpened: false,
  toggleAdminSidebar: () => {},
});

const initialSort = (key: SortKey) =>
  (storagePersister.getPersistedItem(key, true) as ISort | null) ||
  (key === LOCAL_STORAGE_FILM_SORT ? defaultFilmSort : defaultActorSort);

export const SortModeContext = createContext<ISortContext>({
  filmSort: initialSort(LOCAL_STORAGE_FILM_SORT),
  actorSort: initialSort(LOCAL_STORAGE_ACTOR_SORT),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleSort: (sortKey: string, sortType: SortType, sortOrder: SortOrder) => {},
});

export const sidebarWidth = 240;

const App = () => {
  const { pathname } = useLocation();

  const [mode, setMode] = useState<ThemeMode>(
    (storagePersister.getPersistedItem(
      LOCAL_STORAGE_THEME
    ) as ThemeMode | null) || LIGHT_THEME
  );

  const [filmSort, setFilmSort] = useState<ISort>(
    initialSort(LOCAL_STORAGE_FILM_SORT)
  );

  const [actorSort, setActorSort] = useState<ISort>(
    initialSort(LOCAL_STORAGE_ACTOR_SORT)
  );

  const [isAdminSidebarOpened, setAdminSidebarOpened] = useState(
    ADMIN_PANEL_ROUTES.includes(pathname) ? true : false
  );

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        storagePersister.persistItem(
          LOCAL_STORAGE_THEME,
          themeModeToggle(mode)
        );
        setMode((prevMode) => themeModeToggle(prevMode));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: mode === DARK_THEME ? "#000" : "#fff",
          },
          secondary: {
            main: mode === DARK_THEME ? teal[300] : teal[900],
          },
          info: {
            main: mode === DARK_THEME ? "#000" : "#d3d3d3",
          },
          mode,
        },
      }),
    [mode]
  );

  const toggleAdminSidebar = () => {
    setAdminSidebarOpened((prevState) => !prevState);
  };

  const adminSidebarValues = {
    isAdminSidebarOpened,
    toggleAdminSidebar,
  };

  const handleSort = (
    sortKey: SortKey,
    sortType: SortType,
    sortOrder: SortOrder
  ) => {
    const storeState = { sortType, sortOrder };
    storagePersister.persistItem(sortKey, JSON.stringify(storeState));
    switch (sortKey) {
      case LOCAL_STORAGE_FILM_SORT:
        setFilmSort(storeState);
        break;
      case LOCAL_STORAGE_ACTOR_SORT:
        setActorSort(storeState);
        break;
    }
  };

  const sortValues = {
    filmSort,
    actorSort,
    handleSort,
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <AdminSidebarContext.Provider value={adminSidebarValues}>
        <SortModeContext.Provider value={sortValues}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ToastContainer />
            <Layout />
          </ThemeProvider>
        </SortModeContext.Provider>
      </AdminSidebarContext.Provider>
    </ColorModeContext.Provider>
  );
};

export default App;
