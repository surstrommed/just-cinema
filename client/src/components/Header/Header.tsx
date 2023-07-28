import {
  useState,
  useEffect,
  useContext,
  FC,
  Fragment,
  ChangeEvent,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import {
  Container,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  Button,
  Tooltip,
  useTheme,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  InputAdornment,
} from "@mui/material";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import MenuIcon from "@mui/icons-material/Menu";
import {
  ADMIN_ROLE,
  AUTH_PROFILE_ITEMS,
  DARK_THEME,
  FILM_DISPLAY_LIMIT,
  GUEST_PROFILE_ITEMS,
  PROJECT_NAME,
  SEARCH_FILM_QUERY_KEY,
  SUPER_ADMIN_ROLE,
} from "constants/common";
import { ADMIN_PANEL_ROUTES, ROUTES } from "constants/routes";
import { observer } from "mobx-react-lite";
import { useStore } from "store/store";
import { useJwt } from "react-jwt";
import { getPage, parsedStoredUser } from "utils";
import {
  AdminSidebarContext,
  ColorModeContext,
  sidebarWidth,
  SortModeContext,
} from "App";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import WidgetsIcon from "@mui/icons-material/Widgets";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { AdminSidebarHeader } from "components/AdminSidebar/AdminSidebarHeader";
import { AppBar } from "./AppBar";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  ADMIN_DASHBOARD,
  allAdminsAccess,
  CREATE_ACTOR,
  CREATE_ADMIN,
  CREATE_CONTENT,
  onlySuperAdminAccess,
} from "constants/adminpanel";
import SourceIcon from "@mui/icons-material/Source";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SearchIcon from "@mui/icons-material/Search";
import FaceIcon from "@mui/icons-material/Face";
import queryString from "query-string";
import { PENDING_STORE_STATUS } from "constants/store";
import { mainWithPage } from "constants/regexps";

const pages = [] as const;

const styles = {
  mainBox: { display: "flex", mt: 5 },
  smallHeaderIcon: { display: { xs: "flex", md: "none" }, mr: 1 },
  bigHeaderIcon: { display: { xs: "none", md: "flex" }, mr: 1 },
  bigHeaderProjectName: {
    mr: 2,
    display: { xs: "none", md: "flex" },
    fontFamily: "Helvetica",
    fontWeight: 700,
    letterSpacing: ".3rem",
    color: "inherit",
    textDecoration: "none",
  },
  smallHeaderProjectName: {
    mr: 2,
    display: { xs: "flex", md: "none" },
    flexGrow: 1,
    fontFamily: "monospace",
    fontWeight: 700,
    letterSpacing: ".3rem",
    color: "inherit",
    textDecoration: "none",
  },
  smallHeaderPages: { flexGrow: 1, display: { xs: "flex", md: "none" } },
  smallHeaderPage: { my: 2, color: "white", display: "block" },
  bigHeaderPages: { flexGrow: 1, display: { xs: "none", md: "flex" } },
  pagesNav: {
    display: { xs: "block", md: "none" },
  },
  profile: { display: "flex", alignItems: "center" },
  profileMenu: { mt: "45px" },
  profileIcon: { p: 0 },
  themeBtn: { mr: 3 },
};

const adminSidebarItems = [
  {
    id: 1,
    text: ADMIN_DASHBOARD,
    Icon: DashboardIcon,
    route: ROUTES.adminPanel,
    visibility: allAdminsAccess,
  },
  {
    id: 2,
    text: CREATE_ADMIN,
    Icon: AssignmentIndIcon,
    route: ROUTES.adminPanelCreateAdmin,
    visibility: onlySuperAdminAccess,
  },
  {
    id: 3,
    text: CREATE_ACTOR,
    Icon: FaceIcon,
    route: ROUTES.adminPanelCreateActor,
    visibility: allAdminsAccess,
  },
  {
    id: 4,
    text: CREATE_CONTENT,
    Icon: SourceIcon,
    route: ROUTES.adminPanelCreateContent,
    visibility: allAdminsAccess,
  },
];

