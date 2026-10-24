import { Pedido, ItemPedido } from "./types";
import { buscarClientePorId } from "./clientes";
import { buscarProdutoPorId } from "./produtos";
import { obterCarrinho, limparCarrinho } from "./carrinho";

// Todos los pedidos registrados (en memoria) y el contador para generar ids únicos.
const pedidos: Pedido[] = [];
let proximoId = 1;

// Convierte el carrito de un cliente en un pedido registrado.
export function finalizarPedido(clienteId: number): Pedido {
  // 1) El cliente debe existir (obterCarrinho lo valida) y el carrito no puede estar vacío.
  const carrinho = obterCarrinho(clienteId);
  if (carrinho.itens.length === 0) {
    throw new Error("Nao e possivel finalizar um pedido sem itens.");
  }

  // 2) VALIDAR TODO antes de cambiar nada: si un solo item falla, no se toca el stock.
  const itensPedido: ItemPedido[] = carrinho.itens.map((item) => {
    const produto = buscarProdutoPorId(item.produtoId);
    if (produto === undefined) {
      throw new Error(`Produto com id ${item.produtoId} nao encontrado.`);
    }
    if (item.quantidade > produto.estoque) {
      throw new Error(
        `Estoque insuficiente para "${produto.nome}": disponivel ${produto.estoque}, solicitado ${item.quantidade}. Pedido nao registrado.`
      );
    }
    // Guardamos el precio de ESTE momento para que cambios futuros no afecten el pedido.
    return {
      produtoId: produto.id,
      nome: produto.nome,
      quantidade: item.quantidade,
      precoUnitario: produto.preco,
    };
  });

  // 3) Todo es válido: ahora sí descontamos el stock.
  for (const item of itensPedido) {
    const produto = buscarProdutoPorId(item.produtoId);
    if (produto !== undefined) {
      produto.estoque -= item.quantidade;
    }
  }

  // 4) Calculamos el total y registramos el pedido.
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

  // 5) El carrito queda vacío después de la compra.
  limparCarrinho(clienteId);

  return novoPedido;
}

// Devuelve todos los pedidos.
export function consultarPedidos(): Pedido[] {
  return pedidos;
}

// Devuelve los pedidos de un cliente específico.
export function consultarPedidosPorCliente(clienteId: number): Pedido[] {
  if (buscarClientePorId(clienteId) === undefined) {
    throw new Error(`Cliente com id ${clienteId} nao encontrado.`);
  }
  return pedidos.filter((pedido) => pedido.clienteId === clienteId);
}