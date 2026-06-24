const { PrismaClient } = require("./generated/prisma");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
require("dotenv").config();

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;



// TUVIMOS PROBLEMAS CON LA VERSION DE PRISMA, POR ESO SE CAMBIO A LA VERSION 4.15.0, YA QUE LA VERSION 5.0.0 NO FUNCIONA CON EL ADAPTER DE MARIADB.