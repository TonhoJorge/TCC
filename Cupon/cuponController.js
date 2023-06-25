const cuponStore = require('./cuponStore');

async function consultarCupon(req, res) {
  const cuponId = req.params.id;

  try {
    const cupon = await cuponStore.consultarCupon(cuponId);
    res.json(cupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function cadastrarCupon(req, res) {
  const cuponData = req.body;

  try {
    const cupon = await cuponStore.cadastrarCupon(cuponData);
    res.json(cupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function editarCupon(req, res) {
  const cuponId = req.params.id;
  const cuponData = req.body;

  try {
    const cupon = await cuponStore.editarCupon(cuponId, cuponData);
    res.json(cupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function removerCupon(req, res) {
  const cuponId = req.params.id;

  try {
    await cuponStore.removerCupon(cuponId);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  consultarCupon,
  cadastrarCupon,
  editarCupon,
  removerCupon,
};
