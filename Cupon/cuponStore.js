const Cupon = require('./cupon');

async function consultarCupon(cuponId) {
  try {
    const cupon = await Cupon.findByPk(cuponId);
    return cupon;
  } catch (error) {
    throw new Error('Erro ao consultar cupom no banco de dados');
  }
}

async function cadastrarCupon(cuponData) {
  try {
    const cupon = await Cupon.create(cuponData);
    return cupon;
  } catch (error) {
    throw new Error('Erro ao cadastrar cupom no banco de dados');
  }
}

async function editarCupon(cuponId, cuponData) {
  try {
    await Cupon.update(cuponData, {
      where: {
        id: cuponId,
      },
    });
    const cupon = await Cupon.findByPk(cuponId);
    return cupon;
  } catch (error) {
    throw new Error('Erro ao editar cupom no banco de dados');
  }
}

async function removerCupon(cuponId) {
  try {
    await Cupon.destroy({
      where: {
        id: cuponId,
      },
    });
  } catch (error) {
    throw new Error('Erro ao remover cupom no banco de dados');
  }
}

module.exports = {
  consultarCupon,
  cadastrarCupon,
  editarCupon,
  removerCupon,
};
