import { ref, onMounted } from "vue";
import { auth } from "~/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

const user = ref(null);

export const useAuth = () => {
  onMounted(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser;
    });
  });

  return { user };
};
