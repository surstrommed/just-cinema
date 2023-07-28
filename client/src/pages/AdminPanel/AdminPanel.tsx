import { useEffect } from "react";
import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import {
  adminPanelSections,
  ADMIN_DASHBOARD,
  CREATE_ACTOR,
  CREATE_ADMIN,
  CREATE_CONTENT,
} from "constants/adminpanel";
import { CreateAdmin } from "./CreateAdmin";
import { CreateFilm } from "./CreateFilm";
import { useStore } from "store/store";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "constants/routes";
import { IAdminSectionsKey } from "models/adminpanel";
import { AdminDashboard } from "./AdminDashboard";
import { CreateActor } from "./CreateActor";

export const AdminPanel = observer(() => {
  const { userStore } = useStore();
  const userRole = userStore.user?.role || "";

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const sectionKeys = Object.keys(adminPanelSections) as IAdminSectionsKey[];

  useEffect(() => {
    const sectionByRoute = sectionKeys.find((sectionKey) =>
      adminPanelSections[sectionKey].route.includes(pathname)
    );
    if (sectionByRoute) {
      if (!adminPanelSections[sectionByRoute].access.includes(userRole)) {
        navigate(ROUTES.adminPanel);
      }
    } else {
      navigate(ROUTES.main);
    }
  }, [pathname, userRole]);

  return (
    <Box>
      <Box>
        {adminPanelSections[ADMIN_DASHBOARD].route.includes(pathname) && (
          <AdminDashboard />
        )}
        {adminPanelSections[CREATE_ADMIN].route.includes(pathname) && (
          <CreateAdmin />
        )}
        {adminPanelSections[CREATE_ACTOR].route.includes(pathname) && (
          <CreateActor />
        )}
        {adminPanelSections[CREATE_CONTENT].route.includes(pathname) && (
          <CreateFilm />
        )}
      </Box>
    </Box>
  );
});
