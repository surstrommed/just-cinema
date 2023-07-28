import * as Yup from "yup";
import {
  validatePassword,
  validateFirstName,
  validateLastName,
  validateActorBiography,
  validateActorBirthPlace,
  validateActorHeight,
} from "utils/validations/regexps";
import {
  ACTOR_BIOGRAPHY_IS_REQUIRED,
  ACTOR_BIOGRAPHY_NOT_CORRECT,
  ACTOR_BIRTHDAY_IS_REQUIRED,
  ACTOR_BIRTH_PLACE_IS_REQUIRED,
  ACTOR_BIRTH_PLACE_NOT_CORRECT,
  ACTOR_HEIGHT_IS_REQUIRED,
  ACTOR_HEIGHT_NOT_CORRECT,
  CONFIRM_PASSWORD_IS_REQUIRED,
  EMAIL_IS_NOT_CORRECT,
  EMAIL_IS_REQUIRED,
  FILM_CATEGORY_IS_REQUIRED,
  FILM_DESCRIPTION_IS_REQUIRED,
  FILM_TITLE_IS_REQUIRED,
  FIRST_NAME_IS_REQUIRED,
  FIRST_NAME_NOT_CORRECT,
  LAST_NAME_IS_REQUIRED,
  LAST_NAME_NOT_CORRECT,
  PASSWORDS_DO_NOT_MATCH,
  PASSWORD_IS_REQUIRED,
  PASSWORD_NOT_CORRECT,
} from "constants/validations";

export const validationSchemas = {
  signIn: Yup.object().shape({
    email: Yup.string().email(EMAIL_IS_NOT_CORRECT).required(EMAIL_IS_REQUIRED),
    password: Yup.string().required(PASSWORD_IS_REQUIRED),
  }),
  signUp: Yup.object().shape({
    email: Yup.string().email(EMAIL_IS_NOT_CORRECT).required(EMAIL_IS_REQUIRED),
    firstName: Yup.string()
      .matches(validateFirstName, FIRST_NAME_NOT_CORRECT)
      .required(FIRST_NAME_IS_REQUIRED),
    lastName: Yup.string()
      .matches(validateLastName, LAST_NAME_NOT_CORRECT)
      .required(LAST_NAME_IS_REQUIRED),
    password: Yup.string()
      .matches(validatePassword, PASSWORD_NOT_CORRECT)
      .required(PASSWORD_IS_REQUIRED),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], PASSWORDS_DO_NOT_MATCH)
      .required(CONFIRM_PASSWORD_IS_REQUIRED),
  }),
  profile: Yup.object().shape({
    email: Yup.string().email(EMAIL_IS_NOT_CORRECT).required(EMAIL_IS_REQUIRED),
    firstName: Yup.string().required(FIRST_NAME_IS_REQUIRED),
    lastName: Yup.string().required(LAST_NAME_IS_REQUIRED),
  }),
  manageAdmins: Yup.object().shape({
    adminEmail: Yup.string()
      .email(EMAIL_IS_NOT_CORRECT)
      .required(EMAIL_IS_REQUIRED),
    adminFirstName: Yup.string()
      .matches(validateFirstName, FIRST_NAME_NOT_CORRECT)
      .required(FIRST_NAME_IS_REQUIRED),
    adminLastName: Yup.string()
      .matches(validateLastName, LAST_NAME_NOT_CORRECT)
      .required(LAST_NAME_IS_REQUIRED),
    adminPassword: Yup.string()
      .matches(validatePassword, PASSWORD_NOT_CORRECT)
      .required(PASSWORD_IS_REQUIRED),
    adminConfirmPassword: Yup.string()
      .oneOf([Yup.ref("adminPassword")], PASSWORDS_DO_NOT_MATCH)
      .required(CONFIRM_PASSWORD_IS_REQUIRED),
  }),
  manageActors: Yup.object().shape({
    actorFirstName: Yup.string()
      .matches(validateFirstName, FIRST_NAME_NOT_CORRECT)
      .required(FIRST_NAME_IS_REQUIRED),
    actorLastName: Yup.string()
      .matches(validateLastName, LAST_NAME_NOT_CORRECT)
      .required(LAST_NAME_IS_REQUIRED),
    actorBiography: Yup.string()
      .matches(validateActorBiography, ACTOR_BIOGRAPHY_NOT_CORRECT)
      .required(ACTOR_BIOGRAPHY_IS_REQUIRED),
    actorBirthDay: Yup.string().required(ACTOR_BIRTHDAY_IS_REQUIRED),
    actorBirthPlace: Yup.string()
      .matches(validateActorBirthPlace, ACTOR_BIRTH_PLACE_NOT_CORRECT)
      .required(ACTOR_BIRTH_PLACE_IS_REQUIRED),
    actorHeight: Yup.string()
      .matches(validateActorHeight, ACTOR_HEIGHT_NOT_CORRECT)
      .required(ACTOR_HEIGHT_IS_REQUIRED),
  }),
  manageFilms: Yup.object().shape({
    title: Yup.string().required(FILM_TITLE_IS_REQUIRED),
    description: Yup.string().required(FILM_DESCRIPTION_IS_REQUIRED),
    category: Yup.string().required(FILM_CATEGORY_IS_REQUIRED),
  }),
};
