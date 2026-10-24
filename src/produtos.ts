
import { Produto, Categoria } from "./types";

// Datos iniciales: el "catálogo" vive en este array, en memoria.
// "export" permite que otros archivos (como main.ts) lo usen.
export const produtos: Produto[] = [
  { id: 1, nome: "Teclado Mecanico", categoria: "perifericos", preco: 250, estoque: 15 },
  { id: 2, nome: "Mouse Gamer", categoria: "perifericos", preco: 120, estoque: 30 },
  { id: 3, nome: "Monitor 24 polegadas", categoria: "eletronicos", preco: 900, estoque: 8 },
  { id: 4, nome: "Mochila para Notebook", categoria: "acessorios", preco: 150, estoque: 20 },
  { id: 5, nome: "Cabo HDMI", categoria: "acessorios", preco: 35, estoque: 0 },
  { id: 6, nome: "Clean Code", categoria: "livros", preco: 99.9, estoque: 5 },
];

// Devuelve todos los productos.
export function listarProdutos(): Produto[] {
  return produtos;
}

// Busca UN producto por su id. Si no existe, devuelve undefined.
export function buscarProdutoPorId(id: number): Produto | undefined {
  return produtos.find((produto) => produto.id === id);
}

// Busca productos cuyo nombre CONTENGA el texto (sin importar mayúsculas).
export function buscarProdutosPorNome(nome: string): Produto[] {
  const termo = nome.toLowerCase();
  return produtos.filter((produto) => produto.nome.toLowerCase().includes(termo));
}

// Devuelve solo los productos de una categoría.
export function filtrarProdutosPorCategoria(categoria: Categoria): Produto[] {
  return produtos.filter((produto) => produto.categoria === categoria);
}

// Datos que se pueden cambiar al actualizar (todos opcionales; el id NO se cambia).
export type DadosAtualizacao = {
  nome?: string;
  categoria?: Categoria;
  preco?: number;
  estoque?: number;
};

// Valida las reglas de negocio de un producto y lanza un error si alguna falla.
function validarDadosProduto(nome: string, preco: number, estoque: number): void {
  if (nome.trim() === "") {
    throw new Error("O nome do produto nao pode estar vazio.");
  }
  if (preco <= 0) {
    throw new Error("O preco deve ser maior que zero.");
  }
  if (estoque < 0) {
    throw new Error("O estoque nao pode ser negativo.");
  }
}

// Agrega un producto nuevo al catálogo, si cumple todas las reglas.
export function cadastrarProduto(novoProduto: Produto): Produto {
  validarDadosProduto(novoProduto.nome, novoProduto.preco, novoProduto.estoque);

  if (buscarProdutoPorId(novoProduto.id) !== undefined) {
    throw new Error(`Ja existe um produto com o id ${novoProduto.id}.`);
  }

  produtos.push(novoProduto);
  return novoProduto;
}

// Cambia los datos de un producto existente. Solo toca lo que se envía.
export function atualizarProduto(id: number, dados: DadosAtualizacao): Produto {
  const produto = buscarProdutoPorId(id);
  if (produto === undefined) {
    throw new Error(`Produto com id ${id} nao encontrado.`);
  }

  // Primero validamos con los valores finales; si algo falla, no se cambia nada.
  validarDadosProduto(
    dados.nome ?? produto.nome,
    dados.preco ?? produto.preco,
    dados.estoque ?? produto.estoque
  );

  if (dados.nome !== undefined) produto.nome = dados.nome;
  if (dados.categoria !== undefined) produto.categoria = dados.categoria;
  if (dados.preco !== undefined) produto.preco = dados.preco;
  if (dados.estoque !== undefined) produto.estoque = dados.estoque;

  return produto;
}

// Elimina un producto del catálogo por su id.
export function removerProduto(id: number): Produto {
  const indice = produtos.findIndex((produto) => produto.id === id);
  if (indice === -1) {
    throw new Error(`Produto com id ${id} nao encontrado.`);
  }

  const [removido] = produtos.splice(indice, 1);
  return removido;
}