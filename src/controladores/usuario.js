const pool = require('../conexao')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhaJwt')

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const novoUsuario = await pool.query(
            'insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *',
            [nome, email, senhaCriptografada]
        );
        const { senha: _, ...usuario } = novoUsuario.rows[0];

        return res.status(201).json(usuario);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}


const login = async (req, res) => {
    const { email, senha } = req.body

    try {
        const usuario = await pool.query(
            'select * from usuarios where email = $1',
            [email]
        )

        if (usuario.rowCount < 1) {
            return res.status(404).json({ mensagem: "Usuário e/ou senha inválido(s)." })
        }

        const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha)

        if (!senhaValida) {
            return res.status(400).json({ mensagem: "Usuário e/ou senha inválido(s)." })
        }

        const token = jwt.sign({ id: usuario.rows[0].id }, senhaJwt, {
            expiresIn: '8h',
        })

        const { senha: _, ...usuarioLogado } = usuario.rows[0]

        return res.status(200).json({ usuario: usuarioLogado, token })
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const detalharPerfilUsuario = async (req, res) => {
    return res.status(200).json(req.usuario)
}

const atualizarUsuario = async (req, res) => {

    const { id } = (req.usuario)
    const { nome, email, senha } = req.body
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    try {
        const query = `update usuarios 
           set nome = $1 , email=$2, senha=$3
           where id= $4`

        const parametros = [nome, email, senhaCriptografada, id]
        await pool.query(query, parametros)
        res.status(204).json('')
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }

}

module.exports = {
    cadastrarUsuario,
    login,
    detalharPerfilUsuario,
    atualizarUsuario,
}