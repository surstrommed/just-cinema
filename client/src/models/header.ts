import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";

export interface IAppBar extends MuiAppBarProps {
  sidebarwidth: number;
  open?: boolean;
}
