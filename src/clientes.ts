import { Cliente } from "./types";

// Mínimo de 3 clientes iniciais para facilitar os testes.
export const clientes: Cliente[] = [
  { id: 1, nome: "Ana Souza", email: "ana.souza@email.com" },
  { id: 2, nome: "Carlos Lima", email: "carlos.lima@email.com" },
  { id: 3, nome: "Mariana Rocha", email: "mariana.rocha@email.com" },
];

// Retorna todos os clientes.
export function listarClientes(): Cliente[] {
  return clientes;
}

// Busca um cliente pelo identificador. Se não existir, retorna undefined.
export function buscarClientePorId(id: number): Cliente | undefined {
  return clientes.find((cliente) => cliente.id === id);
}

// Cadastra um novo cliente, se ele cumprir todas as regras.
export function cadastrarCliente(novoCliente: Cliente): Cliente {
  // 1) Nome e e-mail informados
  if (novoCliente.nome.trim() === "") {
    throw new Error("O nome do cliente deve ser informado.");
  }
  if (novoCliente.email.trim() === "") {
    throw new Error("O e-mail do cliente deve ser informado.");
  }
  // 2) E-mail com formato mínimo válido (tem @ e ponto)
  if (!novoCliente.email.includes("@") || !novoCliente.email.includes(".")) {
    throw new Error("O e-mail informado não é válido.");
  }
  // 3) Identificador único
  if (buscarClientePorId(novoCliente.id) !== undefined) {
    throw new Error(`Já existe um cliente com o id ${novoCliente.id}.`);
  }
  // 4) E-mail único (sem diferenciar maiúsculas de minúsculas)
  const emailNovo = novoCliente.email.trim().toLowerCase();
  const emailRepetido = clientes.some(
    (cliente) => cliente.email.toLowerCase() === emailNovo
  );
  if (emailRepetido) {
    throw new Error(`Já existe um cliente com o e-mail ${novoCliente.email}.`);
  }

  clientes.push(novoCliente);
  return novoCliente;
}
