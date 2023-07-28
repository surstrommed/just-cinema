import { useEffect, useState } from "react";
import {
  InputAdornment,
  IconButton,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Container,
  Typography,
  useTheme,
} from "@mui/material";
import { ROUTES } from "constants/routes";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SaveIcon from "@mui/icons-material/Save";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ISignInFormValues } from "models/auth";
import { validationSchemas } from "utils/validations/schemas";
import { observer } from "mobx-react-lite";
import { useStore } from "store/store";
import LoadingButton from "@mui/lab/LoadingButton";
import { ERROR_STORE_STATUS, PENDING_STORE_STATUS } from "constants/store";
import { SOMETHING_WENT_WRONG_MSG } from "constants/messages";
import { Link as RouterLink } from "react-router-dom";
import { notify } from "utils/helpers/helpers";

const styles = {
  box: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  lockIcon: { m: 1, bgcolor: "secondary.main" },
  form: { mt: 1 },
  signinBtn: { mt: 3, mb: 2 },
};

export const SignIn = observer(() => {
  const { userStore } = useStore();
  const theme = useTheme();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    error: string;
    success: string;
  }>({ error: "", success: "" });

  const formMethods = useForm<ISignInFormValues>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    shouldFocusError: false,
    resolver: yupResolver(validationSchemas.signIn),
  });

  const {
    handleSubmit,
    formState: { touchedFields, errors },
    register,
  } = formMethods;

  const onSubmit = (data: ISignInFormValues) => {
    userStore.signIn(data);
  };

  const handlePasswordVisible = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    if (userStore.statuses.signIn === ERROR_STORE_STATUS) {
      !toastMessage.error &&
        setToastMessage((prevState) => ({
          ...prevState,
          error: SOMETHING_WENT_WRONG_MSG,
        }));
    } else if (userStore.statuses.signIn === PENDING_STORE_STATUS) {
      !!toastMessage.error &&
        setToastMessage((prevState) => ({ ...prevState, error: "" }));
      !!toastMessage.success &&
        setToastMessage((prevState) => ({ ...prevState, success: "" }));
    }
  }, [userStore.statuses.signIn]);

  useEffect(() => {
    if (toastMessage.error) {
      notify({
        text: toastMessage.error,
        type: "error",
        theme: theme.palette.mode,
      });
    }

    if (toastMessage.success) {
      notify({ text: toastMessage.success, theme: theme.palette.mode });
    }
  }, [toastMessage.error, toastMessage.success]);

  const isSubmitBtnDisabled =
    userStore.statuses.signIn === PENDING_STORE_STATUS;

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={styles.box}>
        <Avatar sx={styles.lockIcon}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={styles.form}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            color="secondary"
            error={touchedFields.email && !!errors.email?.message}
            helperText={touchedFields.email && errors.email?.message}
            {...register("email")}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type={passwordVisible ? "text" : "password"}
            color="secondary"
            error={touchedFields.password && !!errors.password?.message}
            helperText={touchedFields.password && errors.password?.message}
            {...register("password")}
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
          {isSubmitBtnDisabled ? (
            <LoadingButton
              loading
              loadingPosition="end"
              startIcon={<SaveIcon />}
              variant="outlined"
              fullWidth
              sx={styles.signinBtn}
            >
              Save
            </LoadingButton>
          ) : (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={styles.signinBtn}
            >
              Sign In
            </Button>
          )}
          <Grid container>
            <Grid item xs></Grid>
            <Grid item color="secondary">
              Don&apos;t have an account?{" "}
              <Link
                component={RouterLink}
                to={ROUTES.signup}
                variant="body2"
                color="secondary"
              >
                Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
});
