const knex = require('../conexao/conexaopg');
const bcrypt = require('bcrypt');
const senhaJwt = require('../senhaJwt');
const jwt = require('jsonwebtoken');

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

const loginUsuario = async (req, res,) => {
    const {email, senha} = req.body

    try {
        
        const {rows, rowCount} = await pool.query('select * from usuarios where email = $1', [email])

        if (rowCount === 0) {
            return res.status(400).json({mensagem: 'Email ou senha inválida'})
        }
        
        const {senha: senhaUsuario, ...usuario} = rows[0]

        const senhaCorreta = await bcrypt.compare(senha, senhaUsuario)

        if (!senhaCorreta) {
            return res.status(400).json({mensagem: 'Email ou senha inválida'})
        }

        const token = jwt.sign({id: usuario.id}, senhaJwt, {expiresIn: '8h'})

        return res.json({
            usuario,
            token
        })

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor'})
    }
}

module.exports = {
    cadastrarUsuario,
    loginUsuario
}