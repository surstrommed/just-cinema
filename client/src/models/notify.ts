import { ToastPosition, Theme } from "react-toastify";

type NotifyType = "success" | "error" | "info" | "warning";

export interface INotify {
  text: string;
  type?: NotifyType;
  position?: ToastPosition;
  autoClose?: number;
  theme?: Theme;
  pauseOnHover?: boolean;
  draggable?: boolean;
}
