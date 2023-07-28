import { FC } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { IAdminSidebar } from "models/adminpanel";
import { AdminSidebarHeader } from "./AdminSidebarHeader";

export const AdminSidebar: FC<IAdminSidebar> = ({ header, content }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {header}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AdminSidebarHeader />
        {content}
      </Box>
    </Box>
  );
};
