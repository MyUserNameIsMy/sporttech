export const generateUniqueString = () => {
  const timestamp = new Date().getTime().toString();
  const random_string = Math.random().toString(36).slice(2, 8);
  return timestamp + random_string;
};
