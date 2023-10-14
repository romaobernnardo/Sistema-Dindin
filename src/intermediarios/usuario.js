const pool = require('../conexao')


const verificaDadosUsuario = async (req, res, next) => {
    const { nome, email, senha } = req.body;

    if (!nome) {
        return res.status(404).json({ mensagem: "Campo nome é obrigatório" })
    }

    if (!email) {
        return res.status(404).json({ mensagem: "Campo email é obrigatório" })
    }

    if (!senha) {
        return res.status(404).json({ mensagem: "Campo senha é obrigatório" })
    }

    next()
}

const verificaDadosLogin = async (req, res, next) => {
    const { email, senha } = req.body;

    if (!email) {
        return res.status(404).json({ mensagem: "Campo email é obrigatório" })
    }
    if (!senha) {
        return res.status(404).json({ mensagem: "Campo senha é obrigatório" })
    }
    next()
}

const verificaSeEmailExiste = async (req, res, next) => {

    const { email } = req.body;
    try {
        const queryClienteEmail = 'select * from usuarios where email = $1'
        const emailExistente = await pool.query(queryClienteEmail, [email])

        if (emailExistente.rowCount > 0) {
            if (req.url == '/usuario' && req.method == 'POST') {
                return res
                    .status(400)
                    .json({ mensagem: 'E-mail informado já está cadastrado' })
            }
            if (req.url == '/usuario' && req.method == 'PUT') {
                const { id } = (req.usuario)
                if (emailExistente.rows[0].id != Number(id)) {
                    return res
                        .status(400)
                        .json({ mensagem: 'E-mail informado já está cadastrado' })
                }
            }
        }
        next()
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }

}

module.exports = {
    verificaDadosUsuario,
    verificaDadosLogin,
    verificaSeEmailExiste
};
