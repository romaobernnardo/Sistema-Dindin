const pool = require('../conexao')

const listarTransacao = async (req, res) => {

   const { id } = (req.usuario)
   const { filtro } = req.query

   try {
      const queryTransacao = `select DISTINCT(t.id),t.tipo,t.descricao,t.valor,t.data,t.usuario_id,t.categoria_id, c.descricao as categoria_nome
        from transacoes t 
        inner join categorias c ON (t.categoria_id = c.id) 
        inner join usuarios u ON ($1 = t.usuario_id)  
        and c.descricao = ANY($2) 
        order by t.id`
      await pool.query(queryTransacao, [id, filtro], (error, result) => {
         if (!error) {
            return res.status(200).json(result.rows)
         } else
            return res.status(400).json(error);
      })

   } catch (error) {
      return res.status(500).json({ mensagem: 'Erro interno do servidor' })
   }

}

const pesquisarTransacao = async (req, res) => {

   const idUsuario = (req.usuario.id)
   const { id } = req.params

   if (isNaN(id)) {
      return res.status(400).json({ mensagem: 'Número de transação inválido' })
   }

   try {
      const queryTransacao = `select DISTINCT(t.id),t.tipo,t.descricao,t.valor,t.data,t.usuario_id,t.categoria_id, c.descricao as categoria_nome
        from transacoes t 
        inner join categorias c ON (t.categoria_id = c.id) 
        inner join usuarios u ON ($1 = t.usuario_id) where  t.id=$2`
      const resultado = await pool.query(queryTransacao, [idUsuario, id])
      if (resultado.rowCount < 1) {
         return res.status(404).json({ mensagem: "Transação não encontrada." })
      }
      return res.status(200).json(resultado.rows[0])
   } catch (error) {
      return res.status(500).json({ mensagem: 'Erro interno do servidor' })
   }

}

const cadastrarTransacao = async (req, res) => {

   const usuario_id = req.usuario.id
   const categoria = req.categoria.descricao
   const { tipo, descricao, valor, data, categoria_id } = req.body

   try {
      const query = `insert into transacoes(
         "tipo","descricao","valor","data","usuario_id","categoria_id")
          values($1,$2,$3,$4,$5,$6)
      returning *`
      const parametros = [tipo, descricao, valor, data, usuario_id, categoria_id]
      const transacao = await pool.query(query, parametros)
      transacao.rows[0].categoria_nome = categoria
      return res.status(201).json(transacao.rows[0])

   } catch (error) {
      return res.status(500).json({ mensagem: 'Erro interno do servidor' })
   }
}

const atualizarTransacao = async (req, res) => {

   const { id } = req.params
   const usuario_id = req.usuario.id
   const { tipo, descricao, valor, data, categoria_id } = req.body

   if (isNaN(id)) {
      return res.status(400).json({ mensagem: 'Número de transação inválido' })
   }

   try {
      const query = `update transacoes 
      set descricao = $1, valor=$2, data=$3, categoria_id=$4 ,tipo=$5
      where id= ${id} and usuario_id=${usuario_id}`

      const parametros = [descricao, valor, data, categoria_id, tipo]
      const resultado = await pool.query(query, parametros)
      if (resultado.rowCount < 1) {
         return res.status(404).json({ mensagem: "Transação não encontrada." })
      }
      return res.status(204).json('')
   } catch (error) {
      return res.status(500).json({ mensagem: 'Erro interno do servidor' })
   }

}

const deletarTransacao = async (req, res) => {

   const { id } = req.params
   const usuario_id = req.usuario.id

   if (isNaN(id)) {
      return res.status(400).json({ mensagem: 'Número de transação inválido' })
   }

   try {
      const query = 'delete from transacoes where id = $1 and usuario_id = $2'
      const parametros = [id, usuario_id]
      const resultado = await pool.query(query, parametros)

      if (resultado.rowCount < 1) {
         return res.status(404).json({ mensagem: "Transação não encontrada." })
      }
      return res.status(204).json('')
   } catch (error) {
      return res.status(500).json({ mensagem: 'Erro interno do servidor' })
   }
}

const extrato = async (req, res) => {

   const usuario_id = req.usuario.id
   try {
      const query = `select valor,tipo  from transacoes where usuario_id= $1`
      const parametros = [usuario_id]

      const resultado = await pool.query(query, parametros)

      let entradas = 0
      let saidas = 0
      resultado.rows.map(result => {
         if (result.tipo === 'entrada') {
            entradas += result.valor
         }
         if (result.tipo === 'saída') {
            saidas += result.valor
         }
      })

      return res.status(200).json(
         {
            entrada: entradas,
            saída: saidas
         }
      )
   } catch (error) {
      return res.status(500).json({ mensagem: 'Erro interno do servidor' })
   }
}

module.exports = {
   listarTransacao,
   pesquisarTransacao,
   cadastrarTransacao,
   atualizarTransacao,
   deletarTransacao,
   extrato
}