# Sistema de Gerenciamento de E-commerce (TypeScript)

Mini-Projeto Avaliativo - Módulo 1 - Semana 07 | Desenvolvedor Back-End Node [T5] - SCTEC

- **Estudante:** [Ruben Arquimedes Garcia Manrique]
- **Turma:** [QA DBEN 2026/1 4]

## Objetivo

Aplicação de linha de comando, feita em TypeScript e executada com Node.js, que simula as operações de uma pequena loja virtual: cadastro de produtos e clientes, carrinho de compras, finalização de pedidos com controle de estoque e relatórios de vendas. Todos os dados ficam em memória durante a execução.

## Funcionalidades implementadas

- **Produtos:** cadastrar, listar, buscar por id, buscar por nome (parte do nome), filtrar por categoria, atualizar e remover.
- **Clientes:** cadastrar, listar e buscar por id (a aplicação já inicia com 3 clientes).
- **Carrinho:** adicionar produto, remover produto, alterar quantidade, listar itens, calcular subtotal de cada item e total da compra.
- **Pedidos:** finalizar um carrinho em pedido, consultar todos os pedidos e consultar os pedidos de um cliente.
- **Relatórios:** total vendido, vendas por produto, vendas por cliente, estoque atual e produtos com estoque baixo.

## Tecnologias utilizadas

- TypeScript
- Node.js
- npm

Sem banco de dados, sem frameworks e sem bibliotecas externas de execução (apenas `typescript` e `@types/node` como dependências de desenvolvimento).

## Estrutura dos arquivos

```
src/
├── types.ts       # Tipos: Categoria, Produto, Cliente, ItemCarrinho, Carrinho, ItemPedido, Pedido
├── produtos.ts    # Cadastro, consulta, atualização e remoção de produtos
├── clientes.ts    # Cadastro e consulta de clientes
├── carrinho.ts    # Operações do carrinho e cálculo dos valores
├── pedidos.ts     # Finalização e consulta de pedidos
├── relatorios.ts  # Consolidação e apresentação dos resultados
└── main.ts        # Demonstração do funcionamento
```

## Como compilar e executar

Pré-requisito: Node.js instalado (versão LTS).

```bash
npm install        # instala as dependências
npm run build      # compila o TypeScript para JavaScript (pasta dist/)
npm start          # executa node dist/main.js
```

## Exemplos das principais operações

```ts
// Produtos
cadastrarProduto({ id: 7, nome: "Webcam HD", categoria: "perifericos", preco: 180, estoque: 12 });
atualizarProduto(2, { preco: 110 });
buscarProdutosPorNome("mouse");
filtrarProdutosPorCategoria("acessorios");

// Clientes
cadastrarCliente({ id: 4, nome: "Pedro Alves", email: "pedro.alves@email.com" });

// Carrinho
adicionarAoCarrinho(1, 2, 2);   // cliente 1, produto 2, quantidade 2
alterarQuantidade(1, 2, 5);
calcularTotalCarrinho(1);

// Pedido e relatórios
finalizarPedido(1);
consultarPedidosPorCliente(1);
exibirRelatorios();
```

O arquivo `src/main.ts` executa esses fluxos, incluindo casos válidos e inválidos, e mostra o resultado no terminal.

## Regras de negócio implementadas

**Produtos**
- O id deve ser único.
- O nome não pode estar vazio.
- O preço deve ser maior que zero.
- O estoque não pode ser negativo.

**Clientes**
- Nome e e-mail são obrigatórios; o e-mail deve conter `@` e `.`.
- Não são permitidos id nem e-mail repetidos (o e-mail é comparado sem diferenciar maiúsculas de minúsculas).

**Carrinho**
- A quantidade deve ser um número inteiro maior que zero.
- Não é possível adicionar produtos inexistentes nem quantidade superior ao estoque disponível (considerando o que já está no carrinho).
- Se o mesmo produto for adicionado novamente, a quantidade é somada na mesma linha.
- Subtotal = preço unitário × quantidade; total = soma dos subtotais.

**Pedidos**
- Não é possível finalizar um pedido sem itens nem para um cliente inexistente.
- Todos os itens são validados antes de qualquer alteração: se algum não tiver estoque suficiente, o pedido não é registrado e nenhum estoque é descontado.
- O preço praticado no momento da compra é gravado no pedido, então mudanças futuras no catálogo não alteram pedidos anteriores.
- Cada pedido recebe um identificador único e sequencial; após a finalização, o estoque é atualizado e o carrinho é esvaziado.

## Limitações conhecidas

- Os dados ficam apenas em memória: ao encerrar o programa, tudo é perdido.
- Não há autenticação, pagamento, frete, cupons de desconto nem interface gráfica.
- Os ids de produtos e clientes são informados manualmente no cadastro.
- Remover um produto do catálogo não verifica se ele está em algum carrinho aberto.
- Carrinhos abertos usam o preço atual do catálogo; o preço só é "congelado" ao finalizar o pedido.
- Não há testes automatizados: a validação é feita pelas demonstrações em `main.ts`.