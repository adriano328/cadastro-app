import { Pessoa } from "./types";

export type CadastroErrors = Partial<Record<keyof Pessoa, string>>;

export function validateCadastro(form: Pessoa): CadastroErrors {
  const errors: CadastroErrors = {};

  if (!form.nome.trim()) errors.nome = "Informe seu nome.";
  if (!form.dataNascimento.trim()) errors.dataNascimento = "Informe seu data de nascimento.";
  if (!form.telefone.trim()) errors.telefone = "Informe seu telefone.";
  if (!form.endereco.trim()) errors.endereco = "Informe seu endereco.";
  if (!form.bairro.trim()) errors.bairro = "Informe seu bairro.";
  if (!form.numero.trim()) errors.numero = "Informe o número.";
  if (!form.municipioResidencia?.trim()) errors.municipioResidencia = "Campo obrigatório";
  if (!form.email.trim()) errors.email = "Informe seu e-mail.";
  if (!form.senha.trim()) errors.senha = "Informe sua senha.";
  if (!form.senhaConfirmacao) errors.senhaConfirmacao = "Confirme sua senha.";

  if (form.senha && form.senhaConfirmacao && form.senha !== form.senhaConfirmacao) {
    errors.senhaConfirmacao = "As senhas não coincidem.";
  }

  return errors;
}

export function validateField<K extends keyof Pessoa>(
  form: Pessoa,
  key: K
): string | undefined {
  const all = validateCadastro(form);
  return all[key];
}

export function hasErrors(errors: CadastroErrors): boolean {
  return Object.keys(errors).length > 0;
}
