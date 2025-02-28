<template>
  <div>
    <h1>Criar Novo Grupo</h1>
    <form @submit.prevent="createGroup">
      <input v-model="name" placeholder="Nome do Grupo" required />
      <input v-model="maxProfiles" type="number" placeholder="Máximo de Perfis" required />
      <select v-model="status" required>
        <option value="aberta">Aberta</option>
        <option value="fechada">Fechada</option>
      </select>
      <input type="file" @change="handleImageUpload" />
      <button type="submit">Criar Grupo</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { db, auth } from "@/utils/firebase";
import { addDoc, collection } from "firebase/firestore";

const name = ref("");
const maxProfiles = ref(0);
const status = ref("aberta");
const image = ref(null);

const createGroup = async () => {
  const user = auth.currentUser;
  if (user) {
    try {
      const groupRef = collection(db, "groups");
      const groupData = {
        name: name.value,
        maxProfiles: maxProfiles.value,
        status: status.value,
        createdBy: user.uid,
        members: [user.uid],
        requests: [],
        image: image.value || null, // Caso o usuário envie uma imagem
      };

      await addDoc(groupRef, groupData);
      alert("Grupo criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
    }
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Faça o upload da imagem, se necessário
    image.value = file; // Placeholder para a imagem
  }
};
</script>
