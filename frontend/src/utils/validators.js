export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());

export const isValidName = (name) => {
  const s = String(name || "").trim();
  return s.length >= 3 && s.length <= 60;
};

export const isValidAddress = (address) => {
  const s = String(address || "").trim();
  return s.length > 0 && s.length <= 400;
};

export const isValidPassword = (password) =>
  /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(String(password || ""));

export const isValidRating = (rating) => {
  const n = Number(rating);
  return Number.isInteger(n) && n >= 1 && n <= 5;
};

export const validateSignup = ({ name, email, address, password }) => {
  const errors = {};

  if (!isValidName(name))
    errors.name = "Name must be 3–60 characters.";

  if (!isValidEmail(email))
    errors.email = "Enter a valid email address.";

  if (!isValidAddress(address))
    errors.address = "Address must be max 400 characters.";

  if (!isValidPassword(password))
    errors.password =
      "Password must be 8–16 chars with 1 uppercase and 1 special character.";

  return errors;
};

export const validateChangePassword = ({ oldPassword, newPassword }) => {
  const errors = {};

  if (!oldPassword)
    errors.oldPassword = "Old password is required.";

  if (!isValidPassword(newPassword))
    errors.newPassword =
      "New password must be 8–16 chars with 1 uppercase and 1 special character.";

  return errors;
};
