import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { createPlant, editPlant } from "../services/plant";
import { Colors } from "../styles/stylesheets";
import BasicButton from "./BasicButton";
import Input, { NumericInput } from "./BasicInput";
import { Dropdown } from 'react-native-element-dropdown';

export default function CreatePlant({ onCancel, onCreate, posicao_x, posicao_y, plantation_id, edit = false, originalPlant = null }) {
    const [nomePlanta, setNomePlanta] = useState('');

    const [nomeError, setNomeError] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const [submitErrorMessage, setSubmitErrorMessage] = useState('');

    const [posicaoX, setPosicaoX] = useState(posicao_x || 0);
    const [posicaoY, setPosicaoY] = useState(posicao_y || 0);

    const categorias = [
        { label: 'Soja', value: 'SOJA' }
    ];
    const [categoria, setCategoria] = useState('');

    useEffect(() => {
        if (edit && originalPlant) {
            setNomePlanta(originalPlant.nome ?? '');
            setPosicaoX(originalPlant.posicaoX);
            setPosicaoY(originalPlant.posicaoY);
            setCategoria(originalPlant.especie_planta);
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

        async function tryCreatePlant({ nome, posicaoX, posicaoY, especie }) {
            const res = await createPlant({
                nome,
                posicaoX,
                posicaoY,
                especie,
                plantacaoId: plantation_id });

            if (!res.success) {
                setSubmitErrorMessage(res.error);
                setSubmitError(true);
            } else {
                showAlert({ title: "Sucesso", message: "Planta criada com sucesso!" });
                onCreate();
                onCancel();
            }
        }

        tryCreatePlant({ nome: nomePlanta, especie: 'SOJA', posicaoX, posicaoY });
    }

    function handleSaveChanges() {
        // error 0
        setNomeError(false);
        setSubmitError(false);
        setSubmitErrorMessage('');

        async function tryEditPlant({ nome, especie, posicaoX, posicaoY, plant_id }) {
            const res = await editPlant({
                nome: nome,
                especie,
                posicaoX,
                posicaoY,
                planta_id: plant_id
            });

            if (!res.success) {
                setSubmitErrorMessage(res.error);
                setSubmitError(true);
            } else {
                showAlert({ title: "Sucesso", message: "Planta editada com sucesso!" });
                onCreate(res.plant);
                onCancel();
            }
        }

      tryEditPlant({ nome: nomePlanta, especie: 'SOJA', posicaoX, posicaoY, plant_id: originalPlant.id });
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
            <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: Colors.colorPrimary.color,
            }}>Espécie</Text>
            <Dropdown
                style={{
                    height: 60,
                    borderWidth: 1,
                    borderColor: Colors.colorSoilLight.color,
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    fontSize: 16,
                    color: Colors.colorPrimaryDark.color,
                    backgroundColor: '#FFFFFF',
                }}
                data={categorias}
                labelField="label"
                valueField="value"
                placeholder="Selecione uma espécie"
                value={categoria}
                onChange={item => setCategoria(item.value)}
                maxHeight={250}
                activeColor="#E8F5E9"
            />
            <NumericInput
                label="Posição X"
                value={posicaoX}
                onChangeValue={setPosicaoX}
                placeholder={0}
            />
            <NumericInput
                label="Posição Y"
                value={posicaoY}
                onChangeValue={setPosicaoY}
                placeholder={0}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <BasicButton title="Cancelar" onPress={onCancel} color={Colors.softGray.color} />
                <BasicButton disabled={nomePlanta.length < 2 || posicaoX < 1 || posicaoY < 1 || categoria == ''} title={edit ? 'Salvar' : "Criar Planta"} onPress={edit ? handleSaveChanges : handleSubmit} />
            </View>

            <Text style={{ color: Colors.colorDanger.color, display: submitError ? 'flex' : 'none' }}>{submitErrorMessage}</Text>

        </View>
    )
}