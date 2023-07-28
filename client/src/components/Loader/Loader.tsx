import { FC, useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { ILoader } from "models/loader";

export const Loader: FC<ILoader> = ({ isLoading }) => {
  const [openBackdrop, setOpenBackdrop] = useState(isLoading);
  const handleToggleBackdrop = () => {
    setOpenBackdrop(!open);
  };

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={openBackdrop}
      onClick={handleToggleBackdrop}
    >
      <CircularProgress color="secondary" />
    </Backdrop>
  );
};
