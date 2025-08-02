// Teste simples do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD89wDyY436a-BVrnzVLYZbDpR19gR91Og",
  authDomain: "turflow.firebaseapp.com",
  projectId: "turflow",
  storageBucket: "turflow.firebasestorage.app",
  messagingSenderId: "283639909947",
  appId: "1:283639909947:web:52506c5b1df8b18889d61e"
};

console.log('Configuração Firebase:', firebaseConfig);
console.log('Todas as variáveis definidas:', Object.values(firebaseConfig).every(v => v !== undefined));
