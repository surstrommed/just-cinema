import { useState, SyntheticEvent, useContext, FC } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import { SortOrder, SortType } from "models/sorting";
import { SortModeContext } from "App";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getPage } from "utils";
import { ISorting } from "models/sorting";
import { LOCAL_STORAGE_FILM_SORT } from "constants/common";

const styles = {
  main: {
    flex: "1 1 100%",
  },
  dialogContent: { display: "flex", flexWrap: "wrap" },
  formControl: { m: 1, minWidth: 120 },
  inputProps: { "aria-label": "Without label" },
};

export const FilmsSorting: FC<ISorting> = ({ dataLength }) => {
  const { filmSort, handleSort } = useContext(SortModeContext);

  const { page } = useParams();
  const pageNumber = getPage(page);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [sortType, setSortType] = useState<SortType>(filmSort.sortType);
  const [sortOrder, setSortOrder] = useState<SortOrder>(filmSort.sortOrder);
  const [isResetPage, setResetPage] = useState(false);

  const handleChangeType = (event: SelectChangeEvent<SortType>) => {
    setSortType(event.target.value as SortType);
  };

  const handleChangeOrder = (event: SelectChangeEvent<SortOrder>) => {
    setSortOrder(event.target.value as SortOrder);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event: SyntheticEvent<unknown>, reason?: string) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };

  const handleResetPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResetPage(event.target.checked);
  };

  const handleSubmit = () => {
    if (isResetPage) {
      const pathArray = pathname.split("/").slice(0, -1);
      pathArray.push("1");
      const resultPath = pathArray.join("/");
      navigate(resultPath);
    }
    handleSort(LOCAL_STORAGE_FILM_SORT, sortType, sortOrder);
  };

  return (
    <>
      {(pageNumber === 1 && dataLength > 1) || pageNumber !== 1 ? (
        <Box sx={styles.main}>
          <Button
            onClick={handleClickOpen}
            color="secondary"
            endIcon={<SortIcon />}
          >
            Sorting
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Choose film sorting</DialogTitle>
            <DialogContent>
              <Box component="form" sx={styles.dialogContent}>
                <FormControl sx={styles.formControl}>
                  <Select
                    value={sortType}
                    onChange={handleChangeType}
                    displayEmpty
                    inputProps={styles.inputProps}
                    color="secondary"
                  >
                    <MenuItem value="upload">By upload date</MenuItem>
                    <MenuItem value="year">By release year</MenuItem>
                    <MenuItem value="rating">By rating</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={styles.formControl}>
                  <Select
                    value={sortOrder}
                    onChange={handleChangeOrder}
                    displayEmpty
                    inputProps={styles.inputProps}
                    color="secondary"
                  >
                    <MenuItem value="desc">Descending</MenuItem>
                    <MenuItem value="asc">Ascending</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {page && pageNumber !== 1 && (
                <Box>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isResetPage}
                          onChange={handleResetPage}
                          color="secondary"
                        />
                      }
                      label="Start from the first page"
                    />
                  </FormGroup>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleSubmit} color="secondary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};
