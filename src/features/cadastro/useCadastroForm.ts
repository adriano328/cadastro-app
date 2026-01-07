import { useMemo, useState } from "react";
import { initialCadastroForm, type CadastroFormState } from "./types";
import {
  validateCadastro,
  validateField,
  hasErrors,
  type CadastroErrors,
} from "./validators";

type TouchedState = Partial<Record<keyof CadastroFormState, boolean>>;

export function useCadastroForm() {
  const [formCadastro, setForm] = useState<CadastroFormState>(initialCadastroForm);
  const [errors, setErrors] = useState<CadastroErrors>({});
  const [touched, setTouched] = useState<TouchedState>({});
  const [submitted, setSubmitted] = useState(false);

  const setFormCadastro = <K extends keyof CadastroFormState>(key: K, value: CadastroFormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };

      // Se já submeteu ou o campo já foi tocado, revalida em tempo real (fica esperto e rápido).
      if (submitted || touched[key]) {
        const msg = validateField(next, key);

        setErrors((prevErr) => {
          const nextErr = { ...prevErr };

          if (msg) nextErr[key] = msg;
          else delete nextErr[key];

          // caso especial: senha altera validação da confirmação
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

  const touchField = <K extends keyof CadastroFormState>(key: K) => {
    setTouched((prev) => ({ ...prev, [key]: true }));

    // valida ao sair do campo
    setErrors((prevErr) => {
      const msg = validateField(formCadastro, key);
      const nextErr = { ...prevErr };

      if (msg) nextErr[key] = msg;
      else delete nextErr[key];

      // caso especial senha/confirmacao (pra atualizar a msg quando sai do campo)
      if (key === "senha" || key === "senhaConfirmacao") {
        const msgConfirm = validateField(formCadastro, "senhaConfirmacao");
        if (msgConfirm) nextErr.senhaConfirmacao = msgConfirm;
        else delete nextErr.senhaConfirmacao;
      }

      return nextErr;
    });
  };

  const validate = () => {
    setSubmitted(true);

    // marca tudo como touched (pra aparecer tudo depois do submit)
    setTouched({
      nome: true,
      dataNascimento: true,
      telefone: true,
      endereco: true,
      bairro: true,
      numero: true,
      email: true,
      senha: true,
      senhaConfirmacao: true,
    });

    const nextErrors = validateCadastro(formCadastro);
    setErrors(nextErrors);

    return { ok: !hasErrors(nextErrors), errors: nextErrors };
  };

  const canSubmit = useMemo(() => {
    return (
      !!formCadastro.nome &&
      !!formCadastro.email &&
      !!formCadastro.senha &&
      !!formCadastro.senhaConfirmacao
    );
  }, [formCadastro.nome, formCadastro.email, formCadastro.senha, formCadastro.senhaConfirmacao]);

  const reset = () => {
    setForm(initialCadastroForm);
    setErrors({});
    setTouched({});
    setSubmitted(false);
  };

  const showError = <K extends keyof CadastroFormState>(key: K) =>
    (submitted || touched[key]) ? errors[key] : undefined;

  return {
    formCadastro,
    setFormCadastro,
    errors,
    touched,
    submitted,
    touchField,
    showError, 
    validate,
    canSubmit,
    reset,
  };
}
