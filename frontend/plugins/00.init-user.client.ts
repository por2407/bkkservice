export default defineNuxtPlugin(() => {
  if (!import.meta.client) return;
  const auth = useAuthStore();
  if (!auth.isAuthenticated) {
    auth.loadUser();
  }
});