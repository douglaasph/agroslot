import { useEffect, useState } from "react";
import Input, { NumericInput } from "./BasicInput";
import BasicButton from "./BasicButton";
import { Alert, Text, TextInput, View } from "react-native";
import { Colors } from "../styles/stylesheets";
import { createPlantation, editPlantation } from "../services/plantation";

export default function CreatePlantationForm({ onCancel, onCreate, edit = false, originalPlantation = null }) {
    const [nomePlantacao, setNomePlantacao] = useState('');
    const [rows, setRows] = useState(0);
    const [cols, setCols] = useState(0);

    const [nomeError, setNomeError] = useState(false);
    const [rowsError, setRowsError] = useState(false);
    const [colsError, setColsError] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const [submitErrorMessage, setSubmitErrorMessage] = useState('');

    useEffect(() => {
        if (edit && originalPlantation) {
            setNomePlantacao(originalPlantation.nome ?? '');
            setRows(originalPlantation.linhas ?? 0);
            setCols(originalPlantation.colunas ?? 0);
        }
    }, [edit, originalPlantation]);

    function showAlert({ title, message, cancel = true }) {
        Alert.alert(
            title = title,
            message = message,
            { cancelable: cancel }
        );
    };

    function handleSubmit() {
        // error 0
        setNomeError(false);
        setRowsError(false);
        setColsError(false);
        setSubmitError(false);
        setSubmitErrorMessage('');

        async function tryCreatePlantation({ nome, rows, cols }) {
            const res = await createPlantation({ nome: nome, colunas: cols, linhas: rows, capacidade: rows * cols });

            if (!res) {
                setSubmitErrorMessage(res.error);
                setSubmitError(true);
            } else {
                showAlert({ title: "Sucesso", message: "Plantação criada com sucesso!" });
                onCreate();
                onCancel();
            }
        }

        tryCreatePlantation({ nome: nomePlantacao, rows, cols });
    }

    function handleSaveChanges() {
        // error 0
        setNomeError(false);
        setRowsError(false);
        setColsError(false);
        setSubmitError(false);
        setSubmitErrorMessage('');

        async function tryEditPlantation({ nome, rows, cols, plantationId }) {
            const res = await editPlantation({ nome: nome, colunas: cols, linhas: rows, capacidade: rows * cols, plantationId });

            if (!res) {
                setSubmitErrorMessage(res.error);
                setSubmitError(true);
            } else {
                showAlert({ title: "Sucesso", message: "Plantação editada com sucesso!" });
                onCreate();
                onCancel();
            }
        }

        tryEditPlantation({ nome: nomePlantacao, rows, cols, plantationId: originalPlantation.id });
    }

    return (
        <View style={{ flexDirection: 'column', gap: 5 }}>
            <Text style={{ fontSize: 18, paddingBottom: 10, color: Colors.colorPrimaryDark.color }}>{edit ? 'Editar' : 'Nova'} Plantação</Text>

            <Input
                label="Nome da Plantação"
                placeholder="Ex.: Talhão Norte"
                value={nomePlantacao}
                onChangeText={setNomePlantacao}
                error={nomeError}
                errorMessage="Nome inválido"
            />
            <NumericInput
                label="Linhas"
                value={rows}
                onChangeValue={setRows}
                error={rowsError}
                errorMessage="Valor de linhas inválido"
                placeholder={0}
            />
            <NumericInput
                label="Colunas"
                value={cols}
                onChangeValue={setCols}
                error={colsError}
                errorMessage="Valor de colunas inválido"
                placeholder={0}
            />

            <View style={{ paddingVertical: 8, borderRadius: 4 }}>
                <Text style={{ padding: 5, borderRadius: 4, backgroundColor: Colors.lightGreen.color, color: Colors.colorPrimaryDark.color }}>Capacidade: {rows * cols} slots ({rows} x {cols})</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <BasicButton title="Cancelar" onPress={onCancel} color={Colors.softGray.color} />
                <BasicButton disabled={nomePlantacao.length < 2 || rows <= 0 || cols <= 0} title={edit ? 'Salvar' : "Criar Plantação"} onPress={edit ? handleSaveChanges : handleSubmit} />
            </View>

            <Text style={{ color: Colors.colorDanger.color, display: submitError ? 'flex' : 'none' }}>{submitErrorMessage}</Text>

        </View>
    )
}