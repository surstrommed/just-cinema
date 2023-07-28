import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchemas } from "utils/validations/schemas";
import {
  Box,
  Grid,
  TextField,
  InputAdornment,
  Button,
  Container,
  CssBaseline,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { useStore } from "store/store";
import { PENDING_STORE_STATUS } from "constants/store";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { IManageActorFormValues } from "models/actor";
import { ROUTES } from "constants/routes";
import { useNavigate } from "react-router";
import { getFormattedDate } from "utils";

const styles = {
  createActorBox: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  lockIcon: { m: 1, bgcolor: "secondary.main" },
  form: { mt: 3 },
  createActorBtn: { mt: 3, mb: 2 },
};

export const CreateActor = observer(() => {
  const { manageActorsStore } = useStore();

  const manageActorsFM = useForm<IManageActorFormValues>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    shouldFocusError: false,
    resolver: yupResolver(validationSchemas.manageActors),
    defaultValues: {
      actorBirthDay: getFormattedDate(new Date(), "YYYY-MM-DD"),
    },
  });

  const {
    register,
    formState: { touchedFields, errors },
    handleSubmit,
    reset,
  } = manageActorsFM;

  const navigate = useNavigate();

  const submitCreateActor = (data: IManageActorFormValues) => {
    const actorData = {
      name: `${data.actorFirstName} ${data.actorLastName}`,
      biography: data.actorBiography,
      image: null,
      birthDay: Date.parse(new Date(data.actorBirthDay).toString()),
      birthPlace: data.actorBirthPlace,
      height: data.actorHeight,
    };
    manageActorsStore.createActor(actorData);
    reset();
    navigate(ROUTES.adminPanel);
  };

  const isSubmitLoading =
    manageActorsStore.statuses.createActor === PENDING_STORE_STATUS;

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={styles.createActorBox}>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(submitCreateActor)}
          sx={styles.form}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Actor first name"
                color="secondary"
                error={
                  touchedFields.actorFirstName &&
                  !!errors.actorFirstName?.message
                }
                helperText={
                  touchedFields.actorFirstName && errors.actorFirstName?.message
                }
                {...register("actorFirstName")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Actor last name"
                color="secondary"
                error={
                  touchedFields.actorLastName && !!errors.actorLastName?.message
                }
                helperText={
                  touchedFields.actorLastName && errors.actorLastName?.message
                }
                {...register("actorLastName")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Actor biography"
                color="secondary"
                error={
                  touchedFields.actorBiography &&
                  !!errors.actorBiography?.message
                }
                helperText={
                  touchedFields.actorBiography && errors.actorBiography?.message
                }
                multiline
                rows={5}
                {...register("actorBiography")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Actor birth place"
                color="secondary"
                error={
                  touchedFields.actorBirthPlace &&
                  !!errors.actorBirthPlace?.message
                }
                helperText={
                  touchedFields.actorBirthPlace &&
                  errors.actorBirthPlace?.message
                }
                {...register("actorBirthPlace")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Actor birthday"
                type="date"
                color="secondary"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                error={
                  touchedFields.actorBirthDay && !!errors.actorBirthDay?.message
                }
                helperText={
                  touchedFields.actorBirthDay && errors.actorBirthDay?.message
                }
                {...register("actorBirthDay")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Actor height"
                fullWidth
                type="number"
                color="secondary"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">cm</InputAdornment>
                  ),
                  inputProps: {
                    min: 40,
                    max: 250,
                  },
                }}
                error={
                  touchedFields.actorHeight && !!errors.actorHeight?.message
                }
                helperText={
                  touchedFields.actorHeight && errors.actorHeight?.message
                }
                {...register("actorHeight")}
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
              sx={styles.createActorBtn}
            >
              Create actor
            </LoadingButton>
          ) : (
            <Button
              variant="contained"
              endIcon={<SaveIcon />}
              sx={styles.createActorBtn}
              type="submit"
              color="secondary"
              fullWidth
            >
              Create actor
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
});
