import { apiDelete, apiFetch, apiPost, apiPut } from "./api";

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

export async function createPlant({ nome, especie, posicaoX, posicaoY, plantacaoId }) {
    const res = await apiPost('/plant',{ 
        nome, 
        especie,
        posicaoX,
        posicaoY,
        plantacaoId
    });

    if (!res.ok) {
        const data = await res.json();

        return { error: data.message || data.error, success: false }
    }

    return { error: '', success: true }
}

export async function editPlant({ nome, especie, posicaoX, posicaoY, planta_id }) {
    const res = await apiPut(`/plant/${planta_id}`,{ 
        nome, 
        especie,
        posicaoX,
        posicaoY
    });

    if (!res.ok) {
        const data = await res.json();

        return { error: data.message || data.error, success: false }
    }

    const data = await res.json();

    return { error: '', success: true, plant: data }
}

export async function deletePlant({ plantId }) {
    const res = await apiDelete(`/plant/${plantId}`);

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
          posicaoX: plant.posicaoX,
          posicaoY: plant.posicaoY,
          available: false,
          status: 'healthy'
        });
      } else {
        result.push({
          id: `nullx${x}y${y}`,
          nome: '',
          especie_planta: '',
          posicaoX: x,
          posicaoY: y,
          available: true
        });
      }
    }
  }

  return result;
}