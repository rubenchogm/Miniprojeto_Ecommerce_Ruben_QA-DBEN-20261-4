// Categorías permitidas (como el type Status de clase)
export type Categoria = "eletronicos" | "perifericos" | "acessorios" | "livros";

export type Produto = {
  id: number;
  nome: string;
  categoria: Categoria;
  preco: number;
  estoque: number;
};

export type Cliente = {
  id: number;
  nome: string;
  email: string;
};

// Una línea del carrito: qué producto y cuántas unidades
export type ItemCarrinho = {
  produtoId: number;
  quantidade: number;
};

// Una línea del pedido guarda el precio del momento de la compra
export type ItemPedido = {
  produtoId: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
};

export type Pedido = {
  id: number;
  clienteId: number;
  itens: ItemPedido[];
  total: number;
  data: Date;
};

   // El carrito de un cliente: quién es y qué productos lleva
   export type Carrinho = {
     clienteId: number;
     itens: ItemCarrinho[];
   };