const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Cupon = sequelize.define('Cupon', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  supplier: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discountValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  pointsValue: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  supplierLogo: {
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  cuponValid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true, 
  },
});

module.exports = Cupon;
