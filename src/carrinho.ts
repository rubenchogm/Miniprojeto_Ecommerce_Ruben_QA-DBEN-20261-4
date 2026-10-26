import { Carrinho, ItemCarrinho } from "./types";
import { buscarProdutoPorId } from "./produtos";
import { buscarClientePorId } from "./clientes";

// Um carrinho por cliente, guardados em memória.
const carrinhos: Carrinho[] = [];

// Linha do carrinho com os dados do produto já combinados (para exibição).
export type ItemCarrinhoDetalhado = {
  produtoId: number;
  nome: string;
  precoUnitario: number;
  quantidade: number;
  subtotal: number;
};

// Retorna o carrinho do cliente; se ele ainda não tiver um, cria um vazio.
export function obterCarrinho(clienteId: number): Carrinho {
  if (buscarClientePorId(clienteId) === undefined) {
    throw new Error(`Cliente com id ${clienteId} não encontrado.`);
  }

  let carrinho = carrinhos.find((c) => c.clienteId === clienteId);
  if (carrinho === undefined) {
    carrinho = { clienteId, itens: [] };
    carrinhos.push(carrinho);
  }
  return carrinho;
}

// Regras comuns: quantidade válida e produto existente. Retorna o produto.
function validarQuantidadeEProduto(produtoId: number, quantidade: number) {
  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    throw new Error("A quantidade deve ser um número inteiro maior que zero.");
  }
  const produto = buscarProdutoPorId(produtoId);
  if (produto === undefined) {
    throw new Error(`Produto com id ${produtoId} não encontrado.`);
  }
  return produto;
}

// Adiciona um produto. Se ele já estiver no carrinho, soma a quantidade na mesma linha.
export function adicionarAoCarrinho(
  clienteId: number,
  produtoId: number,
  quantidade: number
): ItemCarrinho {
  const carrinho = obterCarrinho(clienteId);
  const produto = validarQuantidadeEProduto(produtoId, quantidade);

  const itemExistente = carrinho.itens.find((item) => item.produtoId === produtoId);
  const quantidadeFinal = (itemExistente?.quantidade ?? 0) + quantidade;

  if (quantidadeFinal > produto.estoque) {
    throw new Error(
      `Estoque insuficiente para "${produto.nome}": disponível ${produto.estoque}, solicitado ${quantidadeFinal}.`
    );
  }

  if (itemExistente !== undefined) {
    itemExistente.quantidade = quantidadeFinal;
    return itemExistente;
  }

  const novoItem: ItemCarrinho = { produtoId, quantidade };
  carrinho.itens.push(novoItem);
  return novoItem;
}

// Remove um produto do carrinho.
export function removerDoCarrinho(clienteId: number, produtoId: number): void {
  const carrinho = obterCarrinho(clienteId);
  const indice = carrinho.itens.findIndex((item) => item.produtoId === produtoId);
  if (indice === -1) {
    throw new Error(`O produto ${produtoId} não está no carrinho.`);
  }
  carrinho.itens.splice(indice, 1);
}

// Altera a quantidade de um produto que já está no carrinho.
export function alterarQuantidade(
  clienteId: number,
  produtoId: number,
  novaQuantidade: number
): ItemCarrinho {
  const carrinho = obterCarrinho(clienteId);
  const produto = validarQuantidadeEProduto(produtoId, novaQuantidade);

  const item = carrinho.itens.find((i) => i.produtoId === produtoId);
  if (item === undefined) {
    throw new Error(`O produto ${produtoId} não está no carrinho.`);
  }
  if (novaQuantidade > produto.estoque) {
    throw new Error(
      `Estoque insuficiente para "${produto.nome}": disponível ${produto.estoque}, solicitado ${novaQuantidade}.`
    );
  }

  item.quantidade = novaQuantidade;
  return item;
}

// Subtotal de uma linha = preço unitário x quantidade.
export function calcularSubtotal(item: ItemCarrinho): number {
  const produto = buscarProdutoPorId(item.produtoId);
  if (produto === undefined) {
    throw new Error(`Produto com id ${item.produtoId} não encontrado.`);
  }
  return produto.preco * item.quantidade;
}

// Lista as linhas do carrinho com nome, preço e subtotal.
export function listarItensCarrinho(clienteId: number): ItemCarrinhoDetalhado[] {
  const carrinho = obterCarrinho(clienteId);
  return carrinho.itens.map((item) => {
    const produto = buscarProdutoPorId(item.produtoId);
    if (produto === undefined) {
      throw new Error(`Produto com id ${item.produtoId} não encontrado.`);
    }
    return {
      produtoId: item.produtoId,
      nome: produto.nome,
      precoUnitario: produto.preco,
      quantidade: item.quantidade,
      subtotal: calcularSubtotal(item),
    };
  });
}

// Total do carrinho = soma de todos os subtotais.
export function calcularTotalCarrinho(clienteId: number): number {
  const carrinho = obterCarrinho(clienteId);
  return carrinho.itens.reduce((total, item) => total + calcularSubtotal(item), 0);
}

// Esvazia o carrinho (usado ao finalizar um pedido).
export function limparCarrinho(clienteId: number): void {
  const carrinho = obterCarrinho(clienteId);
  carrinho.itens = [];
}
