<template>
  <div class="bg-zinc-950 min-h-screen w-full flex justify-center items-center">
    <h1
      v-if="step == 1"
      id="text"
      class="text-amber-500 text-2xl font-extrabold slideInFromLeft"
    >
      Bora completar seu peril?
    </h1>
    <div id="form" v-else class="flex flex-col items-center justify-center min-h-screen slideInUp">
      <h1 class="text-amber-500 text-2xl font-bold mb-4">Perfil</h1>

      <form @submit.prevent="updateProfile" class="flex flex-col gap-3 w-80 text-white">
        <input
          v-model="profile.name"
          type="text"
          placeholder="Nome"
          required
          class="p-2 border border-amber-500 rounded"
        />
        <input
          v-model="profile.nickname"
          type="text"
          placeholder="Apelido"
          required
          class="p-2 border border-amber-500 rounded"
        />
        <input
          v-model="profile.age"
          type="number"
          placeholder="Idade"
          required
          class="p-2 border border-amber-500 rounded"
        />
        <input
          v-model="profile.clan"
          type="text"
          placeholder="Clã"
          class="p-2 border border-amber-500 rounded"
        />
        <input
          v-model="profile.patente"
          type="text"
          placeholder="Patente"
          class="p-2 border border-amber-500 rounded"
        />
        <input
          v-model="profile.xp"
          type="number"
          placeholder="quantidade de XP"
          class="p-2 border border-amber-500 rounded"
        />

        <button type="submit" class="p-2 bg-amber-500 text-white rounded">
          Salvar
        </button>
      </form>

      <button
        @click="handleLogout"
        class="mt-4 p-2 bg-red-500 text-white rounded"
      >
        Sair
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserProfile, updateUserProfile, logoutUser } from "~/utils/auth";
import { useAuth } from "~/composables/useAuth";

const { user } = useAuth();
const profile = ref({
  name: "",
  nickname: "",
  age: "",
  clan: "",
  patente: "",
  xp: 0,
});

const step = ref(1);

onMounted(async () => {
  if (user.value) {
    const userProfile = await getUserProfile(user.value.uid);
    if (userProfile) {
      profile.value = userProfile;
    }
  }

    setTimeout(() => {
      document.getElementById("text").classList.remove("slideInFromLeft");
      document.getElementById("text").classList.add("slideUpOut");
    }, 2000);

    setTimeout(() => {
      step.value = 2;
    }, 3500);
});

const updateProfile = async () => {
  if (user.value) {
    await updateUserProfile(user.value.uid, profile.value);
    alert("Perfil atualizado com sucesso!");
  }
};

const handleLogout = async () => {
  await logoutUser();
  alert("Você saiu da conta!");
};
</script>

<style scoped>
.slideInFromLeft {
  animation: slideInFromLeft 1s ease-in-out;
}

.slideUpOut {
  animation: slideUpOut 2s ease-in-out;
}

.slideInUp {
  animation: slideInUp 1s ease-in-out;
}

@keyframes slideInUp {
  0% {
    transform: translateY(1000%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideUpOut {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-1000%);
    opacity: 0;
  }
}

@keyframes slideInFromLeft {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
