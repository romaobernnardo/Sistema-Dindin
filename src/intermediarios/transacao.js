const pool = require('../conexao')

const verificaDadosTransacao = async (req, res, next) => {

   const { categoria_id, descricao, valor, data, tipo } = req.body

   if (!categoria_id) {
      return res.status(404).json({ mensagem: "Campo Categoria é obrigatório" })
   }
   if (!descricao) {
      return res.status(404).json({ mensagem: "Campo Descricao é obrigatório" })
   }
   if (!valor) {
      return res.status(404).json({ mensagem: "Campo Valor é obrigatório" })
   }
   if (!data) {
      return res.status(404).json({ mensagem: "Campo Data é obrigatório" })
   }
   if (!tipo) {
      return res.status(404).json({ mensagem: "Campo Tipo é obrigatório" })
   }

   if (tipo !== 'entrada' && tipo !== 'saída') {
      return res.status(404).json({ mensagem: "Campo Tipo é inválido.Informar[entrada/saída]" })
   }

   try {
      const query = `select * from categorias where id=$1`

      const verificaCategoria = await pool.query(query, [categoria_id])

      if (verificaCategoria.rowCount < 1) {
         return res.status(404).json({ mensagem: "Categoria não encontrada" })
      }
      req.categoria = verificaCategoria.rows[0]
      return next()
   } catch (error) {
      return res.status(401).json({ mensagem: 'Erro interno' })
   }
}

module.exports = verificaDadosTransacao;