export const Header: FC = observer(() => {
  const { userStore, manageFilmStore } = useStore();
  const { decodedToken, isExpired } = useJwt(parsedStoredUser?.token || "");

  const { filmSort } = useContext(SortModeContext);
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { isAdminSidebarOpened, toggleAdminSidebar } =
    useContext(AdminSidebarContext);
  const isMobileView = useMediaQuery("(max-width:750px)");

  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const parsedSearchedQuery =
    queryString.parse(search)?.[SEARCH_FILM_QUERY_KEY];
  const isHaveFilmSearchQuery = typeof parsedSearchedQuery === "string";
  const { page } = useParams();
  const pageNumber = getPage(page);

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [searchedValue, setSearchedValue] = useState<string>(
    isHaveFilmSearchQuery ? parsedSearchedQuery : ""
  );

  const isAdmin =
    userStore.user?.role === SUPER_ADMIN_ROLE ||
    userStore.user?.role === ADMIN_ROLE;
  const isSearchBtnDisabled =
    (!parsedSearchedQuery && !searchedValue) ||
    (isHaveFilmSearchQuery &&
      !!searchedValue &&
      parsedSearchedQuery === searchedValue);

  const handleLogout = () => {
    userStore.logout();
  };

  const handleSearchedValue = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchedValue(event.target.value || "");
  };

  const handleSearch = () => {
    if (searchedValue) {
      navigate(`/1?${SEARCH_FILM_QUERY_KEY}=${searchedValue}`);
    } else {
      navigate(ROUTES.main);
    }
  };

  const profileMenuClickHandlers: {
    [status: string]: { [id: number]: () => void };
  } = {
    forGuests: {
      1: () => {
        navigate(ROUTES.signin);
      },
      2: () => {
        navigate(ROUTES.signup);
      },
    },
    forUsers: {
      1: () => {
        navigate(ROUTES.profile);
      },
      2: () => {
        navigate("/watchLater/1");
      },
      3: handleLogout,
    },
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    if (
      manageFilmStore.statuses[
        isHaveFilmSearchQuery ? "getSearchedFilms" : "getFilms"
      ] !== PENDING_STORE_STATUS &&
      (pathname === ROUTES.main || mainWithPage.test(pathname))
    ) {
      if (isHaveFilmSearchQuery) {
        manageFilmStore.getSearchedFilms(
          FILM_DISPLAY_LIMIT,
          pageNumber,
          parsedSearchedQuery,
          filmSort.sortType,
          filmSort.sortOrder
        );
      } else {
        manageFilmStore.getFilms(
          FILM_DISPLAY_LIMIT,
          1,
          filmSort.sortType,
          filmSort.sortOrder
        );
      }
    }
  }, [parsedSearchedQuery]);

  useEffect(() => {
    if (isExpired && decodedToken && Object.keys(decodedToken)?.length) {
      handleLogout();
    }
  }, [decodedToken, isExpired]);

  useEffect(() => {
    if (!isAdminSidebarOpened && ADMIN_PANEL_ROUTES.includes(pathname)) {
      toggleAdminSidebar();
    }
  }, [pathname]);

  return (
    <Box sx={styles.mainBox}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: {
            sm: isAdminSidebarOpened
              ? `calc(100% - ${sidebarWidth}px)`
              : "100%",
          },
          ml: { sm: `${sidebarWidth}px` },
        }}
        sidebarwidth={sidebarWidth}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {isAdmin && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={toggleAdminSidebar}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(isAdminSidebarOpened &&
                    !isMobileView && { display: "none" }),
                }}
              >
                <WidgetsIcon />
              </IconButton>
            )}
            <SlideshowIcon sx={styles.bigHeaderIcon} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href={ROUTES.main}
              sx={styles.bigHeaderProjectName}
            >
              {PROJECT_NAME}
            </Typography>
            <Box sx={styles.bigHeaderPages}>
              {!!pages?.length && (
                <>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  {anchorElNav && (
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorElNav}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      open={!!anchorElNav}
                      onClose={handleCloseNavMenu}
                      sx={styles.pagesNav}
                    >
                      {pages.map((page) => (
                        <MenuItem key={page} onClick={handleCloseNavMenu}>
                          <Typography textAlign="center">{page}</Typography>
                        </MenuItem>
                      ))}
                    </Menu>
                  )}
                </>
              )}
            </Box>
            <SlideshowIcon sx={styles.smallHeaderIcon} />
            <Typography
              noWrap
              component="a"
              href={ROUTES.main}
              sx={styles.smallHeaderProjectName}
            >
              {PROJECT_NAME}
            </Typography>
            <Box sx={styles.smallHeaderPages}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={styles.smallHeaderPage}
                >
                  {page}
                </Button>
              ))}
            </Box>
            <Box sx={styles.profile}>
              <Box sx={{ display: "flex", alignItems: "center", mr: 3 }}>
                <TextField
                  label="Search..."
                  variant="filled"
                  size="small"
                  color="secondary"
                  value={searchedValue}
                  onChange={handleSearchedValue}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleSearch}
                          disabled={isSearchBtnDisabled}
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <IconButton
                onClick={colorMode.toggleColorMode}
                color={
                  theme.palette.mode === DARK_THEME ? "inherit" : "secondary"
                }
                sx={styles.themeBtn}
              >
                {theme.palette.mode === DARK_THEME ? (
                  <Brightness7Icon />
                ) : (
                  <Brightness4Icon />
                )}
              </IconButton>
              <Tooltip title="Open profile">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={styles.profileIcon}
                >
                  <MenuIcon />
                </IconButton>
              </Tooltip>
              {anchorElUser && (
                <Menu
                  sx={styles.profileMenu}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={!!anchorElUser}
                  onClose={handleCloseUserMenu}
                >
                  {(userStore.user
                    ? AUTH_PROFILE_ITEMS
                    : GUEST_PROFILE_ITEMS
                  ).map((item) => (
                    <MenuItem
                      key={item.id}
                      onClick={() => {
                        profileMenuClickHandlers[
                          userStore.user ? "forUsers" : "forGuests"
                        ][item.id]();
                        handleCloseUserMenu();
                      }}
                    >
                      <Typography textAlign="center">{item.value}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: sidebarWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={isAdminSidebarOpened}
      >
        <AdminSidebarHeader>
          <Typography
            sx={{ marginLeft: "auto", marginRight: "auto" }}
            variant="h6"
          >
            Admin sidebar
          </Typography>
          <IconButton onClick={toggleAdminSidebar}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </AdminSidebarHeader>
        <Divider />
        <List>
          {adminSidebarItems.map(({ id, text, Icon, route, visibility }) => (
            <Fragment key={id}>
              {visibility.includes(userStore.user?.role || "") && (
                <ListItem disablePadding onClick={() => navigate(route)}>
                  <ListItemButton
                    sx={{
                      backgroundColor:
                        pathname === route
                          ? theme.palette.secondary.main
                          : "inherit",
                      color:
                        pathname === route
                          ? theme.palette.primary.main
                          : "inherit",
                      "&:hover": {
                        color: "inherit",
                        backgroundColor: theme.palette.info.main,
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Icon />
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              )}
            </Fragment>
          ))}
        </List>
      </Drawer>
    </Box>
  );
});
