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

import { globalStyles } from "../../src/globalStyles";
import { useCadastroForm } from "../../src/features/cadastro/useCadastroForm";
import { DropdownField } from "../../src/components/dropdown/DropdownField";
import { FormField } from "../../src/components/form/FormField";
import { MUNICIPIOS_MT } from "../../src/data/municipiosMT";
import CameraCapture from "../../src/components/camera/CameraCapture";
import { router } from "expo-router";

export default function CadastroScreen() {
  const { formCadastro, setFormCadastro, touchField, showError, handleCadastrar } =
    useCadastroForm();

  const municipioError = showError("municipioResidencia");
  const municipioInvalid = !!municipioError;
  const municipioCongrecaoError = showError("municipioCongregacao");
  const municipioCongrecaoInvalid = !!municipioCongrecaoError;
  const setorCongrecaoError = showError("setorCongregacao");
  const setorCongrecaoInvalid = !!setorCongrecaoError;
  const atividadeError = showError("setorCongregacao");
  const atividadeInvalid = !!atividadeError;

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

          <FormField label="Data de nascimento" required error={showError("dataNascimento")}>
            <MaskedTextInput
              mask="99/99/9999"
              placeholder="DD/MM/AAAA"
              value={formCadastro.dataNascimento}
              onChangeText={(dataNascimento) => setFormCadastro("dataNascimento", dataNascimento)}
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

          <FormField label="Complemento" error={showError("complemento")}>
            <TextInput
              value={formCadastro.complemento}
              onChangeText={(complemento) => setFormCadastro("complemento", complemento)}
              onBlur={() => touchField("complemento")}
              placeholder="Complemento"
              style={globalStyles.campo}
              returnKeyType="next"
            />
          </FormField>

          <FormField label="Município de Residência" required error={municipioError}>
            <DropdownField
              value={formCadastro.municipioResidencia}
              placeholder="Selecione o município"
              options={MUNICIPIOS_MT}
              searchable
              searchPlaceholder="Buscar município..."
              emptyText="Nada encontrado 😅"
              onChange={(municipio) => setFormCadastro("municipioResidencia", municipio)}
              onBlur={() => touchField("municipioResidencia")}
              invalid={municipioInvalid}
            />
          </FormField>

          <FormField label="Município de Congregação" required error={municipioCongrecaoError}>
            <DropdownField
              value={formCadastro.municipioCongregacao}
              placeholder="Selecione o município"
              options={MUNICIPIOS_MT}
              searchable
              searchPlaceholder="Buscar município..."
              emptyText="Nada encontrado 😅"
              onChange={(municipio) => setFormCadastro("municipioCongregacao", municipio)}
              onBlur={() => touchField("municipioCongregacao")}
              invalid={municipioCongrecaoInvalid}
            />
          </FormField>

          <FormField required label="Atividade Profissional" error={showError("atividadeProfissional")}>
            <TextInput
              value={formCadastro.atividadeProfissional}
              onChangeText={(atividade) => setFormCadastro("atividadeProfissional", atividade)}
              onBlur={() => touchField("atividadeProfissional")}
              style={globalStyles.campo}
              returnKeyType="next"
            />
          </FormField>

          <FormField required label="Setor Congregação" error={showError("setorCongregacao")}>
            <TextInput
              value={formCadastro.setorCongregacao}
              onChangeText={(setor) => setFormCadastro("setorCongregacao", setor)}
              onBlur={() => touchField("setorCongregacao")}
              style={globalStyles.campo}
              returnKeyType="next"
            />
          </FormField>

          <FormField required label="Cargo Eclesiastico" error={showError("cargoEclesiastico")}>
            <TextInput
              value={formCadastro.cargoEclesiastico}
              onChangeText={(cargo) => setFormCadastro("cargoEclesiastico", cargo)}
              onBlur={() => touchField("cargoEclesiastico")}
              style={globalStyles.campo}
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

          <FormField label="Confirmar senha" required error={showError("senhaConfirmacao")}>
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

          <FormField label="Foto">
            <CameraCapture
              onCapture={(uri) => setFormCadastro("linkFoto", uri)}
            />
          </FormField>

          <View style={globalStyles.containerBotao}>
            <TouchableOpacity style={globalStyles.botao} onPress={handleCadastrar}>
              <Text style={globalStyles.textoBotao}>Cadastrar</Text>
            </TouchableOpacity>
            <View style={globalStyles.containerBotao}>
              <TouchableOpacity
                style={globalStyles.botao}
                onPress={() => router.push("/cadastro/liveness")}
              >
                <Text style={globalStyles.textoBotao}>Abrir Liveness</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
