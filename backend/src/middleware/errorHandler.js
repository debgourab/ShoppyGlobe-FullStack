export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  console.error(error);

  if (error.code === 11000) {
    return res.status(409).json({ message: "A record with this value already exists." });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }

  const status = error.status || 500;
  const isProduction = process.env.NODE_ENV === "production";
  const message = isProduction && status >= 500 ? "Internal server error." : error.message || "Internal server error.";

  res.status(status).json({ message });
}
