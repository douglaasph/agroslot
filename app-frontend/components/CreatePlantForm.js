import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { createPlant, editPlant } from "../services/plant";
import { Colors } from "../styles/stylesheets";
import BasicButton from "./BasicButton";
import Input, { NumericInput } from "./BasicInput";

export default function CreatePlant({ onCancel, onCreate, posicao_x, posicao_y, plantation_id, edit = false, originalPlant = null }) {
    const [nomePlanta, setNomePlanta] = useState('');

    const [nomeError, setNomeError] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const [submitErrorMessage, setSubmitErrorMessage] = useState('');

    useEffect(() => {
        if (edit && originalPlant) {
            setNomePlanta(originalPlant.nome ?? '');
        }
    }, [edit, originalPlant]);

    function showAlert({ title, message, cancel = true }) {
        Alert.alert(
            title = title,
            message = message,
        );
    };

    function handleSubmit() {
        // error 0
        setNomeError(false);
        setSubmitError(false);
        setSubmitErrorMessage('');

        async function tryCreatePlant({ nome, posicao_x, posicao_y, especie }) {
            const res = await createPlant({
                nome,
                posicao_x,
                posicao_y,
                especie,
                plantacao_id: plantation_id });

            if (!res.success) {
                setSubmitErrorMessage(res.error);
                setSubmitError(true);
            } else {
                showAlert({ title: "Sucesso", message: "Planta criada com sucesso!" });
                onCreate();
                onCancel();
            }
        }

        tryCreatePlant({ nome: nomePlanta, especie: 'SOJA', posicao_x, posicao_y });
    }

    function handleSaveChanges() {
        // error 0
        setNomeError(false);
        setSubmitError(false);
        setSubmitErrorMessage('');

        async function tryEditPlant({ nome, especie, posicao_x, posicao_y, plant_id }) {
            const res = await editPlant({
                nome: nome,
                especie,
                posicao_x,
                posicao_y,
                plant_id
            });

            if (!res.success) {
                setSubmitErrorMessage(res.error);
                setSubmitError(true);
            } else {
                showAlert({ title: "Sucesso", message: "Planta editada com sucesso!" });
                onCreate();
                onCancel();
            }
        }

        tryEditPlant({ nome: nomePlanta, especie: 'SOJA', posicao_x, posicao_y, plant_id: originalPlant.id });
    }

    return (
        <View style={{ flexDirection: 'column', gap: 5 }}>
            <Text style={{ fontSize: 18, paddingBottom: 10, color: Colors.colorPrimaryDark.color }}>{edit ? 'Editar' : 'Nova'} Planta</Text>

            <Input
                label="Nome da Planta"
                placeholder="Ex.: Soja 1"
                value={nomePlanta}
                onChangeText={setNomePlanta}
                error={nomeError}
                errorMessage="Nome inválido"
            />
            <Input
                label="Espécie"
                placeholder="Ex.: Soja"
                value={"SOJA"}
            />
            <NumericInput
                label="Posição X"
                value={posicao_x}
                placeholder={0}
            />
            <NumericInput
                label="Posição Y"
                value={posicao_y}
                placeholder={0}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <BasicButton title="Cancelar" onPress={onCancel} color={Colors.softGray.color} />
                <BasicButton disabled={nomePlanta.length < 2} title={edit ? 'Salvar' : "Criar Planta"} onPress={edit ? handleSaveChanges : handleSubmit} />
            </View>

            <Text style={{ color: Colors.colorDanger.color, display: submitError ? 'flex' : 'none' }}>{submitErrorMessage}</Text>

        </View>
    )
}