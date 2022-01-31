import bcrypt from "bcryptjs";

export const generateBcryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

export const compareBcryptPassword = (password, bcryptedPassword) => {
  const isValid = bcrypt.compareSync(password, bcryptedPassword);
  return isValid;
};
