import { styled } from "@mui/material/styles";

interface IComponentWrapper {
  sidebarwidth: number;
  open?: boolean;
}

export const ComponentWrapper = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})<IComponentWrapper>(({ theme, open, sidebarwidth }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${sidebarwidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));
