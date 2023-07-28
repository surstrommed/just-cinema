export const ROUTES = {
  main: "/",
  mainWithPage: "/:page",
  profile: "/profile",
  signin: "/signin",
  signup: "/signup",
  adminPanel: "/adminpanel",
  adminPanelCreateAdmin: "/adminpanel/createadmin",
  adminPanelCreateActor: "/adminpanel/createactor",
  adminPanelCreateContent: "/adminpanel/createcontent",
  filmsByCategory: "/films/category/:categoryId/:page",
  film: "/films/:filmId",
  watchLater: "/watchLater/:page",
  actors: "/actors/:page",
};

export const ADMIN_PANEL_ROUTES = [
  ROUTES.adminPanel,
  ROUTES.adminPanelCreateAdmin,
  ROUTES.adminPanelCreateContent,
];
export const ONLY_AUTHORIZED_ROUTES = [
  ROUTES.profile,
  ...ADMIN_PANEL_ROUTES,
  ROUTES.watchLater,
];
export const ONLY_NOT_AUTHORIZED_ROUTES = [ROUTES.signin, ROUTES.signup];
export const PUBLIC_ROUTES = [
  ROUTES.main,
  ROUTES.mainWithPage,
  ROUTES.filmsByCategory,
  ROUTES.film,
];
