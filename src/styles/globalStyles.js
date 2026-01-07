import { StyleSheet } from "react-native";


export const globalStyles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#fff"
    },
    container: {
        flexGrow: 1,
        padding: 20,
        gap: 10,
        paddingBottom: 48,
    },
    containerCampo: {
        gap: 6
    },
    campo: {
        height: 48,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        paddingHorizontal: 14,
    },
    nomeCampo: {
        fontSize: 14,
        opacity: 0.7
    },
    titulo: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
    obrigatorio: {
        color: "#d32f2f",
        fontWeight: "700",
    },
    erro: {
        color: "#d32f2f",
        fontSize: 12,
    },
    containerBotao: {
        marginTop: 20
    },  
    botao: {
        height: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#4F6F8A",
        marginTop: 8,
    },
    textoBotao: { color: "white", fontWeight: "700" },
    erro: { color: "#d32f2f", fontSize: 12, marginTop: -6 }
})