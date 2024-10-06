export const validateEmail = (email: string): boolean => {
  // Email validation regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if the email matches the regex pattern
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Password validation logic
  // Example: Password must be at least 8 characters long
  // and contain at least 1 digit, 1 uppercase, and 1 lowercase character
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
};

export const validateUsername = (username: string): boolean => {
  // Username validation logic
  // Example: Username must be alphanumeric and between 3 to 20 characters long
  const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
  return usernameRegex.test(username);
};
