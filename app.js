const express = require('express');
const cuponRoutes = require('./cuponRoutes');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cuponRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
