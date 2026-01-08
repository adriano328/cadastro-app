import type { Pessoa } from "./types";

export type CadastroErrors = Partial<Record<keyof Pessoa, string>>;

const isEmpty = (v: unknown) =>
  v === undefined ||
  v === null ||
  (typeof v === "string" && v.trim().length === 0);

const onlyDigits = (v: string) => v.replace(/\D/g, "");

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidDateBR(value: string) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
  const [dd, mm, yyyy] = value.split("/").map(Number);
  if (!dd || !mm || !yyyy) return false;

  const d = new Date(yyyy, mm - 1, dd);
  return (
    d.getFullYear() === yyyy &&
    d.getMonth() === mm - 1 &&
    d.getDate() === dd
  );
}

export function validateCadastro(data: Pessoa): CadastroErrors {
  const errors: CadastroErrors = {};

  if (isEmpty(data.nome)) errors.nome = "Campo obrigatório";

  if (isEmpty(data.dataNascimento)) errors.dataNascimento = "Campo obrigatório";
  else if (typeof data.dataNascimento === "string" && !isValidDateBR(data.dataNascimento))
    errors.dataNascimento = "Data inválida";

  if (isEmpty(data.telefone)) errors.telefone = "Campo obrigatório";
  else if (typeof data.telefone === "string" && onlyDigits(data.telefone).length < 10)
    errors.telefone = "Telefone inválido";

  if (isEmpty(data.endereco)) errors.endereco = "Campo obrigatório";
  if (isEmpty(data.bairro)) errors.bairro = "Campo obrigatório";

  if (isEmpty(data.numero)) errors.numero = "Campo obrigatório";
  else if (typeof data.numero === "string" && Number.isNaN(Number(data.numero)))
    errors.numero = "Número inválido";

  if (isEmpty(data.municipioResidencia)) errors.municipioResidencia = "Campo obrigatório";
  if (isEmpty(data.municipioCongregacao)) errors.municipioCongregacao = "Campo obrigatório";
  if (isEmpty(data.setorCongregacao)) errors.setorCongregacao = "Campo obrigatório";
  if (isEmpty(data.atividadeProfissional)) errors.atividadeProfissional = "Campo obrigatório";

  if (isEmpty(data.email)) errors.email = "Campo obrigatório";
  else if (typeof data.email === "string" && !isValidEmail(data.email))
    errors.email = "E-mail inválido";

  if (isEmpty(data.senha)) errors.senha = "Campo obrigatório";
  else if (typeof data.senha === "string" && data.senha.length < 6)
    errors.senha = "Mínimo 6 caracteres";

  if (isEmpty((data as any).senhaConfirmacao)) (errors as any).senhaConfirmacao = "Campo obrigatório";
  else if ((data as any).senhaConfirmacao !== data.senha)
    (errors as any).senhaConfirmacao = "Senhas não conferem";

  return errors;
}

export function validateField(data: Pessoa, key: keyof Pessoa): string | undefined {
  const all = validateCadastro(data);
  return all[key];
}

export function hasErrors(errors: CadastroErrors) {
  return Object.keys(errors).length > 0;
}
