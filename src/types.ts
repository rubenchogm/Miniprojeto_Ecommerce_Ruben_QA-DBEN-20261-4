// Categorias permitidas para os produtos (tipo união: só aceita estes valores)
export type Categoria = "eletronicos" | "perifericos" | "acessorios" | "livros";

// Um produto do catálogo da loja
export type Produto = {
  id: number;
  nome: string;
  categoria: Categoria;
  preco: number;
  estoque: number;
};

// Um cliente cadastrado
export type Cliente = {
  id: number;
  nome: string;
  email: string;
};

// Uma linha do carrinho: qual produto e quantas unidades
export type ItemCarrinho = {
  produtoId: number;
  quantidade: number;
};

// O carrinho de um cliente: quem é o cliente e quais produtos ele leva
export type Carrinho = {
  clienteId: number;
  itens: ItemCarrinho[];
};

// Uma linha do pedido guarda o nome e o preço do momento da compra
export type ItemPedido = {
  produtoId: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
};

// Um pedido registrado
export type Pedido = {
  id: number;
  clienteId: number;
  itens: ItemPedido[];
  total: number;
  data: Date;
};
