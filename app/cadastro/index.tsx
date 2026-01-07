import React from "react";
import {
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaskedTextInput } from "react-native-mask-text";

import { globalStyles } from "../../src/styles/globalStyles";
import { useCadastroForm } from "../../src/features/cadastro/useCadastroForm";
import FormField from "../../src/components/form/FormField";

export default function CadastroScreen() {
  const {
    formCadastro,
    setFormCadastro,
    validate,
    touchField,
    showError,
  } = useCadastroForm();

  function handleCadastrar() {
    const result = validate();

    // Se quiser, aqui você pode bloquear e mostrar alerta:
    // if (!result.ok) {
    //   Alert.alert("Ops", "Revise os campos obrigatórios.");
    //   return;
    // }
  }

  return (
    <SafeAreaView style={globalStyles.safe}>
      <KeyboardAvoidingView
        style={globalStyles.safe}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={globalStyles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={globalStyles.titulo}>Criar Cadastro</Text>

          <FormField label="Nome" required error={showError("nome")}>
            <TextInput
              value={formCadastro.nome}
              onChangeText={(nome) => setFormCadastro("nome", nome)}
              onBlur={() => touchField("nome")}
              placeholder="Seu nome completo"
              style={globalStyles.campo}
              returnKeyType="next"
            />
          </FormField>

          <FormField
            label="Data de nascimento"
            required
            error={showError("dataNascimento")}
          >
            <MaskedTextInput
              mask="99/99/9999"
              placeholder="DD/MM/AAAA"
              value={formCadastro.dataNascimento}
              onChangeText={(dataNascimento) =>
                setFormCadastro("dataNascimento", dataNascimento)
              }
              onBlur={() => touchField("dataNascimento")}
              style={globalStyles.campo}
              keyboardType="number-pad"
              returnKeyType="next"
            />
          </FormField>

          <FormField label="Telefone" required error={showError("telefone")}>
            <MaskedTextInput
              mask="(99) 99999-9999"
              placeholder="(00) 00000-0000"
              value={formCadastro.telefone}
              onChangeText={(telefone) => setFormCadastro("telefone", telefone)}
              onBlur={() => touchField("telefone")}
              style={globalStyles.campo}
              keyboardType="number-pad"
              returnKeyType="next"
            />
          </FormField>

          <FormField label="Endereço" required error={showError("endereco")}>
            <TextInput
              value={formCadastro.endereco}
              onChangeText={(endereco) => setFormCadastro("endereco", endereco)}
              onBlur={() => touchField("endereco")}
              placeholder="Rua/Av."
              style={globalStyles.campo}
              returnKeyType="next"
            />
          </FormField>

          <FormField label="Bairro" required error={showError("bairro")}>
            <TextInput
              value={formCadastro.bairro}
              onChangeText={(bairro) => setFormCadastro("bairro", bairro)}
              onBlur={() => touchField("bairro")}
              placeholder="Bairro"
              style={globalStyles.campo}
              returnKeyType="next"
            />
          </FormField>

          <FormField label="N°" required error={showError("numero")}>
            <TextInput
              value={formCadastro.numero}
              onChangeText={(numero) => setFormCadastro("numero", numero)}
              onBlur={() => touchField("numero")}
              placeholder="Número"
              style={globalStyles.campo}
              keyboardType="number-pad"
              returnKeyType="next"
            />
          </FormField>

          <FormField label="E-mail" required error={showError("email")}>
            <TextInput
              value={formCadastro.email}
              onChangeText={(email) => setFormCadastro("email", email)}
              onBlur={() => touchField("email")}
              placeholder="seuemail@seuemail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              style={globalStyles.campo}
              returnKeyType="next"
            />
          </FormField>

          <FormField label="Senha" required error={showError("senha")}>
            <TextInput
              value={formCadastro.senha}
              onChangeText={(senha) => setFormCadastro("senha", senha)}
              onBlur={() => touchField("senha")}
              placeholder="••••••••"
              secureTextEntry
              style={globalStyles.campo}
              returnKeyType="done"
            />
          </FormField>

          <FormField
            label="Confirmar senha"
            required
            error={showError("senhaConfirmacao")}
          >
            <TextInput
              value={formCadastro.senhaConfirmacao}
              onChangeText={(senhaConfirmacao) =>
                setFormCadastro("senhaConfirmacao", senhaConfirmacao)
              }
              onBlur={() => touchField("senhaConfirmacao")}
              placeholder="••••••••"
              secureTextEntry
              style={globalStyles.campo}
              returnKeyType="done"
            />
          </FormField>

          <View style={globalStyles.containerBotao}>
            <TouchableOpacity style={globalStyles.botao} onPress={handleCadastrar}>
              <Text style={globalStyles.textoBotao}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
