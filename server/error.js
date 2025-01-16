const createError = (status, message) => {
  const err = new Error(message); // Можна передавати повідомлення прямо у конструктор
  err.status = status;
  return err;
};

export default createError;
