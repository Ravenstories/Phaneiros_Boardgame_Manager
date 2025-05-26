app.use((err, req, res, next) => {
  console.error(err);          // always log it
  res.status(500).json({ error: err.message });
});
app.use('/api', apiRouter);          // all API first
app.use(express.static('frontend'));
app.get('*', (_req,res) => res.sendFile('frontend/index.html', { root:'.' }));
