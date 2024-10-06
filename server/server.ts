import app from './app/index.ts';
const port = process.env.PORT || '5005';
app.listen(port, (err?: any) => {
  if (err) throw err;
  console.log('> Ready on http://localhost:5005');
});
