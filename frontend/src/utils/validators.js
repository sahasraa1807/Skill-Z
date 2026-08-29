export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  if (password.length < 8) return 'Password must be at least 8 characters';
  return null;
};

export const validateUsername = (username) => {
  if (username.length < 3) return 'Username must be at least 3 characters';
  if (!/^[a-z0-9_]+$/.test(username)) return 'Username can only contain lowercase letters, numbers, and underscores';
  return null;
};
