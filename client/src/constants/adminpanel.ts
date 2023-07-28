import { SUPER_ADMIN_ROLE, ADMIN_ROLE } from "./common";
import { ROUTES } from "./routes";

export const ADMIN_DASHBOARD = "Dashboard";
export const CREATE_ADMIN = "Create admin";
export const CREATE_ACTOR = "Create actor";
export const CREATE_CONTENT = "Create content";

export const onlySuperAdminAccess = [SUPER_ADMIN_ROLE];
export const allAdminsAccess = [SUPER_ADMIN_ROLE, ADMIN_ROLE];

export const adminPanelSections = {
  [ADMIN_DASHBOARD]: {
    access: allAdminsAccess,
    route: [ROUTES.adminPanel],
  },
  [CREATE_ADMIN]: {
    access: onlySuperAdminAccess,
    route: [ROUTES.adminPanelCreateAdmin],
  },
  [CREATE_ACTOR]: {
    access: allAdminsAccess,
    route: [ROUTES.adminPanelCreateActor],
  },
  [CREATE_CONTENT]: {
    access: allAdminsAccess,
    route: [ROUTES.adminPanelCreateContent],
  },
};
