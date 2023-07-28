import { useState, useEffect, BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchemas } from "utils/validations/schemas";
import {
  Box,
  Grid,
  TextField,
  Button,
  Container,
  CssBaseline,
  Typography,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { observer } from "mobx-react-lite";
import { useStore } from "store/store";
import { PENDING_STORE_STATUS } from "constants/store";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { IManageFilmFormValues } from "models/film";
import { useFilePicker } from "use-file-picker";
import { CategoryOption } from "models/category";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "constants/routes";
import { blobToBase64, getYears } from "utils";

const styles = {
  createFilmBox: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  lockIcon: { m: 1, bgcolor: "secondary.main" },
  form: { mt: 3 },
  createFilmBtn: { mt: 3, mb: 2 },
  filmUploadBox: {
    height: "240px",
    border: "1px solid lightgray",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  videoMainBox: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  videoContentBox: { flex: "1 1 100%", justifyContent: "center", my: 5 },
  videoBox: {
    width: 400,
  },
  formControl: { minWidth: 120 },
  inputProps: { "aria-label": "Without label" },
};

const getVideoCover = (file: File, seekTo = 0.0): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const videoPlayer = document.createElement("video");
    videoPlayer.setAttribute("src", URL.createObjectURL(file));
    videoPlayer.load();
    videoPlayer.addEventListener("error", (ex) => {
      reject(ex);
    });
    videoPlayer.addEventListener("loadedmetadata", () => {
      if (videoPlayer.duration < seekTo) {
        reject("video is too short.");
        return;
      }
      setTimeout(() => {
        videoPlayer.currentTime = seekTo;
      }, 200);
      videoPlayer.addEventListener("seeked", () => {
        const canvas = document.createElement("canvas");
        canvas.width = videoPlayer.videoWidth;
        canvas.height = videoPlayer.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
          ctx.canvas.toBlob(
            async (blob) => {
              if (blob) {
                const base64 = await blobToBase64(blob);
                resolve(base64);
              }
            },
            "image/jpeg",
            1
          );
        }
      });
    });
  });
};

const categoryFilter = createFilterOptions<CategoryOption>();

