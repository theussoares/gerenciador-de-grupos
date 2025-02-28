<template>
  <div>
    <h1>Editar Grupo</h1>
    <form @submit.prevent="editGroup">
      <input v-model="name" placeholder="Nome do Grupo" required />
      <input v-model="maxProfiles" type="number" placeholder="Máximo de Perfis" required />
      <select v-model="status" required>
        <option value="aberta">Aberta</option>
        <option value="fechada">Fechada</option>
      </select>
      <button type="submit">Salvar Alterações</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { db } from "@/utils/firebase";
import { doc, updateDoc } from "firebase/firestore";

const route = useRoute();
const groupId = route.params.id;

const name = ref("");
const maxProfiles = ref(0);
const status = ref("aberta");

const editGroup = async () => {
  try {
    const groupRef = doc(db, "groups", groupId);
    const updatedData = {
      name: name.value,
      maxProfiles: maxProfiles.value,
      status: status.value,
    };
    await updateDoc(groupRef, updatedData);
    alert("Grupo atualizado com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar grupo:", error);
  }
};

const addMember = async (groupId, userId) => {
  const groupRef = doc(db, "groups", groupId);
  const groupSnapshot = await getDoc(groupRef);

  if (groupSnapshot.exists()) {
    const groupData = groupSnapshot.data();

    if (groupData.status === "fechada") {
      alert("Não é possível adicionar membros a um grupo fechado.");
      return;
    }

    if (groupData.members.length < groupData.maxProfiles) {
      const updatedMembers = [...groupData.members, userId];
      await updateDoc(groupRef, { members: updatedMembers });
      alert("Membro adicionado!");
    } else {
      alert("Limite de membros atingido.");
    }
  }
};

const approveRequest = async (groupId, userId) => {
  const groupRef = doc(db, "groups", groupId);
  const groupSnapshot = await getDoc(groupRef);
  const groupData = groupSnapshot.data();

  const updatedRequests = groupData.requests.filter((id) => id !== userId);
  const updatedMembers = [...groupData.members, userId];

  await updateDoc(groupRef, { requests: updatedRequests, members: updatedMembers });
};

const rejectRequest = async (groupId, userId) => {
  const groupRef = doc(db, "groups", groupId);
  const groupSnapshot = await getDoc(groupRef);
  const groupData = groupSnapshot.data();

  const updatedRequests = groupData.requests.filter((id) => id !== userId);

  await updateDoc(groupRef, { requests: updatedRequests });
};

</script>
