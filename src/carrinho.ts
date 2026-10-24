import { Carrinho, ItemCarrinho } from "./types";
import { buscarProdutoPorId } from "./produtos";
import { buscarClientePorId } from "./clientes";

// Un carrito por cliente, guardados en memoria.
const carrinhos: Carrinho[] = [];

// Línea del carrito con los datos del producto ya combinados (para mostrar).
export type ItemCarrinhoDetalhado = {
  produtoId: number;
  nome: string;
  precoUnitario: number;
  quantidade: number;
  subtotal: number;
};

// Devuelve el carrito del cliente; si todavía no tiene, lo crea vacío.
export function obterCarrinho(clienteId: number): Carrinho {
  if (buscarClientePorId(clienteId) === undefined) {
    throw new Error(`Cliente com id ${clienteId} nao encontrado.`);
  }

  let carrinho = carrinhos.find((c) => c.clienteId === clienteId);
  if (carrinho === undefined) {
    carrinho = { clienteId, itens: [] };
    carrinhos.push(carrinho);
  }
  return carrinho;
}

// Reglas comunes: cantidad válida y producto existente. Devuelve el producto.
function validarQuantidadeEProduto(produtoId: number, quantidade: number) {
  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    throw new Error("A quantidade deve ser um numero inteiro maior que zero.");
  }
  const produto = buscarProdutoPorId(produtoId);
  if (produto === undefined) {
    throw new Error(`Produto com id ${produtoId} nao encontrado.`);
  }
  return produto;
}

// Agrega un producto. Si ya estaba, suma la cantidad en la misma línea.
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
      `Estoque insuficiente para "${produto.nome}": disponivel ${produto.estoque}, solicitado ${quantidadeFinal}.`
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

// Quita un producto del carrito.
export function removerDoCarrinho(clienteId: number, produtoId: number): void {
  const carrinho = obterCarrinho(clienteId);
  const indice = carrinho.itens.findIndex((item) => item.produtoId === produtoId);
  if (indice === -1) {
    throw new Error(`O produto ${produtoId} nao esta no carrinho.`);
  }
  carrinho.itens.splice(indice, 1);
}

// Cambia la cantidad de un producto que ya está en el carrito.
export function alterarQuantidade(
  clienteId: number,
  produtoId: number,
  novaQuantidade: number
): ItemCarrinho {
  const carrinho = obterCarrinho(clienteId);
  const produto = validarQuantidadeEProduto(produtoId, novaQuantidade);

  const item = carrinho.itens.find((i) => i.produtoId === produtoId);
  if (item === undefined) {
    throw new Error(`O produto ${produtoId} nao esta no carrinho.`);
  }
  if (novaQuantidade > produto.estoque) {
    throw new Error(
      `Estoque insuficiente para "${produto.nome}": disponivel ${produto.estoque}, solicitado ${novaQuantidade}.`
    );
  }

  item.quantidade = novaQuantidade;
  return item;
}

// Subtotal de una línea = precio unitario x cantidad.
export function calcularSubtotal(item: ItemCarrinho): number {
  const produto = buscarProdutoPorId(item.produtoId);
  if (produto === undefined) {
    throw new Error(`Produto com id ${item.produtoId} nao encontrado.`);
  }
  return produto.preco * item.quantidade;
}

// Lista las líneas del carrito con nombre, precio y subtotal.
export function listarItensCarrinho(clienteId: number): ItemCarrinhoDetalhado[] {
  const carrinho = obterCarrinho(clienteId);
  return carrinho.itens.map((item) => {
    const produto = buscarProdutoPorId(item.produtoId);
    if (produto === undefined) {
      throw new Error(`Produto com id ${item.produtoId} nao encontrado.`);
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

// Total del carrito = suma de todos los subtotales.
export function calcularTotalCarrinho(clienteId: number): number {
  const carrinho = obterCarrinho(clienteId);
  return carrinho.itens.reduce((total, item) => total + calcularSubtotal(item), 0);
}

// Vacía el carrito (se usará al finalizar un pedido).
export function limparCarrinho(clienteId: number): void {
  const carrinho = obterCarrinho(clienteId);
  carrinho.itens = [];
}