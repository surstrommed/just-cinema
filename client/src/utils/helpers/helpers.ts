import { INotify } from "models/notify";
import { toast } from "react-toastify";

export const notify = ({
  text,
  type = "success",
  position = "top-right",
  autoClose = 1000,
  theme = "light",
  pauseOnHover = true,
  draggable = true,
}: INotify) =>
  toast[type](text, {
    position,
    autoClose,
    theme,
    pauseOnHover,
    draggable,
  });

const { REACT_APP_DEV_API, REACT_APP_PROD_API } = process.env;

export const isDevEnv = process.env.NODE_ENV !== "production";

export const apiLink = isDevEnv ? REACT_APP_DEV_API : REACT_APP_PROD_API;
