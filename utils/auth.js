// utils/auth.js
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'; // ✅ Adicione `doc` e `updateDoc`


// Função para cadastrar usuário
export const registerUser = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role: "user" // ✅ Define o usuário como comum por padrão
    });

    return user;
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    throw error;
  }
};

// Função para logar usuário
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Erro no login:", error.message);
    throw error;
  }
};

export const getUserRole = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().role; // ✅ Retorna "user" ou "admin"
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erro ao obter papel do usuário:", error);
    throw error;
  }
};

// Buscar perfil do usuário
export const getUserProfile = async (userId) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

// Atualizar perfil do usuário
export const updateUserProfile = async (userId, profileData) => {
  try {
    const docRef = doc(db, "users", userId);
    await setDoc(docRef, profileData, { merge: true }); // ✅ Cria o documento se ele não existir
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
};

// Função para deslogar usuário
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erro ao deslogar:", error.message);
  }
};
