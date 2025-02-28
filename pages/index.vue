<template>
  <div class="min-h-screen bg-zinc-900 flex justify-center">
    <div class="md:max-w-2xl w-full flex flex-col sm:pt-10 bg-zinc-950 ">

        <header class="bg-orange-400 h-fit w-full sm:flex sm:items-center sm:gap-4">
            <img src="~/assets/logo.jpg" alt="Logo" class="h-auto w-auto sm:max-w-xs" />
            <h1 class="hidden sm:flex text-[1.8rem] font-bold">ENTRE PARA O MELHOR RPG DE NARUTO DO WHATSAPP!</h1>
        </header>
        <main class="p-10">
            <h1 class="text-2xl font-bold mb-4 text-amber-100 text-center">{{ isRegistering ? "Faça seu cadastro" : "Bem vindo de volta!" }}</h1>
        
            <form @submit.prevent="handleSubmit" class="flex flex-col gap-3 w-4/5 m-auto text-white">
              <input v-model="email" type="email" placeholder="E-mail" required 
              class="p-2 border rounded border-amber-500 outline-none" />
              <input v-model="password" type="password" placeholder="Senha" required 
              class="p-2 border rounded border-amber-500 outline-none" />
              <button type="submit" class="p-2 bg-amber-600 text-white rounded cursor-pointer">
                {{ isRegistering ? "Cadastrar" : "Entrar" }}
              </button>
              <p class="mt-4 cursor-pointer text-amber-500 text-right" @click="isRegistering = !isRegistering">
                {{ isRegistering ? "Já tem uma conta? Faça login" : "Não tem uma conta? Cadastre-se" }}
              </p>
            </form>
        
        </main>
    </div>
  </div>
</template>

<script setup>
import clsx from 'clsx';
import { ref } from "vue";
import { registerUser, loginUser, logoutUser } from "~/utils/auth";

const email = ref("");
const password = ref("");
const isRegistering = ref(false);
const isMobile = computed(() => window.innerWidth < 640);
const router = useRouter();
const navigate = (path) => router.push(path);

const handleSubmit = async () => {
  try {
    if (isRegistering.value) {
      await registerUser(email.value, password.value);
      alert("Cadastro realizado com sucesso!");
    } else {
      await loginUser(email.value, password.value);
        navigate("/profile");
    }
  } catch (error) {
    alert(error.message);
  }
};

const handleLogout = async () => {
  await logoutUser();
  alert("Você saiu da conta!");
};
</script>
