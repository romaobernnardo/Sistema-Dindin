const express = require('express')
const {
   verificaDadosUsuario,
   verificaDadosLogin,
   verificaSeEmailExiste
} = require('./intermediarios/usuario')


const {
   cadastrarUsuario,
   login,
   atualizarUsuario,
   detalharPerfilUsuario
} = require('./controladores/usuario')

const {
   listarTransacao,
   pesquisarTransacao,
   cadastrarTransacao,
   atualizarTransacao,
   deletarTransacao,
   extrato
} = require('./controladores/transacao')

const listarCategorias = require('./controladores/categoria')

const verificarUsuarioLogado = require('./intermediarios/autenticacao')
const verificaDadosTransacao = require('./intermediarios/transacao')

const rotas = express()

rotas.post('/usuario', verificaDadosUsuario, verificaSeEmailExiste, cadastrarUsuario)
rotas.post('/login', verificaDadosLogin, login)

rotas.use(verificarUsuarioLogado)

rotas.get('/usuario', detalharPerfilUsuario)
rotas.put('/usuario', verificaDadosUsuario, verificaSeEmailExiste, atualizarUsuario)

rotas.get('/categoria', listarCategorias);

rotas.get('/transacao', listarTransacao)
rotas.get('/transacao/:id', pesquisarTransacao)
rotas.post('/transacao', verificaDadosTransacao, cadastrarTransacao)
rotas.put('/transacao/:id', verificaDadosTransacao, atualizarTransacao)
rotas.delete('/transacao/:id', deletarTransacao)
rotas.get('/transacao/extrato', extrato)


module.exports = rotas