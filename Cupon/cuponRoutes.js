const express = require('express');
const cuponController = require('./cuponController');

const router = express.Router();

router.get('/cupons/:id', cuponController.consultarCupon);
router.post('/cupons', cuponController.cadastrarCupon);
router.put('/cupons/:id', cuponController.editarCupon);
router.delete('/cupons/:id', cuponController.removerCupon);

module.exports = router;
