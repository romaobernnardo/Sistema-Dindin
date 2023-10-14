const pool = require('../conexao')

const listarCategorias = async (req, res) => {
   try {
      const { rows } = await pool.query(`select * from categorias`)
      return res.status(200).json(rows)
   } catch (error) {
      return res.status(500).json('Erro interno do servidor')
   }
}

module.exports = listarCategorias;