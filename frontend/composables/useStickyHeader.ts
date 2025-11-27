import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  unref,
  type MaybeRef,
} from "vue";

export function useStickyHeader(isMobile?: MaybeRef<boolean>) {
  const headerRef = ref<HTMLElement | null>(null);
  const headerInView = ref(true);

  let observer: IntersectionObserver | null = null;

  // ถ้าไม่ส่ง isMobile มา => ถือว่าใช้ทุก device
  const shouldEnable = computed(() => (isMobile ? !!unref(isMobile) : true));

  // sticky โผล่เมื่อ "เปิดใช้งาน" และ header หลักไม่อยู่ในจอ
  const showStickyHeader = computed(
    () => shouldEnable.value && !headerInView.value
  );

  const startObserve = () => {
    if (observer || !headerRef.value) return;

    observer = new IntersectionObserver(
      ([entry]) => {
        headerInView.value = entry.isIntersecting;
      },
      { threshold: 0 }
    );

    observer.observe(headerRef.value);
  };

  const stopObserve = () => {
    if (observer && headerRef.value) observer.unobserve(headerRef.value);
    observer = null;
    headerInView.value = true; // ปิด sticky เมื่อไม่ได้ใช้
  };

  onMounted(() => {
    if (shouldEnable.value) startObserve();
  });

  // ถ้ามี isMobile แล้ว runtime เปลี่ยน (เช่น resize/rotate) ให้สลับ observer
  if (isMobile) {
    watch(shouldEnable, (val) => {
      if (val) startObserve();
      else stopObserve();
    });
  }

  onBeforeUnmount(() => stopObserve());

  return {
    headerRef,
    headerInView,
    showStickyHeader,
  };
}
