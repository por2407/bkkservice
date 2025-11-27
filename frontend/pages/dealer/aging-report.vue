<template>
    <div class="min-h-screen bg-slate-50 pb-10">
      <!-- ===== App Bar (responsive) ===== -->
      <header
        class="border-b border-slate-100 bg-white/80 backdrop-blur"
      >
        <div
          class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 lg:py-4"
        >
          <div class="flex items-center gap-3">
            <button
              class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 active:scale-95"
              @click="goBack"
              aria-label="back"
            >
              <ArrowLeft class="h-4 w-4 text-slate-700" />
            </button>
            <div>
              <p class="text-[15px] font-semibold text-slate-900 lg:text-[16px]">
                รายงานอายุหนี้
              </p>
              <p class="text-[11px] text-slate-500 lg:text-[12px]">
                ลูกหนี้คงค้างตามช่วงเวลา
              </p>
            </div>
          </div>
  
          <div class="text-right">
            <p class="text-[10px] text-slate-400 lg:text-[11px]">อัปเดตล่าสุด</p>
            <p class="text-[12px] font-medium text-slate-700 lg:text-[13px]">
              {{ reportDate }}
            </p>
          </div>
        </div>
      </header>
  
      <main class="mx-auto mt-4 max-w-5xl space-y-4 px-4 lg:px-8">
        <!-- ===== Company Card ===== -->
        <section class="rounded-2xl bg-white p-4 shadow-sm lg:p-5">
          <p class="text-[11px] font-semibold text-slate-500 lg:text-[12px]">
            บริษัท
          </p>
          <p class="mt-1 text-[15px] font-semibold text-slate-900 lg:text-[16px]">
            {{ companyName }}
          </p>
        </section>
  
        <!-- ===== Summary Dashboard ===== -->
        <section class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="rounded-2xl bg-white p-4 shadow-sm lg:p-5">
            <p class="text-[11px] text-slate-500 lg:text-[12px]">
              รวมค้างถึงปัจจุบัน
            </p>
            <p
              class="mt-1 text-[20px] font-bold text-slate-900 tabular-nums leading-tight lg:text-[22px]"
            >
              {{ formatMoney(grandTotal) }}
            </p>
            <p class="mt-1 text-[10px] text-slate-400 lg:text-[11px]">บาท</p>
          </div>
  
          <div class="rounded-2xl bg-white p-4 shadow-sm lg:p-5">
            <p class="text-[11px] text-slate-500 lg:text-[12px]">
              รวมค้างเกิน 30 วัน
            </p>
            <p
              class="mt-1 text-[20px] font-bold text-rose-600 tabular-nums leading-tight lg:text-[22px]"
            >
              {{ formatMoney(over30Total) }}
            </p>
            <p class="mt-1 text-[10px] text-slate-400 lg:text-[11px]">
              คิดเป็น {{ over30Percent.toFixed(1) }}% ของยอดรวม
            </p>
          </div>
        </section>
  
        <!-- ===== แผนภูมิแท่งอายุหนี้ ===== -->
        <section class="rounded-2xl bg-white p-4 shadow-sm lg:p-5">
          <div class="mb-3 flex items-center justify-between">
            <p class="text-[13px] font-semibold text-slate-900 lg:text-[14px]">
              แผนภูมิอายุหนี้ (ตามช่วงวัน)
            </p>
            <p class="text-[11px] text-slate-400 lg:text-[12px]">
              หน่วย: บาท
            </p>
          </div>
  
          <!-- chart area -->
          <div class="flex h-40 items-end justify-between gap-3 md:h-48 lg:h-56">
            <div
              v-for="row in agingRows"
              :key="row.key"
              class="flex h-full flex-1 flex-col items-center justify-end gap-1"
            >
              <!-- container ของแท่ง -->
              <div class="flex w-full flex-1 items-end justify-center">
                <div
                  class="w-[55%] rounded-t-xl rounded-b-md md:w-[50%]"
                  :class="toneFill(row.tone)"
                  :style="{ height: `${row.barHeight}%` }"
                ></div>
              </div>
  
              <!-- amount -->
              <p
                class="mt-1 text-center text-[10px] font-semibold tabular-nums leading-tight md:text-[11px]"
                :class="toneText(row.tone)"
              >
                {{ shortMoney(row.amount) }}
              </p>
  
              <!-- label -->
              <p
                class="mt-0.5 text-center text-[9px] leading-tight text-slate-500 md:text-[10px]"
              >
                {{ row.shortLabel }}
              </p>
            </div>
          </div>
        </section>
  
        <!-- ===== รายการแต่ละช่วง ===== -->
        <section class="space-y-3">
          <article
            v-for="row in agingRows"
            :key="row.key"
            class="rounded-2xl bg-white p-4 shadow-sm lg:p-5"
          >
            <div class="flex items-start gap-3">
              <!-- แถบสีด้านซ้าย -->
              <div
                class="mt-0.5 h-10 w-1.5 rounded-full"
                :class="toneBar(row.tone)"
              ></div>
  
              <div class="flex-1">
                <div class="flex items-center justify-between gap-2">
                  <p class="text-[13px] font-semibold text-slate-900 lg:text-[14px]">
                    {{ row.label }}
                  </p>
                  <span
                    class="rounded-full px-2 py-0.5 text-[10px] font-semibold lg:text-[11px]"
                    :class="toneChip(row.tone)"
                  >
                    {{ row.days }}
                  </span>
                </div>
  
                <p
                  class="mt-1 text-[18px] font-bold tabular-nums lg:text-[19px]"
                  :class="toneText(row.tone)"
                >
                  {{ formatMoney(row.amount) }}
                  <span class="text-[11px] font-medium text-slate-400 lg:text-[12px]">
                    บาท
                  </span>
                </p>
  
                <p class="mt-1 text-[10px] text-slate-400 lg:text-[11px]">
                  สัดส่วน {{ row.percent.toFixed(1) }}% ของยอดรวมทั้งหมด
                </p>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from "vue";
  import { useRouter } from "vue-router";
  import { ArrowLeft } from "lucide-vue-next";
  
  definePageMeta({ layout: "default" });
  
  const router = useRouter();
  const goBack = () => router.back();
  
  /* ===== Mock Data ===== */
  const reportDate = "24 ตุลาคม 2568";
  const companyName = "บริษัท เพชร ซอฟแวร์ จำกัด";
  
  type Tone = "fresh" | "warn" | "mid" | "late";
  
  interface AgingRowRaw {
    key: string;
    label: string;
    shortLabel: string;
    days: string;
    amount: number;
    tone: Tone;
  }
  
  const rowsRaw: AgingRowRaw[] = [
    {
      key: "lt30",
      label: "ค้างไม่เกิน 30 วัน",
      shortLabel: "ไม่เกิน 30",
      days: "0–30 วัน",
      amount: 1974396.97,
      tone: "fresh",
    },
    {
      key: "30to59",
      label: "ค้าง 30 ถึง 59 วัน",
      shortLabel: "30–59",
      days: "31–59 วัน",
      amount: 1520666.28,
      tone: "warn",
    },
    {
      key: "60to89",
      label: "ค้าง 60 ถึง 89 วัน",
      shortLabel: "60–89",
      days: "60–89 วัน",
      amount: 1548221.28,
      tone: "mid",
    },
    {
      key: "gt90",
      label: "ค้างมากกว่า 90 วัน",
      shortLabel: "90+",
      days: "90+ วัน",
      amount: 62216386.37,
      tone: "late",
    },
  ];
  
  /* ===== Totals ===== */
  const grandTotal = computed(() =>
    rowsRaw.reduce((sum, r) => sum + r.amount, 0)
  );
  
  const over30Total = computed(() =>
    rowsRaw
      .filter((r) => r.key !== "lt30")
      .reduce((sum, r) => sum + r.amount, 0)
  );
  
  const over30Percent = computed(() =>
    grandTotal.value === 0 ? 0 : (over30Total.value / grandTotal.value) * 100
  );
  
  /* ===== Chart data ===== */
  const maxAmount = computed(() =>
    Math.max(...rowsRaw.map((r) => r.amount), 1)
  );
  
  const agingRows = computed(() =>
    rowsRaw.map((r) => ({
      ...r,
      percent:
        grandTotal.value === 0 ? 0 : (r.amount / grandTotal.value) * 100,
      // ความสูงแท่ง (อย่างน้อย 10% ให้มองเห็น)
      barHeight: Math.max((r.amount / maxAmount.value) * 100, 10),
    }))
  );
  
  /* ===== Format helper ===== */
  const formatMoney = (n: number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  
  // ใช้ใน chart ให้สั้นลง
  const shortMoney = (n: number) => {
    if (n >= 1_000_000) {
      return (n / 1_000_000).toFixed(1) + "M";
    }
    if (n >= 1_000) {
      return (n / 1_000).toFixed(1) + "k";
    }
    return n.toFixed(0);
  };
  
  /* ===== Tone Styles ===== */
  const toneText = (t: Tone) => {
    switch (t) {
      case "fresh":
        return "text-emerald-600";
      case "warn":
        return "text-amber-600";
      case "mid":
        return "text-violet-600";
      case "late":
        return "text-orange-600";
    }
  };
  
  const toneFill = (t: Tone) => {
    switch (t) {
      case "fresh":
        return "bg-emerald-500";
      case "warn":
        return "bg-amber-500";
      case "mid":
        return "bg-violet-500";
      case "late":
        return "bg-orange-500";
    }
  };
  
  const toneBar = (t: Tone) => {
    switch (t) {
      case "fresh":
        return "bg-emerald-500";
      case "warn":
        return "bg-amber-500";
      case "mid":
        return "bg-violet-500";
      case "late":
        return "bg-orange-500";
    }
  };
  
  const toneChip = (t: Tone) => {
    switch (t) {
      case "fresh":
        return "bg-emerald-50 text-emerald-700";
      case "warn":
        return "bg-amber-50 text-amber-700";
      case "mid":
        return "bg-violet-50 text-violet-700";
      case "late":
        return "bg-orange-50 text-orange-700";
    }
  };
  </script>
  