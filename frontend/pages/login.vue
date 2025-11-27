<template>
  <div
    class="min-h-screen flex items-center bg-slate-50 text-slate-900 relative overflow-hidden"
  >
    <!-- เนื้อหา -->
    <div
      class="relative z-10 max-w-6xl w-full mx-auto px-6 lg:px-10 py-12 lg:py-20 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center"
    >
      <!-- ซ้าย -->
      <section class="hidden lg:block text-slate-900 space-y-6">
        <div class="space-y-4 max-w-xl">
          <p class="text-xs tracking-[0.35em] uppercase text-emerald-600">
            ข้อมูลเพิ่มเติม
          </p>
          <h1 class="text-4xl lg:text-5xl font-bold leading-tight">
            ระบบจัดการบริการห้องคอมพิวเตอร์
          </h1>
          <p class="text-sm lg:text-base text-slate-600 leading-relaxed">
            ระบบสำหรับจัดการงานแจ้งซ่อม ติดตามสถานะ และบันทึกประวัติการดูแล
            อุปกรณ์คอมพิวเตอร์ภายในโรงเรียน
            ช่วยให้ครูและเจ้าหน้าที่ทำงานได้สะดวก และเป็นระบบมากยิ่งขึ้น
          </p>
        </div>
        <div class="mt-6">
          <button
            type="button"
            class="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700 border-b border-emerald-500/70 pb-1 group"
            @click="focusLogin"
          >
            ดูรายละเอียดการทำงานของระบบ
            <span
              class="ml-2 text-base translate-x-0 group-hover:translate-x-1 transition-transform"
            >
              →
            </span>
          </button>
        </div>
      </section>

      <!-- ขวา - กล่องล็อกอิน -->
      <section class="flex justify-center lg:justify-end">
        <div class="relative w-full max-w-md">
          <div
            class="relative z-10 bg-white backdrop-blur-sm rounded-3xl border border-slate-200 shadow-[0_18px_45px_rgba(15,23,42,0.18)] px-6 py-7 sm:px-8 sm:py-8"
          >
            <!-- โลโก้ -->
            <div class="flex justify-center mb-6">
              <img
                src="/logo.png"
                alt="Bangkok Services and Engineering"
                class="w-28 h-auto drop-shadow-md"
              />
            </div>

            <!-- หัวข้อ -->
            <div class="mb-6 text-center space-y-2">
              <h2 class="text-2xl font-bold text-emerald-600">เข้าสู่ระบบ</h2>
              <p class="text-xs sm:text-sm text-slate-500">
                กรุณากรอกชื่อผู้ใช้และรหัสผ่านเพื่อใช้งานระบบ
              </p>
            </div>

            <!-- ฟอร์ม -->
            <form @submit.prevent="handleLogin" class="space-y-5">
              <!-- username -->
              <div>
                <label
                  for="username"
                  class="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  ชื่อผู้ใช้
                </label>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <User
                      class="h-4 w-4"
                      :class="
                        fieldErrors.username ? 'text-red-400' : 'text-slate-400'
                      "
                    />
                  </div>
                  <input
                    id="username"
                    ref="usernameInput"
                    v-model="form.username"
                    name="username"
                    type="text"
                    autocomplete="username"
                    @input="clearFieldError('username')"
                    :class="[
                      'block w-full pl-9 pr-3 py-2.5 rounded-lg text-sm placeholder-slate-500 focus:outline-none transition-all duration-150',
                      fieldErrors.username
                        ? 'bg-red-50/60 border border-red-300 focus:ring-2 focus:ring-red-400 focus:border-red-400 text-red-900'
                        : 'bg-slate-100 border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white text-black',
                    ]"
                    placeholder="กรุณากรอกชื่อผู้ใช้"
                  />
                </div>
                <transition name="fade-slide">
                  <p
                    v-if="fieldErrors.username"
                    class="mt-1.5 text-[11px] text-red-600 flex items-center"
                  >
                    <AlertCircle class="w-3 h-3 mr-1 flex-shrink-0" />
                    {{ fieldErrors.username }}
                  </p>
                </transition>
              </div>

              <!-- password -->
              <div>
                <label
                  for="password"
                  class="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  รหัสผ่าน
                </label>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <Lock
                      class="h-4 w-4"
                      :class="
                        fieldErrors.password ? 'text-red-400' : 'text-slate-400'
                      "
                    />
                  </div>
                  <input
                    id="password"
                    v-model="form.password"
                    name="password"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="current-password"
                    @input="clearFieldError('password')"
                    :class="[
                      'block w-full pl-9 pr-10 py-2.5 rounded-lg text-sm placeholder-slate-500 focus:outline-none transition-all duration-150',
                      fieldErrors.password
                        ? 'bg-red-50/60 border border-red-300 focus:ring-2 focus:ring-red-400 focus:border-red-400 text-red-900'
                        : 'bg-slate-100 border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white text-black',
                    ]"
                    placeholder="กรุณากรอกรหัสผ่าน"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700 focus:outline-none"
                    :aria-label="showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'"
                  >
                    <Eye v-if="!showPassword" class="h-4 w-4" />
                    <EyeOff v-else class="h-4 w-4" />
                  </button>
                </div>
                <transition name="fade-slide">
                  <p
                    v-if="fieldErrors.password"
                    class="mt-1.5 text-[11px] text-red-600 flex items-center"
                  >
                    <AlertCircle class="w-3 h-3 mr-1 flex-shrink-0" />
                    {{ fieldErrors.password }}
                  </p>
                </transition>
              </div>

              <!-- remember + forgot -->
              <div
                class="flex items-center justify-between text-[11px] sm:text-xs"
              >
                <label class="flex items-center cursor-pointer">
                  <input
                    id="remember-me"
                    v-model="form.rememberMe"
                    type="checkbox"
                    class="w-3.5 h-3.5 text-emerald-600 border-slate-300 rounded bg-white focus:ring-emerald-500 focus:ring-1 cursor-pointer"
                  />
                  <span class="ml-2 text-slate-600"> จดจำฉันไว้ในระบบนี้ </span>
                </label>

                <button
                  type="button"
                  class="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  <HelpCircle class="w-3.5 h-3.5 mr-1" />
                  ลืมรหัสผ่าน?
                </button>
              </div>

              <!-- ปุ่ม -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full mt-2 py-3 text-sm font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:hover:bg-emerald-500 flex items-center justify-center space-x-2"
              >
                <LogIn v-if="!loading" class="w-4 h-4" />
                <Loader2 v-else class="w-4 h-4 animate-spin" />
                <span>
                  {{ loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ" }}
                </span>
              </button>

              <!-- error กรณี user / pass ไม่ถูก -->
              <transition name="fade-slide">
                <p
                  v-if="error"
                  class="mt-2 text-xs text-red-600 flex items-center justify-center"
                >
                  <AlertCircle class="w-4 h-4 mr-1" />
                  {{ error }}
                </p>
              </transition>

              <!-- success card อยู่ด้านล่างเหมือนรูป -->
              <transition name="fade-slide">
                <div
                  v-if="success"
                  class="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50/95 px-3.5 py-3 flex items-start gap-2"
                >
                  <div
                    class="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100"
                  >
                    <CheckCircle class="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-emerald-700">
                      เข้าสู่ระบบสำเร็จ
                    </p>
                    <p class="text-[11px] text-emerald-600 mt-0.5">
                      {{ success }}
                    </p>
                  </div>
                </div>
              </transition>
            </form>

            <!-- footer -->
            <div
              class="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400"
            >
              <p>© 2024 BKKService</p>
              <p class="mt-1">
                ระบบจัดการบริการสำหรับงานดูแลห้องคอมพิวเตอร์ในโรงเรียน
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  User,
  Lock,
  LogIn,
  Loader2,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Eye,
  EyeOff,
} from "lucide-vue-next";
import { useAuth } from "@/composables/useAuth";

definePageMeta({
  layout: false,
});

const { login } = useAuth();

const form = ref({
  username: "",
  password: "",
  rememberMe: false,
});

const loading = ref(false);
const error = ref("");
const success = ref("");
const showPassword = ref(false);

const fieldErrors = ref<{
  username?: string;
  password?: string;
}>({});

const usernameInput = ref<HTMLInputElement | null>(null);

const focusLogin = () => {
  if (usernameInput.value) {
    usernameInput.value.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setTimeout(() => {
      usernameInput.value?.focus();
    }, 300);
  }
};

const clearFieldError = (field: "username" | "password") => {
  fieldErrors.value[field] = "";
  error.value = "";
};

const handleLogin = async () => {
  loading.value = true;
  error.value = "";
  success.value = "";
  fieldErrors.value = {};

  // validate ว่ากรอกหรือยัง
  if (!form.value.username.trim()) {
    fieldErrors.value.username = "กรุณากรอกชื่อผู้ใช้";
  }

  if (!form.value.password.trim()) {
    fieldErrors.value.password = "กรุณากรอกรหัสผ่าน";
  }

  if (fieldErrors.value.username || fieldErrors.value.password) {
    loading.value = false;
    return;
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 800));
    await login(form.value.username, form.value.password);

    success.value = "เข้าสู่ระบบแล้ว กำลังนำคุณไปยังหน้าถัดไป...";
  } catch (e: any) {
    error.value = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.18s ease-out;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-3px);
}

/* Smooth transitions */
input:focus {
  background-color: white;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f5f9;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
