const knex = require('../servicos/conexaopg');
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhaJwt');

const verificaLogin = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ mensagem: "Usuário não autorizado." });
    }

    const token = authorization.replace('Bearer ', '').trim();

    try {
        const { id } = jwt.verify(token, senhaJwt)

        const usuarioExiste = await knex("usuarios").where({ id }).first();

        if (!usuarioExiste) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." });
        }

        const { senha: _, ...usuario } = usuarioExiste;

        req.usuario = usuario;

        next()
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

module.exports = verificaLogin