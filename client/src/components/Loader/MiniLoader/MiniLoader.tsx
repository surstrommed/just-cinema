import React, { useState, useEffect, FC } from "react";
import { InfinitySpin } from "react-loader-spinner";
import { DARK_THEME, LOADER_TIMEOUT } from "constants/common";
import { IMiniLoader } from "models/loader";
import { teal } from "@mui/material/colors";
import { TableCell, useTheme } from "@mui/material";

export const MiniLoader: FC<IMiniLoader> = ({
  style,
  time,
  afterload,
  cell,
}) => {
  const theme = useTheme();
  const [seconds, setSeconds] = useState(time || LOADER_TIMEOUT);

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setSeconds(0);
    }
  }, [seconds]);

  useEffect(() => {
    if (time) {
      setSeconds(time);
    }
  }, [afterload]);

  const Loader = () => {
    if (cell) {
      return <TableCell>Loading...</TableCell>;
    } else {
      return (
        <InfinitySpin
          width="100"
          color={theme.palette.mode === DARK_THEME ? teal[300] : teal[900]}
        />
      );
    }
  };

  if (cell) {
    if (seconds > 0) {
      return <Loader />;
    } else {
      return <TableCell>Not uploaded</TableCell>;
    }
  } else if (style) {
    return (
      <div style={style}>{seconds > 0 ? <Loader /> : <>{afterload}</>}</div>
    );
  } else return <Loader />;
};