export const CreateFilm = observer(() => {
  const { manageFilmStore, userStore, manageCategoryStore } = useStore();

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryOption | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isSubmitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const [openFileSelector, { filesContent, plainFiles, clear }] = useFilePicker(
    {
      accept: "video/*",
      limitFilesConfig: { max: 1 },
      readAs: "DataURL",
    }
  );

  const manageFilmsFM = useForm<IManageFilmFormValues>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    shouldFocusError: false,
    resolver: yupResolver(validationSchemas.manageFilms),
  });

  const {
    register,
    formState: { touchedFields, errors },
    handleSubmit,
    watch,
    setValue,
    reset,
  } = manageFilmsFM;

  const { title, description } = watch();

  const submitCreateFilm = (
    _data: IManageFilmFormValues,
    e?: BaseSyntheticEvent
  ) => {
    e?.preventDefault();
    if (!selectedCategory?.id && selectedCategory?.name) {
      manageCategoryStore.createCategory(selectedCategory.name);
    }
    setSubmitted(true);
  };

  const handleChangeYear = (event: SelectChangeEvent<number>) => {
    setSelectedYear(Number(event.target.value));
  };

  useEffect(() => {
    if (
      manageCategoryStore.statuses.getCategories !== PENDING_STORE_STATUS &&
      !manageCategoryStore.categories
    ) {
      manageCategoryStore.getCategories();
    }
  }, []);

  useEffect(() => {
    if (
      plainFiles?.[0] &&
      manageFilmStore.statuses.uploadFilm !== PENDING_STORE_STATUS &&
      !manageFilmStore.uploadedFilm
    ) {
      const formData = new FormData();
      formData.append("file", plainFiles[0]);
      (async function getCover() {
        const cover = await getVideoCover(plainFiles[0], 1.5);
        manageFilmStore.handleThumbnail(cover);
      })();
      manageFilmStore.uploadFilm(formData);
    }
  }, [plainFiles]);

  useEffect(() => {
    if (manageFilmStore.uploadedFilm && userStore.user?.id && isSubmitted) {
      const formattedData = {
        creator: userStore.user.id,
        title,
        description,
        year: selectedYear,
        category:
          selectedCategory?.id || manageCategoryStore.category?.id || "",
        views: 0,
        thumbnail: manageFilmStore.thumbnail,
      };
      manageFilmStore.createFilm(
        {
          fileID: manageFilmStore.uploadedFilm.id,
          filename: manageFilmStore.uploadedFilm.filename,
        },
        formattedData
      );
      reset();
      clear();
      navigate(ROUTES.adminPanel);
    }
    setSubmitted(false);
  }, [manageFilmStore.uploadedFilm, isSubmitted]);

  const isSubmitLoading =
    manageFilmStore.statuses.uploadFilm === PENDING_STORE_STATUS ||
    manageFilmStore.statuses.createFilm === PENDING_STORE_STATUS ||
    manageCategoryStore.statuses.getCategories === PENDING_STORE_STATUS;
  const isSubmitBtnDisabled =
    !plainFiles?.[0] || !title || !description || !selectedCategory?.name;

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={styles.createFilmBox}>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(submitCreateFilm)}
          sx={styles.form}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={styles.videoMainBox}>
                {!plainFiles?.[0] && (
                  <Box>
                    <Button
                      variant="contained"
                      component="label"
                      color="secondary"
                      onClick={openFileSelector}
                    >
                      Upload File
                    </Button>
                  </Box>
                )}
                <Box sx={styles.videoContentBox}>
                  {filesContent?.[0]?.content ? (
                    <video
                      controls
                      src={filesContent[0].content}
                      style={styles.videoBox}
                    />
                  ) : (
                    <Typography textAlign="center">Nothing selected</Typography>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Film title"
                color="secondary"
                error={touchedFields.title && !!errors.title?.message}
                helperText={touchedFields.title && errors.title?.message}
                {...register("title")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={5}
                label="Film description"
                color="secondary"
                error={
                  touchedFields.description && !!errors.description?.message
                }
                helperText={
                  touchedFields.description && errors.description?.message
                }
                {...register("description")}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                {...register("category")}
                value={selectedCategory}
                disabled={!manageCategoryStore.categories}
                color="secondary"
                onChange={(event, newValue) => {
                  if (typeof newValue === "string") {
                    const isCorrect = /^[A-Za-z]*$/gm.test(newValue);
                    setValue("category", isCorrect ? newValue : "");
                    setSelectedCategory({
                      name: isCorrect ? newValue : "",
                      id: "",
                      updatedAt: "",
                      createdAt: "",
                    });
                  } else if (newValue && newValue.inputValue) {
                    const isCorrect = /^[A-Za-z]*$/gm.test(newValue.inputValue);
                    setValue("category", isCorrect ? newValue.inputValue : "");
                    setSelectedCategory({
                      name: isCorrect ? newValue.inputValue : "",
                      id: "",
                      updatedAt: "",
                      createdAt: "",
                    });
                  } else {
                    const isCorrect =
                      newValue?.name && /^[A-Za-z]*$/gm.test(newValue.name);
                    setValue("category", isCorrect ? newValue.name : "");
                    setSelectedCategory({
                      id: newValue?.id || "",
                      name: isCorrect ? newValue.name : "",
                      updatedAt: newValue?.updatedAt || "",
                      createdAt: newValue?.createdAt || "",
                    });
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = categoryFilter(options, params);
                  const { inputValue } = params;
                  const isExisting = options.some(
                    (option) => inputValue === option.name
                  );
                  if (inputValue !== "" && !isExisting) {
                    filtered.push({
                      inputValue,
                      name: `Select "${inputValue}"`,
                      updatedAt: "",
                      createdAt: "",
                      id: "",
                    });
                  }
                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                options={[
                  {
                    id: "",
                    name: "None",
                    updatedAt: "",
                    createdAt: "",
                  },
                  ...((manageCategoryStore.categories || []).map(
                    (category) => ({
                      id: category.id,
                      name: category.name,
                      updatedAt: category.updatedAt,
                      createdAt: category.createdAt,
                    })
                  ) as CategoryOption[]),
                ]}
                getOptionLabel={(option) => {
                  if (typeof option === "string") {
                    return option;
                  }
                  if (option.inputValue) {
                    return option.inputValue;
                  }
                  return option.name;
                }}
                renderOption={(props, option) => (
                  <li {...props}>{option.name}</li>
                )}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="category"
                    label="Enter film category"
                    color="secondary"
                    error={touchedFields.category && !!errors.category?.message}
                    helperText={
                      touchedFields.category && errors.category?.message
                    }
                    required
                  />
                )}
                isOptionEqualToValue={(option, value) =>
                  !value ? option.name === "None" : option === value
                }
                getOptionDisabled={(option) => option.name === "None"}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={styles.formControl} fullWidth>
                <InputLabel id="year-select" color="secondary">
                  Release year
                </InputLabel>
                <Select
                  labelId="year-select"
                  value={selectedYear}
                  onChange={handleChangeYear}
                  color="secondary"
                  label="Release year"
                >
                  {getYears().map((year) => (
                    <MenuItem value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {isSubmitLoading ? (
            <LoadingButton
              loading
              loadingPosition="end"
              endIcon={<SaveIcon />}
              variant="outlined"
              fullWidth
              sx={styles.createFilmBtn}
            >
              Create film
            </LoadingButton>
          ) : (
            <Button
              variant="contained"
              endIcon={<SaveIcon />}
              sx={styles.createFilmBtn}
              type="submit"
              color="secondary"
              fullWidth
              disabled={isSubmitBtnDisabled}
            >
              Create film
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
});
