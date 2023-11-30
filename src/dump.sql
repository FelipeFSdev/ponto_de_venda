create database pdv;

create table usuarios (
    id serial primary key,
    nome text not null,
    email text unique not null,
    senha text not null,
);

create table categorias (
    id serial primary key,
    descricao text not null
);

insert into categorias (descricao) values 
('Informática'), ('Celulares'), ('Beleza e Perfumaria'),
('Mercado'), ('Livros e Papelaria'), ('Brinquedos'),
('Moda'), ('Bebê'), ('Games');

create table produtos (
  id serial primary key,
  descricao text not null,
  quantidade_estoque integer not null,
  valor integer not null,
  categoria_id integer not null references categorias(id)
);

create table clientes (
  id serial primary key,
  nome text not null,
  email text unique not null,
  cpf char(11) unique not null,
  cep char(8),
  rua text,
  numero integer,
  bairro text,
  cidade text,
  estado char(2)
);