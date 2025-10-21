export const getUserFullName = () => {
  return localStorage.getItem("userFullName") || "";
};

export const saveUserFullName = (name) => {
  localStorage.setItem("userFullName", name);
};

export const getUserBalance = () => {
  return parseFloat(localStorage.getItem("balance")) || 0;
};

export const saveUserBalance = (balance) => {
  localStorage.setItem("balance", balance);
};

export const findUser = () => {
  return {
    fullName: localStorage.getItem("userFullName") || "",
    email: localStorage.getItem("userEmail") || "",
  };
};

export const saveUser = (user) => {
  localStorage.setItem("userFullName", user.fullName);
  localStorage.setItem("userEmail", user.email);
  localStorage.setItem("userPassword", user.password);
};

export const userExists = (user) => {};
