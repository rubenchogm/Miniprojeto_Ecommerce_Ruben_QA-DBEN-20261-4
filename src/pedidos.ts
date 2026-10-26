import { Pedido, ItemPedido } from "./types";
import { buscarClientePorId } from "./clientes";
import { buscarProdutoPorId } from "./produtos";
import { obterCarrinho, limparCarrinho } from "./carrinho";

// Todos os pedidos registrados (em memória) e o contador para gerar identificadores únicos.
const pedidos: Pedido[] = [];
let proximoId = 1;

// Transforma o carrinho de um cliente em um pedido registrado.
export function finalizarPedido(clienteId: number): Pedido {
  // 1) O cliente deve existir (obterCarrinho valida) e o carrinho não pode estar vazio.
  const carrinho = obterCarrinho(clienteId);
  if (carrinho.itens.length === 0) {
    throw new Error("Não é possível finalizar um pedido sem itens.");
  }

  // 2) VALIDAR TUDO antes de alterar qualquer coisa: se um único item falhar, o estoque não é tocado.
  const itensPedido: ItemPedido[] = carrinho.itens.map((item) => {
    const produto = buscarProdutoPorId(item.produtoId);
    if (produto === undefined) {
      throw new Error(`Produto com id ${item.produtoId} não encontrado.`);
    }
    if (item.quantidade > produto.estoque) {
      throw new Error(
        `Estoque insuficiente para "${produto.nome}": disponível ${produto.estoque}, solicitado ${item.quantidade}. Pedido não registrado.`
      );
    }
    // Guardamos o preço DESTE momento, para que mudanças futuras no catálogo não afetem o pedido.
    return {
      produtoId: produto.id,
      nome: produto.nome,
      quantidade: item.quantidade,
      precoUnitario: produto.preco,
    };
  });

  // 3) Tudo é válido: agora sim descontamos o estoque.
  for (const item of itensPedido) {
    const produto = buscarProdutoPorId(item.produtoId);
    if (produto !== undefined) {
      produto.estoque -= item.quantidade;
    }
  }

  // 4) Calculamos o total e registramos o pedido.
  const total = itensPedido.reduce(
    (soma, item) => soma + item.precoUnitario * item.quantidade,
    0
  );

  const novoPedido: Pedido = {
    id: proximoId++,
    clienteId,
    itens: itensPedido,
    total,
    data: new Date(),
  };
  pedidos.push(novoPedido);

  // 5) O carrinho fica vazio depois da compra.
  limparCarrinho(clienteId);

  return novoPedido;
}

// Retorna todos os pedidos.
export function consultarPedidos(): Pedido[] {
  return pedidos;
}

// Retorna os pedidos de um cliente específico.
export function consultarPedidosPorCliente(clienteId: number): Pedido[] {
  if (buscarClientePorId(clienteId) === undefined) {
    throw new Error(`Cliente com id ${clienteId} não encontrado.`);
  }
  return pedidos.filter((pedido) => pedido.clienteId === clienteId);
}
