import { apiFetch, apiPost, apiPut } from "./api";

export async function getPlantsByPlantationId({plantationId, rows, cols}) {
    const res = await apiFetch(`/plant/${plantationId}`);

    if (!res.ok) {
        const data = await res.json();

        return { error: data.message || data.error, success: false }
    }

    const data = await res.json();
    const formattedPlants = formatPlants({plants: data, capacidadeX: rows, capacidadeY: cols});

    return { error: '', success: true, plants: formattedPlants }
}

export async function createPlant({ nome, especie, posicao_x, posicao_y, plantacao_id }) {
    const res = await apiPost('/plant',{ 
        nome, 
        especie,
        posicaoX: posicao_x,
        posicaoY: posicao_y,
        plantacaoId: plantacao_id
    });

    if (!res.ok) {
        const data = await res.json();

        return { error: data.message || data.error, success: false }
    }

    return { error: '', success: true }
}

export async function editPlant({ nome, especie, posicao_x, posicao_y, planta_id }) {
    const res = await apiPut(`/plant/${planta_id}`,{ 
        nome, 
        especieplanta: especie,
        posicao_y,
        posicao_x,
    });

    if (!res.ok) {
        const data = await res.json();

        return { error: data.message || data.error, success: false }
    }

    return { error: '', success: true }
}

function formatPlants({plants, capacidadeX, capacidadeY}) {
  const plantsMap = new Map(
    plants.map((plant) => [
      `${plant.posicaoX}-${plant.posicaoY}`,
      plant
    ])
  );

  const result = [];

  for (let y = 1; y <= capacidadeY; y++) {
    for (let x = 1; x <= capacidadeX; x++) {
      const plant = plantsMap.get(`${x}-${y}`);

      if (plant) {
        result.push({
          id: plant.id,
          nome: plant.nome,
          especie_planta: plant.especie,
          posicao_x: plant.posicaoX,
          posicao_y: plant.posicaoY,
          available: false,
          status: 'healthy'
        });
      } else {
        result.push({
          id: `nullx${x}y${y}`,
          nome: '',
          especie_planta: '',
          posicao_x: x,
          posicao_y: y,
          available: true
        });
      }
    }
  }

  return result;
}