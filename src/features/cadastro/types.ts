export type CadastroFormState = {
  nome: string;
  dataNascimento: string;
  telefone: string;
  endereco: string;
  bairro: string;
  numero: string;
  email: string;
  senha: string;
  senhaConfirmacao: string;
};

export const initialCadastroForm: CadastroFormState = {
  nome: "",
  dataNascimento: "",
  telefone: "",
  endereco: "",
  bairro: "",
  numero: "",
  email: "",
  senha: "",
  senhaConfirmacao: ""
};
