import React, { useMemo, useState, useEffect } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
  TextInput,
} from "react-native";

export type DropdownOption<T extends string | number = string> = {
  label: string;
  value: T;
  disabled?: boolean;
};

type DropdownFieldProps<T extends string | number = string> = {
  value?: T;
  options: DropdownOption<T>[];
  placeholder?: string;
  onChange: (value: T) => void;
  disabled?: boolean;

  // marca touched quando fecha sem selecionar
  onBlur?: () => void;

  invalid?: boolean;

  // ✅ filter
  searchable?: boolean; // default true
  searchPlaceholder?: string;
  emptyText?: string;
};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .trim();

export function DropdownField<T extends string | number = string>({
  value,
  options,
  placeholder = "Selecione",
  onChange,
  disabled,
  onBlur,
  invalid,
  searchable = true,
  searchPlaceholder = "Buscar...",
  emptyText = "Nenhum resultado",
}: DropdownFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = useMemo(
    () => options.find((o) => o.value === value),
    [options, value]
  );

  // ✅ filtra opções
  const filteredOptions = useMemo(() => {
    if (!searchable) return options;

    const q = normalize(query);
    if (!q) return options;

    return options.filter((opt) => normalize(opt.label).includes(q));
  }, [options, query, searchable]);

  function openModal() {
    if (disabled) return;
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    onBlur?.(); // fecha sem selecionar -> touched
  }

  function selectValue(v: T) {
    onChange(v);
    setOpen(false); // selecionou -> fecha
  }

  // ✅ limpa a busca quando abre/fecha
  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  return (
    <>
      <Pressable
        onPress={openModal}
        style={[
          styles.input,
          disabled && styles.inputDisabled,
          invalid && styles.inputInvalid,
        ]}
      >
        <Text style={[styles.valueText, !selected && styles.placeholder]}>
          {selected?.label ?? placeholder}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.backdrop} onPress={closeModal} />

        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{placeholder}</Text>
            <TouchableOpacity onPress={closeModal} hitSlop={10}>
              <Text style={styles.close}>Fechar</Text>
            </TouchableOpacity>
          </View>

          {searchable ? (
            <View style={styles.searchWrap}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={searchPlaceholder}
                style={styles.searchInput}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
            </View>
          ) : null}

          {filteredOptions.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>{emptyText}</Text>
            </View>
          ) : (
            <FlatList
              data={filteredOptions}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item) => String(item.value)}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                const isDisabled = !!item.disabled;

                return (
                  <TouchableOpacity
                    disabled={isDisabled}
                    onPress={() => selectValue(item.value)}
                    style={[
                      styles.optionRow,
                      isSelected && styles.optionRowSelected,
                      isDisabled && styles.optionRowDisabled,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isDisabled && styles.optionTextDisabled,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected ? <Text style={styles.check}>✓</Text> : null}
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6E6E6",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 1 },
    }),
  },
  inputDisabled: { backgroundColor: "#F6F6F6" },
  inputInvalid: { borderColor: "#D64545" },
  valueText: { fontSize: 15, color: "#2B2B2B" },
  placeholder: { color: "#A6A6A6" },
  chevron: { fontSize: 16, color: "#9A9A9A" },

  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
  sheet: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    maxHeight: "70%",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EFEFEF",
    overflow: "hidden",
  },
  sheetHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sheetTitle: { fontSize: 15, fontWeight: "700", color: "#2B2B2B" },
  close: { fontSize: 13, color: "#6B6B6B", fontWeight: "600" },

  // ✅ search
  searchWrap: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  searchInput: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#2B2B2B",
    backgroundColor: "#FFFFFF",
  },

  optionRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionRowSelected: { backgroundColor: "#FAFAFA" },
  optionRowDisabled: { opacity: 0.5 },
  optionText: { fontSize: 15, color: "#2B2B2B" },
  optionTextDisabled: { color: "#8A8A8A" },
  check: { fontSize: 16, color: "#2B2B2B", fontWeight: "800" },
  separator: { height: 1, backgroundColor: "#F2F2F2" },

  emptyWrap: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#6B6B6B",
    fontSize: 14,
  },
});
