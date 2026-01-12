import { useMemo, useState } from "react";
import { initialCadastroForm, type Pessoa } from "./types";
import {
  validateCadastro,
  validateField,
  hasErrors,
  type CadastroErrors,
} from "./validators";
import { Alert } from "react-native";
import { salvarPessoa } from "../../services/pessoa";
import { brDateToISO } from "../../utils/formataData";

type TouchedState = Partial<Record<keyof Pessoa, boolean>>;

export function useCadastroForm() {
  const [formCadastro, setForm] = useState<Pessoa>(initialCadastroForm);
  const [errors, setErrors] = useState<CadastroErrors>({});
  const [touched, setTouched] = useState<TouchedState>({});

  const [submitAttempted, setSubmitAttempted] = useState(false);

  const setFormCadastro = <K extends keyof Pessoa>(key: K, value: Pessoa[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };

      if (submitAttempted || touched[key]) {
        const msg = validateField(next, key);

        setErrors((prevErr) => {
          const nextErr = { ...prevErr };

          if (msg) nextErr[key] = msg;
          else delete nextErr[key];

          if (key === "senha" || key === "senhaConfirmacao") {
            const msgConfirm = validateField(next, "senhaConfirmacao");
            if (msgConfirm) nextErr.senhaConfirmacao = msgConfirm;
            else delete nextErr.senhaConfirmacao;
          }

          return nextErr;
        });
      }

      return next;
    });
  };

  const touchField = <K extends keyof Pessoa>(key: K, nextValue?: Pessoa[K]) => {
    setTouched((prev) => ({ ...prev, [key]: true }));

    const snapshot =
      nextValue !== undefined
        ? ({ ...formCadastro, [key]: nextValue } as Pessoa)
        : formCadastro;

    setErrors((prevErr) => {
      const msg = validateField(snapshot, key);
      const nextErr = { ...prevErr };

      if (msg) nextErr[key] = msg;
      else delete nextErr[key];

      if (key === "senha" || key === "senhaConfirmacao") {
        const msgConfirm = validateField(snapshot, "senhaConfirmacao");
        if (msgConfirm) nextErr.senhaConfirmacao = msgConfirm;
        else delete nextErr.senhaConfirmacao;
      }

      return nextErr;
    });
  };

  const validate = () => {
    const nextErrors = validateCadastro(formCadastro);
    setErrors(nextErrors);
    return { ok: !hasErrors(nextErrors), errors: nextErrors };
  };

  function handleCadastrar() {
    setSubmitAttempted(true);
    setTouched((prev) => ({
      ...prev,
      nome: true,
      dataNascimento: true,
      telefone: true,
      endereco: true,
      bairro: true,
      numero: true,
      municipioResidencia: true,
      municipioCongregacao: true,
      setorCongregacao: true,
      atividadeProfissional: true,
      email: true,
      senha: true,
      senhaConfirmacao: true,
    }));

    const controller = new AbortController();
    const result = validate();

    if (!result.ok) {
      Alert.alert("Ops", "Revise os campos obrigatórios.");
      return;
    }

    const payload: Pessoa = {
      ...formCadastro,
      dataNascimento: brDateToISO(formCadastro.dataNascimento) ?? "",
      linkFoto: 'lslslslslsl'
    };

    console.log(payload);
    
    salvarPessoa(payload, controller.signal)
      .then(() => {
        Alert.alert("Sucesso!", "Membro cadastrado com sucesso!");
      })
      .catch(() => {
        Alert.alert("Erro", "Não foi possível cadastrar.");
      });
  }

  const canSubmit = useMemo(() => {
    return (
      !!formCadastro.nome &&
      !!formCadastro.email &&
      !!formCadastro.senha &&
      !!formCadastro.senhaConfirmacao
    );
  }, [
    formCadastro.nome,
    formCadastro.email,
    formCadastro.senha,
    formCadastro.senhaConfirmacao,
  ]);

  const reset = () => {
    setForm(initialCadastroForm);
    setErrors({});
    setTouched({});
    setSubmitAttempted(false);
  };

  const showError = <K extends keyof Pessoa>(key: K) =>
    submitAttempted || touched[key] ? errors[key] : undefined;

  return {
    formCadastro,
    setFormCadastro,
    errors,
    touched,
    submitted: submitAttempted,
    touchField,
    showError,
    validate,
    canSubmit,
    reset,
    handleCadastrar,
  };
}
