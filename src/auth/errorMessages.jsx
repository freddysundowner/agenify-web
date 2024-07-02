// src/auth/errorMessages.js
const errorMessages = {
  "auth/invalid-credential": "The credential is invalid. Please try again.",
  "auth/user-not-found": "No user found with this email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/email-already-in-use":
    "This email is already in use. Please try another email.",
  "auth/weak-password":
    "The password is too weak. Please choose a stronger password.",
  // Add more mappings as needed
};

export const getErrorMessage = (errorCode) => {
  return (
    errorMessages[errorCode] || "An unknown error occurred. Please try again."
  );
};
