export const validateEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export const validatePassword =
  /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;

export const validateFirstName = /^([A-Z]{1}[a-z]{2,14})$/;

export const validateLastName = /^([A-Z]{1}[a-z]{2,19})$/;

export const validateActorBiography = /^([A-Z]{1}[A-Za-z,. ]{2,199})$/;
export const validateActorBirthPlace = /^([A-Z]{1}[A-Za-z,. ]{2,29})$/;
export const validateActorHeight = /^([0-9]{1,3})$/;
