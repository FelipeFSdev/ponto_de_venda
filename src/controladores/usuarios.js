const knex = require('../conexao/conexaopg');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const senhaJwt = require('../senhaJwt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const hashSenha = await bcrypt.hash(senha, 10);

        const usuario = await knex("usuarios").insert({
            nome,
            email,
            senha: hashSenha,
        }).returning(["nome", "email"]);

        return res.status(201).json(usuario);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

const editarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    const { id } = req.usuario;
    let senhaCriptografada;

    if (!nome && !email && !senha) {
        return res.status(400).json({ mensagem: "É obrigatório informar ao menos um campo para atualização." })
    }
    if (senha) {
        senhaCriptografada = await bcrypt.hash(senha, 10);
    }

    try {
        const usuarioExiste = await knex("usuarios").where({ id }).first();

        if (!usuarioExiste) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." })
        }
        if (email) {
            if (email !== req.usuario.email) {
                const emailUsuarioExiste = await knex("usuarios").where({ email }).first();
                if (emailUsuarioExiste) {
                    return res.status(400).json({ mensagem: "O Email já existe." });
                }
            }
        }
        await knex('usuarios').update({
            nome,
            email,
            senha: senhaCriptografada
        })
            .where({ id }).returning('*');

        return res.status(204).send()
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const loginUsuario = async (req, res,) => {
    const { email, senha } = req.body

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
    }

    try {
        const usuarioLogado = await knex("usuarios").where({ email }).first();

        if (!usuarioLogado) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuarioLogado.senha);

        if (!senhaCorreta) {
            return res.status(400).json({ mensagem: "Email ou senha inválida." });
        }

        const token = jwt.sign({ id: usuarioLogado.id }, senhaJwt, { expiresIn: '8h' });

        const encontrarUsuarioLogado = await knex("usuarios").where("email", "=", usuarioLogado.email).first()

        return res.status(200).json({
            usuario: encontrarUsuarioLogado.nome,
            token
        });

        

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const detalharUsuario = async (req, res) => {
    const { id } = req.usuario
    try {
        const usuarioDetalhado = await knex("usuarios").where({ id }).first();
        
        if (!usuarioDetalhado){
            return res.status(404).json("O usuário não foi encontrado");
        }

        return res.status(200).json({ usuario: usuarioDetalhado.nome, 
        email: usuarioDetalhado.email,
        
    });

    } catch (error) {
        return res.status(400).json({ mensagem: "Erro interno do servidor." });
    }

    
}

module.exports = {
    cadastrarUsuario,
    editarUsuario,
    loginUsuario,
    detalharUsuario
}