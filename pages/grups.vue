<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Lista de Grupos</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="group in groups" 
        :key="group.id" 
        class="border rounded-lg p-4 shadow-md flex flex-col items-center"
      >
        <img :src="group.image || '/default-group.png'" class="w-24 h-24 rounded-full mb-2" />
        <h2 class="text-xl font-semibold">{{ group.name }}</h2>
        <p>Status: <span :class="group.status === 'aberta' ? 'text-green-500' : 'text-red-500'">{{ group.status }}</span></p>
        <p>Membros: {{ group.members.length }} / {{ group.maxProfiles }}</p>

        <button 
          v-if="group.status === 'aberta' && !group.members.includes(userId) && !group.requests.includes(userId)" 
          @click="requestEntry(group.id)" 
          class="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Solicitar Entrada
        </button>

        <p v-if="group.requests.includes(userId)" class="text-yellow-500 mt-2">Aguardando aprovação...</p>
        
        <button 
          @click="openMembersModal(group.id, group.name)" 
          class="bg-gray-500 text-white px-4 py-2 rounded mt-2"
        >
          Ver Membros
        </button>
      </div>
    </div>

    <!-- Modal de Membros -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-96">
        <h2 class="text-xl font-bold mb-4">Membros de {{ selectedGroupName }}</h2>
        <ul>
          <li v-for="member in members" :key="member.userId" class="border-b p-2">
            <span class="font-semibold">{{ member.name }}</span> - 
            <span class="italic">{{ member.rank }}</span> - 
            <span class="text-blue-500">XP: {{ member.xp }}</span>
          </li>
        </ul>
        <button @click="showModal = false" class="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db, auth } from "@/utils/firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";

const groups = ref([]);
const showModal = ref(false);
const members = ref([]);
const selectedGroupName = ref("");
const userId = ref(auth.currentUser ? auth.currentUser.uid : null);

const fetchGroups = async () => {
  const groupsCollection = await getDocs(collection(db, "groups"));
  groups.value = groupsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const requestEntry = async (groupId) => {
  const groupRef = doc(db, "groups", groupId);
  const groupSnapshot = await getDoc(groupRef);
  
  if (groupSnapshot.exists()) {
    const groupData = groupSnapshot.data();

    if (!groupData.requests.includes(userId.value)) {
      const updatedRequests = [...groupData.requests, userId.value];
      await updateDoc(groupRef, { requests: updatedRequests });
      alert("Solicitação enviada!");
    } else {
      alert("Você já solicitou entrada neste grupo.");
    }
  }
};

const openMembersModal = async (groupId, groupName) => {
  selectedGroupName.value = groupName;
  members.value = [];

  const groupRef = doc(db, "groups", groupId);
  const groupSnapshot = await getDoc(groupRef);

  if (groupSnapshot.exists()) {
    const groupData = groupSnapshot.data();
    const membersData = await Promise.all(
      groupData.members.map(async (userId) => {
        const userRef = doc(db, "users", userId);
        const userSnapshot = await getDoc(userRef);
        const userData = userSnapshot.data();

        return {
          userId,
          name: userData.name,
          rank: userData.rank || "Sem patente",
          xp: userData.xp || 0
        };
      })
    );

    members.value = membersData.sort((a, b) => b.xp - a.xp); // Ordenação decrescente por XP
  }

  showModal.value = true;
};

onMounted(fetchGroups);
</script>
