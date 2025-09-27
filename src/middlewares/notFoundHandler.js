export const notFountHandler = (req, res, next) => {
  res.status(404).json({
    message: 'Not found',
  });
};
