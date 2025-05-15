app.use((err, req, res, next) => {
  console.error(err);          // always log it
  res.status(500).json({ error: err.message });
});
