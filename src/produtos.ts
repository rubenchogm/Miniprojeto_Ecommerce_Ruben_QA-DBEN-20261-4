import { Produto, Categoria } from "./types";

// Dados iniciais: o catálogo vive neste array, em memória.
// "export" permite que outros arquivos (como o main.ts) usem este array.
export const produtos: Produto[] = [
  { id: 1, nome: "Teclado Mecânico", categoria: "perifericos", preco: 250, estoque: 15 },
  { id: 2, nome: "Mouse Gamer", categoria: "perifericos", preco: 120, estoque: 30 },
  { id: 3, nome: "Monitor 24 polegadas", categoria: "eletronicos", preco: 900, estoque: 8 },
  { id: 4, nome: "Mochila para Notebook", categoria: "acessorios", preco: 150, estoque: 20 },
  { id: 5, nome: "Cabo HDMI", categoria: "acessorios", preco: 35, estoque: 0 },
  { id: 6, nome: "Clean Code", categoria: "livros", preco: 99.9, estoque: 5 },
];

// Retorna todos os produtos.
export function listarProdutos(): Produto[] {
  return produtos;
}

// Busca UM produto pelo identificador. Se não existir, retorna undefined.
export function buscarProdutoPorId(id: number): Produto | undefined {
  return produtos.find((produto) => produto.id === id);
}

// Busca produtos cujo nome CONTENHA o texto informado (sem diferenciar maiúsculas de minúsculas).
export function buscarProdutosPorNome(nome: string): Produto[] {
  const termo = nome.toLowerCase();
  return produtos.filter((produto) => produto.nome.toLowerCase().includes(termo));
}

// Retorna apenas os produtos de uma categoria.
export function filtrarProdutosPorCategoria(categoria: Categoria): Produto[] {
  return produtos.filter((produto) => produto.categoria === categoria);
}

// Dados que podem ser alterados na atualização (todos opcionais; o id NÃO muda).
export type DadosAtualizacao = {
  nome?: string;
  categoria?: Categoria;
  preco?: number;
  estoque?: number;
};

// Valida as regras de negócio de um produto e lança um erro se alguma falhar.
function validarDadosProduto(nome: string, preco: number, estoque: number): void {
  if (nome.trim() === "") {
    throw new Error("O nome do produto não pode estar vazio.");
  }
  if (preco <= 0) {
    throw new Error("O preço deve ser maior que zero.");
  }
  if (estoque < 0) {
    throw new Error("O estoque não pode ser negativo.");
  }
}

// Adiciona um novo produto ao catálogo, se ele cumprir todas as regras.
export function cadastrarProduto(novoProduto: Produto): Produto {
  validarDadosProduto(novoProduto.nome, novoProduto.preco, novoProduto.estoque);

  if (buscarProdutoPorId(novoProduto.id) !== undefined) {
    throw new Error(`Já existe um produto com o id ${novoProduto.id}.`);
  }

  produtos.push(novoProduto);
  return novoProduto;
}

// Altera os dados de um produto existente. Só mexe no que for enviado.
export function atualizarProduto(id: number, dados: DadosAtualizacao): Produto {
  const produto = buscarProdutoPorId(id);
  if (produto === undefined) {
    throw new Error(`Produto com id ${id} não encontrado.`);
  }

  // Primeiro validamos com os valores finais; se algo falhar, nada é alterado.
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

// Remove um produto do catálogo pelo id.
export function removerProduto(id: number): Produto {
  const indice = produtos.findIndex((produto) => produto.id === id);
  if (indice === -1) {
    throw new Error(`Produto com id ${id} não encontrado.`);
  }

  const [removido] = produtos.splice(indice, 1);
  return removido;
}
