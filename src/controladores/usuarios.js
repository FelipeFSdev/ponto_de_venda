const knex = require('../conexao/conexaopg');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Todos os campo são obrigatórios." });
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
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

const editarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    const { id } = req.usuario;

    if (!nome && !email && !senha) {
        return res.status(400).json({ mensagem: "É obrigatório informar ao menos um campo para atualização." })
    }

    try {
        const usuarioExiste = await knex('usuarios').where({ id }).first();
        if (!usuarioExiste) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." })
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        if (email !== req.usuario.email) {
            const emailUsuarioExiste = await knex('usuarios').where({ email }).first();

            if (emailUsuarioExiste) {
                return res.status(400).json({ mensagem: "O Email já existe." });
            }
        }

        await knex('usuarios').update({ nome, email, senha: senhaCriptografada })
            .where({ id }).returning('*');

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

module.exports = {
    cadastrarUsuario,
    editarUsuario
}