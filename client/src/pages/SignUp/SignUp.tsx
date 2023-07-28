import { useEffect, useState } from "react";
import { ROUTES } from "constants/routes";
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ISignUpFormValues } from "models/auth";
import { useStore } from "store/store";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchemas } from "utils/validations/schemas";
import { Link as RouterLink } from "react-router-dom";
import { notify } from "utils/helpers/helpers";
import {
  DONE_STORE_STATUS,
  ERROR_STORE_STATUS,
  PENDING_STORE_STATUS,
} from "constants/store";
import {
  SOMETHING_WENT_WRONG_MSG,
  SUCCESS_SIGN_UP_MSG,
} from "constants/messages";

const styles = {
  box: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  lockIcon: { m: 1, bgcolor: "secondary.main" },
  form: { mt: 3 },
  signupBtn: { mt: 3, mb: 2 },
};

export const SignUp = () => {
  const { userStore } = useStore();
  const theme = useTheme();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    error: string;
    success: string;
  }>({ error: "", success: "" });

  const formMethods = useForm<ISignUpFormValues>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    shouldFocusError: false,
    resolver: yupResolver(validationSchemas.signUp),
  });

  const {
    handleSubmit,
    formState: { touchedFields, errors },
    register,
    watch,
  } = formMethods;

  const onSubmit = (data: ISignUpFormValues) => {
    const signUpData = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
    };
    userStore.signUp(signUpData);
  };

  const handlePasswordVisible = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleConfirmPasswordVisible = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  useEffect(() => {
    if (userStore.statuses.signUp === ERROR_STORE_STATUS) {
      !toastMessage &&
        setToastMessage((prevState) => ({
          ...prevState,
          error: SOMETHING_WENT_WRONG_MSG,
        }));
    } else if (userStore.statuses.signUp === PENDING_STORE_STATUS) {
      !!toastMessage && setToastMessage({ error: "", success: "" });
    } else if (userStore.statuses.signUp === DONE_STORE_STATUS) {
      setToastMessage((prevState) => ({
        ...prevState,
        success: SUCCESS_SIGN_UP_MSG,
      }));
    }
  }, [userStore.statuses.signUp]);

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

      if (!!userStore.user?.email && !!watch().password) {
        const signInData = {
          email: userStore.user.email,
          password: watch().password,
        };
        userStore.signIn(signInData);
      }
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

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={styles.box}>
        <Avatar sx={styles.lockIcon}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={styles.form}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First name"
                autoFocus
                color="secondary"
                error={touchedFields.firstName && !!errors.firstName?.message}
                helperText={
                  touchedFields.firstName && errors.firstName?.message
                }
                {...register("firstName")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last name"
                color="secondary"
                error={touchedFields.lastName && !!errors.lastName?.message}
                helperText={touchedFields.lastName && errors.lastName?.message}
                {...register("lastName")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                color="secondary"
                error={touchedFields.email && !!errors.email?.message}
                helperText={touchedFields.email && errors.email?.message}
                {...register("email")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Confirm password"
                type={confirmPasswordVisible ? "text" : "password"}
                color="secondary"
                error={
                  touchedFields.confirmPassword &&
                  !!errors.confirmPassword?.message
                }
                helperText={
                  touchedFields.confirmPassword &&
                  errors.confirmPassword?.message
                }
                {...register("confirmPassword")}
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            sx={styles.signupBtn}
          >
            Sign Up
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item color="secondary">
              Already have an account?{" "}
              <Link
                component={RouterLink}
                to={ROUTES.signin}
                variant="body2"
                color="secondary"
              >
                Sign In
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
