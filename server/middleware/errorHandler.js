// Central error handler. Never leaks internal error details (stack traces,
// SQL errors, etc.) to the client - only a safe, generic message.
function errorHandler(err, req, res, next) {
  console.error('[error]', err);

  if (res.headersSent) return next(err);

  const status = err.status || 500;
  const message =
    status < 500
      ? err.message
      : 'Something went wrong on our end. Please try again shortly.';

  res.status(status).json({ message });
}

function notFound(req, res) {
  res.status(404).json({ message: 'The requested resource was not found.' });
}

module.exports = { errorHandler, notFound };
