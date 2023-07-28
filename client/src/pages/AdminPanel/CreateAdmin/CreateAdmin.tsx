import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchemas } from "utils/validations/schemas";
import { IManageAdminsFormValues } from "models/adminpanel";
import {
  Box,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Container,
  CssBaseline,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { observer } from "mobx-react-lite";
import { useStore } from "store/store";
import { PENDING_STORE_STATUS } from "constants/store";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { ROUTES } from "constants/routes";
import { useNavigate } from "react-router-dom";

const styles = {
  createAdminBox: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  lockIcon: { m: 1, bgcolor: "secondary.main" },
  form: { mt: 3 },
  createAdminBtn: { mt: 3, mb: 2 },
  noAdmins: {
    mt: 5,
    textAlign: "center",
  },
  adminTableBox: {
    flex: "1 1 100%",
    p: "2rem",
  },
};

export const CreateAdmin = observer(() => {
  const { manageAdminsStore } = useStore();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const manageAdminsFM = useForm<IManageAdminsFormValues>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    shouldFocusError: false,
    resolver: yupResolver(validationSchemas.manageAdmins),
  });

  const {
    register,
    formState: { touchedFields, errors },
    handleSubmit,
    reset,
  } = manageAdminsFM;

  const handlePasswordVisible = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleConfirmPasswordVisible = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const submitCreateAdmin = (data: IManageAdminsFormValues) => {
    const adminData = {
      name: `${data.adminFirstName} ${data.adminLastName}`,
      email: data.adminEmail,
      password: data.adminPassword,
    };
    manageAdminsStore.createAdmin(adminData);
    reset();
    navigate(ROUTES.adminPanel);
  };

  const isSubmitLoading =
    manageAdminsStore.statuses.createAdmin === PENDING_STORE_STATUS;

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={styles.createAdminBox}>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(submitCreateAdmin)}
          sx={styles.form}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Admin first name"
                color="secondary"
                error={
                  touchedFields.adminFirstName &&
                  !!errors.adminFirstName?.message
                }
                helperText={
                  touchedFields.adminFirstName && errors.adminFirstName?.message
                }
                {...register("adminFirstName")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Admin last name"
                color="secondary"
                error={
                  touchedFields.adminLastName && !!errors.adminLastName?.message
                }
                helperText={
                  touchedFields.adminLastName && errors.adminLastName?.message
                }
                {...register("adminLastName")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Admin email"
                color="secondary"
                error={touchedFields.adminEmail && !!errors.adminEmail?.message}
                helperText={
                  touchedFields.adminEmail && errors.adminEmail?.message
                }
                {...register("adminEmail")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Admin password"
                type={passwordVisible ? "text" : "password"}
                color="secondary"
                error={
                  touchedFields.adminPassword && !!errors.adminPassword?.message
                }
                helperText={
                  touchedFields.adminPassword && errors.adminPassword?.message
                }
                {...register("adminPassword")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handlePasswordVisible}>
                        {passwordVisible ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Confirm admin password"
                type={confirmPasswordVisible ? "text" : "password"}
                color="secondary"
                error={
                  touchedFields.adminConfirmPassword &&
                  !!errors.adminConfirmPassword?.message
                }
                helperText={
                  touchedFields.adminConfirmPassword &&
                  errors.adminConfirmPassword?.message
                }
                {...register("adminConfirmPassword")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleConfirmPasswordVisible}>
                        {confirmPasswordVisible ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          {isSubmitLoading ? (
            <LoadingButton
              loading
              loadingPosition="end"
              endIcon={<SaveIcon />}
              variant="outlined"
              fullWidth
              sx={styles.createAdminBtn}
            >
              Create admin
            </LoadingButton>
          ) : (
            <Button
              variant="contained"
              endIcon={<SaveIcon />}
              sx={styles.createAdminBtn}
              type="submit"
              color="secondary"
              fullWidth
            >
              Create admin
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
});
