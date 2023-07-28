import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  TextField,
  Badge,
  Tooltip,
} from "@mui/material";
import {
  ADMIN_ROLE,
  DARK_THEME,
  LINKS,
  SUPER_ADMIN_ROLE,
} from "constants/common";
import { SOMETHING_WENT_WRONG_MSG } from "constants/messages";
import { useStore } from "store/store";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import moment from "moment";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IProfileFormValues } from "models/profile";
import { validationSchemas } from "utils/validations/schemas";
import {
  getDecodedTokenData,
  parsedStoredUser,
  storeLoadingStatusDetector,
} from "utils";
import IconButton from "@mui/material/IconButton";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { useFilePicker } from "use-file-picker";
import LoadingButton from "@mui/lab/LoadingButton";
import CancelIcon from "@mui/icons-material/Cancel";
import { ThemeMode } from "models/theme";
import { notify } from "utils/helpers/helpers";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "constants/routes";
import {
  PENDING_STORE_STATUS,
  DONE_STORE_STATUS,
  ERROR_STORE_STATUS,
} from "constants/store";

const styles = {
  main: (mode: ThemeMode) => ({
    display: "flex",
    justifyContent: "center",
    border: `1px solid ${mode === DARK_THEME ? "#fff" : "#000"}`,
    borderRadius: "20px",
    mx: "20%",
    backgroundColor: "secondary",
    p: 3,
    mt: 5,
  }),
  profileAvatar: {
    maxHeight: { xs: 200, md: 167 },
    maxWidth: { xs: 317, md: 250 },
    border: "1px solid grey",
    borderRadius: "50%",
  },
  profileDataField: {
    mb: 2,
    py: 1,
    pr: 1,
  },
  boldText: { fontWeight: "bold" },
  createdAtText: { color: "grey", fontStyle: "italic" },
  uploadPhotoBtn: (mode: ThemeMode) => ({
    display: "flex",
    color: `${mode === DARK_THEME ? "#fff" : "#000"}`,
    p: 1,
    borderRadius: "50%",
    width: "50px",
    height: "50px",
  }),
  mainForm: { ml: 10 },
  editingForm: { display: "flex", flexDirection: "column" },
  personalDataField: {
    display: "flex",
    justifyContent: "space-between",
  },
  modifyBtn: { height: 30, mt: 2 },
};

