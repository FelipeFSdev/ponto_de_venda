const knex = require('../conexao/conexaopg');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const senhaJwt = require('../senhaJwt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campo são obrigatórios.' });
    }

    try {
        const hashSenha = await bcrypt.hash(senha, 10);

        await knex('usuarios').insert({
            nome: nome,
            email: email,
            senha: hashSenha,
        })
            .returning('*');

        return res.status(201).json({ nome, email });
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
};

const loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuarioLogado = await knex("usuarios")
            .where("email", email)
            .first()
        if (!usuarioLogado) {
            return res.status(400).json({ mensagem: "if usuarioLogado" });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuarioLogado.senha)
        if (!senhaCorreta) {
            return res.status(400).json({ mensagem: "if senhaCorreta" })
        }
        const token = jwt.sign({ id: usuarioLogado.id }, senhaJwt, { expiresIn: "8h" });

        return res.status(200).json({ token })

    } catch (error) {
        return res.json(error.message)
    }

}

module.exports = {
    cadastrarUsuario,
    loginUsuario
}