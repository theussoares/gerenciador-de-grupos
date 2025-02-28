<template>
  <div>
    <h1>Membros do Grupo</h1>
    <ul>
      <li v-for="member in sortedMembers" :key="member.userId">
        {{ member.name }} - XP: {{ member.xp }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";

const groupId = "someGroupId";  // Obtenha o ID do grupo atual de algum modo
const members = ref([]);

const getMembers = async () => {
  const groupRef = doc(db, "groups", groupId);
  const groupSnapshot = await getDoc(groupRef);

  if (groupSnapshot.exists()) {
    const groupData = groupSnapshot.data();
    members.value = await Promise.all(
      groupData.members.map(async (userId) => {
        const userRef = doc(db, "users", userId);
        const userSnapshot = await getDoc(userRef);
        const userData = userSnapshot.data();
        return { userId, name: userData.name, xp: userData.xp || 0 };
      })
    );
  }
};

const sortedMembers = computed(() => {
  return members.value.sort((a, b) => b.xp - a.xp);  // Ordenar por XP
});

onMounted(getMembers);
</script>
