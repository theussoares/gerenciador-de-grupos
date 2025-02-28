import { getUserRole } from "@/utils/auth";
import { auth } from "@/utils/firebase";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = auth.currentUser;
  if (!user) {
    return navigateTo("/login");
  }

  const role = await getUserRole(user.uid);
  if (role !== "admin") {
    return navigateTo("/"); // ✅ Redireciona usuários comuns
  }
});