export const Profile = () => {
  const theme = useTheme();
  const { userStore, uploadFileStore } = useStore();
  const { user } = userStore;
  const firstName = user?.name.split(" ")[0];
  const lastName = user?.name.split(" ")[1];
  const email = user?.email;
  const image = user?.image;
  const createdAt = user?.createdAt;
  const token = parsedStoredUser?.token;
  const userId = getDecodedTokenData(token)?.id;

  const [editing, setEditing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    error: string;
    success: string;
  }>({ error: "", success: "" });

  const navigate = useNavigate();

  const formMethods = useForm<IProfileFormValues>({
    reValidateMode: "onSubmit",
    shouldFocusError: false,
    resolver: yupResolver(validationSchemas.profile),
    defaultValues: {
      firstName,
      lastName,
      email,
      image,
    },
  });

  const {
    register,
    formState: { touchedFields, errors },
    handleSubmit,
  } = formMethods;

  const handleEditing = (state: boolean) => {
    setEditing(state);
  };

  const handleDeleteImage = () => {
    if (userId) {
      if (uploadFileStore.link) {
        uploadFileStore.handleLink("");
      }
      clearUploadedPhoto();
      userStore.updateUserData(userId, { image: "" });
    }
  };

  const [
    openFileSelector,
    { plainFiles, filesContent, clear: clearUploadedPhoto },
  ] = useFilePicker({
    accept: "image/*",
    limitFilesConfig: { max: 1 },
    readAs: "DataURL",
    maxFileSize: 2,
  });

  const onSubmit = (data: IProfileFormValues) => {
    if (uploadFileStore.link) {
      uploadFileStore.handleLink("");
    }

    const isSomeFieldChanged =
      data.email !== email ||
      data.firstName !== firstName ||
      data.lastName !== lastName;

    if (userId && isSomeFieldChanged) {
      const formattedData = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
      };

      userStore.updateUserData(userId, formattedData);
    }
    handleEditing(false);
  };

  useEffect(() => {
    if (
      plainFiles?.[0] &&
      uploadFileStore.statuses.uploadFile !== PENDING_STORE_STATUS
    ) {
      uploadFileStore.uploadFile(plainFiles[0]);
    }
  }, [plainFiles]);

  useEffect(() => {
    if (
      uploadFileStore.link &&
      uploadFileStore.statuses.uploadFile === DONE_STORE_STATUS &&
      userId
    ) {
      const formattedData = { image: uploadFileStore.link };

      userStore.updateUserData(userId, formattedData);

      clearUploadedPhoto();
      uploadFileStore.handleLink("");
    }
  }, [uploadFileStore.link]);

  useEffect(() => {
    if (
      uploadFileStore.statuses.uploadFile === ERROR_STORE_STATUS ||
      userStore.statuses.updateUserData === ERROR_STORE_STATUS
    ) {
      !toastMessage.error &&
        setToastMessage((prevState) => ({
          ...prevState,
          error: SOMETHING_WENT_WRONG_MSG,
        }));
    } else if (
      uploadFileStore.statuses.uploadFile === PENDING_STORE_STATUS ||
      userStore.statuses.updateUserData === PENDING_STORE_STATUS
    ) {
      !!toastMessage.error &&
        setToastMessage((prevState) => ({ ...prevState, error: "" }));
      !!toastMessage.success &&
        setToastMessage((prevState) => ({ ...prevState, success: "" }));
    }
  }, [uploadFileStore.statuses.uploadFile, userStore.statuses.updateUserData]);

  useEffect(() => {
    if (toastMessage.error) {
      notify({
        text: toastMessage.error,
        type: "error",
        theme: theme.palette.mode,
      });
    }

    if (toastMessage.success) {
      notify({
        text: toastMessage.success,
        theme: theme.palette.mode,
      });
    }
  }, [toastMessage.error, toastMessage.success]);

  const goToAdminPage = () => {
    navigate(ROUTES.adminPanel);
  };

  const isSubmitBtnDisabled =
    storeLoadingStatusDetector(userStore.statuses) ||
    uploadFileStore.statuses.uploadFile === PENDING_STORE_STATUS;

  const isAdmin = user?.role === ADMIN_ROLE || user?.role === SUPER_ADMIN_ROLE;

  return (
    <Box sx={styles.main(theme.palette.mode)}>
      <Box>
        <Badge
          overlap="circular"
          badgeContent={
            image &&
            !editing && (
              <Tooltip title="Delete avatar">
                <IconButton onClick={handleDeleteImage}>
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            )
          }
        >
          <Box
            component="img"
            sx={styles.profileAvatar}
            alt="Avatar image"
            src={
              filesContent?.[0]?.content ||
              image ||
              (theme.palette.mode === DARK_THEME
                ? LINKS.noAvatarDark
                : LINKS.noAvatarLight)
            }
          />
        </Badge>
        {!editing && (
          <IconButton
            color="primary"
            aria-label="choose picture"
            component="label"
            sx={styles.uploadPhotoBtn(theme.palette.mode)}
            onClick={openFileSelector}
          >
            <DriveFolderUploadIcon />
          </IconButton>
        )}
      </Box>
      <Box
        sx={styles.mainForm}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        {editing ? (
          <Box sx={styles.editingForm}>
            <Box sx={styles.personalDataField}>
              <Typography sx={styles.profileDataField}>First name:</Typography>
              &nbsp;
              <TextField
                variant="standard"
                color="secondary"
                error={touchedFields.firstName && !!errors.firstName?.message}
                helperText={
                  touchedFields.firstName && errors.firstName?.message
                }
                {...register("firstName")}
              />
            </Box>
            <Box sx={styles.profileDataField}>
              <Typography sx={styles.profileDataField}>Last name:</Typography>
              &nbsp;
              <TextField
                variant="standard"
                color="secondary"
                error={touchedFields.lastName && !!errors.lastName?.message}
                helperText={touchedFields.lastName && errors.lastName?.message}
                {...register("lastName")}
              />
            </Box>
            <Box sx={styles.profileDataField}>
              <Typography sx={styles.profileDataField}>Email:</Typography>
              &nbsp;
              <TextField
                variant="standard"
                color="secondary"
                error={touchedFields.email && !!errors.email?.message}
                helperText={touchedFields.email && errors.email?.message}
                {...register("email")}
              />
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography sx={styles.profileDataField}>
              First name: <span style={styles.boldText}>{firstName}</span>
            </Typography>
            <Typography sx={styles.profileDataField}>
              Last name: <span style={styles.boldText}>{lastName}</span>
            </Typography>
            <Typography sx={styles.profileDataField}>
              Email: <span style={styles.boldText}>{email}</span>
            </Typography>
            <Typography sx={styles.profileDataField}>
              Created:{" "}
              <span style={styles.createdAtText}>
                {moment(createdAt).fromNow()}
              </span>
            </Typography>
          </Box>
        )}
        {editing ? (
          <>
            {isSubmitBtnDisabled ? (
              <LoadingButton
                loading
                loadingPosition="end"
                endIcon={<SaveIcon />}
                variant="outlined"
                fullWidth
                sx={styles.modifyBtn}
              >
                Save
              </LoadingButton>
            ) : (
              <Button
                variant="contained"
                endIcon={<SaveIcon />}
                sx={styles.modifyBtn}
                type="submit"
                color="secondary"
                fullWidth
              >
                Save
              </Button>
            )}
          </>
        ) : (
          <Button
            variant="contained"
            endIcon={<EditIcon />}
            sx={styles.modifyBtn}
            fullWidth
            color="secondary"
            onClick={(e) => {
              e.preventDefault();
              handleEditing(true);
            }}
          >
            Edit
          </Button>
        )}
        {isAdmin && (
          <Button
            variant="contained"
            sx={styles.modifyBtn}
            fullWidth
            color="secondary"
            onClick={goToAdminPage}
          >
            Go to admin panel
          </Button>
        )}
      </Box>
    </Box>
  );
};
