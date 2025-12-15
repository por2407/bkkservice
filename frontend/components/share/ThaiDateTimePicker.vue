<script setup lang="ts">
    import { computed, ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
    
    type WeekStart = 0 | 1
    type Variant = 'inline' | 'popover'
    type Size = 'md' | 'sm'
    
    interface Props {
      modelValue?: Date | string | null
      minuteStep?: number
      weekStartsOn?: WeekStart
      timeZone?: string
      accentClass?: string
      yearPastRange?: number
      yearFutureRange?: number
      variant?: Variant
      size?: Size
      /** ปิดการโต้ตอบทั้งหมด */
      disabled?: boolean
    }
    
    const props = withDefaults(defineProps<Props>(), {
      modelValue: null,
      minuteStep: 5,
      weekStartsOn: 0,
      timeZone: 'Asia/Bangkok',
      accentClass: 'text-amber-600',
      yearPastRange: 80,
      yearFutureRange: 50,
      variant: 'popover',
      size: 'sm',
      disabled: false
    })
    
    const isDisabled = computed(() => !!props.disabled)
    const emit = defineEmits<{ (e: 'update:modelValue', v: Date): void }>()
    
    const TZ = computed(() => props.timeZone || 'Asia/Bangkok')
    const toDate = (v: Date | string | null | undefined) => (!v ? new Date() : new Date(v as any))
    
    // ---------- format ----------
    const fmtFullDateLong = (d: Date) =>
      new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: TZ.value
      }).format(d)
    
    const fmtField = (d: Date) =>
      new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: TZ.value
      }).format(d)
    
    const fmtDayNum = (d: Date) =>
      new Intl.DateTimeFormat('th-TH-u-ca-buddhist', { day: 'numeric', timeZone: TZ.value }).format(d)
    
    const fmtTime = (d: Date) =>
      new Intl.DateTimeFormat('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: TZ.value
      }).format(d)
    
    const months = Array.from({ length: 12 }, (_, i) => ({
      label: new Intl.DateTimeFormat('th-TH-u-ca-buddhist', { month: 'long' }).format(
        new Date(2000, i, 1)
      ),
      value: i
    }))
    
    const dayNamesSunFirst = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
    const dayNames = computed(() =>
      props.weekStartsOn === 1 ? [...dayNamesSunFirst.slice(1), dayNamesSunFirst[0]] : dayNamesSunFirst
    )
    const keyOf = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
    
    // ---------- size ----------
    const sz = computed(() =>
      props.size === 'sm'
        ? {
            card: 'w-[18rem]',
            headerPad: 'px-3 pt-2',
            select: 'px-2 py-1 text-xs',
            day: 'h-8 w-8 text-xs rounded-lg',
            gridGap: 'gap-1',
            timePad: 'px-3 pb-3',
            footerPad: 'px-3 py-2',
            weekdayText: 'text-[11px]'
          }
        : {
            card: 'w-[22rem]',
            headerPad: 'px-4 pt-3',
            select: 'px-3 py-2 text-sm',
            day: 'h-10 w-10 text-sm rounded-xl',
            gridGap: 'gap-1.5',
            timePad: 'px-3 pb-4',
            footerPad: 'px-4 py-3',
            weekdayText: 'text-xs'
          }
    )
    
    // ---------- state ----------
    const selected = ref<Date>(toDate(props.modelValue))
    const viewDate = ref<Date>(new Date(selected.value))
    
    watch(
      () => props.modelValue,
      v => {
        if (!v) return
        selected.value = toDate(v)
        viewDate.value = new Date(selected.value)
        selectedHour.value = selected.value.getHours()
        selectedMinute.value =
          Math.floor(selected.value.getMinutes() / props.minuteStep) * props.minuteStep
      }
    )
    
    const isSameDate = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    
    const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
    const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0)
    
    type Cell = { date: Date; inMonth: boolean; isToday: boolean; isSelected: boolean }
    
    const grid = computed<Cell[]>(() => {
      const first = startOfMonth(viewDate.value)
      const last = endOfMonth(viewDate.value)
    
      const startIndex = (() => {
        const dow = first.getDay()
        return props.weekStartsOn === 1 ? (dow === 0 ? 6 : dow - 1) : dow
      })()
    
      const cells: Cell[] = []
    
      // ก่อนหน้าเดือน
      for (let i = 0; i < startIndex; i++) {
        const d = new Date(first)
        d.setDate(d.getDate() - (startIndex - i))
        cells.push({
          date: d,
          inMonth: false,
          isToday: isSameDate(d, new Date()),
          isSelected: isSameDate(d, selected.value)
        })
      }
    
      // ในเดือน
      for (let day = 1; day <= last.getDate(); day++) {
        const d = new Date(first)
        d.setDate(day)
        cells.push({
          date: d,
          inMonth: true,
          isToday: isSameDate(d, new Date()),
          isSelected: isSameDate(d, selected.value)
        })
      }
    
      // เติมให้ครบ 6 แถว (42 ช่อง)
      while (cells.length < 42) {
        const prev = cells[cells.length - 1].date
        const d = new Date(prev)
        d.setDate(d.getDate() + 1)
        cells.push({
          date: d,
          inMonth: false,
          isToday: isSameDate(d, new Date()),
          isSelected: isSameDate(d, selected.value)
        })
      }
    
      return cells
    })
    
    // ---------- time ----------
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const minutes = computed(() =>
      Array.from({ length: Math.ceil(60 / props.minuteStep) }, (_, i) => i * props.minuteStep)
    )
    
    const selectedHour = ref(selected.value.getHours())
    const selectedMinute = ref(
      Math.floor(selected.value.getMinutes() / props.minuteStep) * props.minuteStep
    )
    
    watch([selectedHour, selectedMinute], () => {
      if (isDisabled.value) return
      const d = new Date(selected.value)
      d.setHours(selectedHour.value, selectedMinute.value, 0, 0)
      selected.value = d
      emit('update:modelValue', new Date(selected.value))
    })
    
    function selectDate(d: Date) {
      if (isDisabled.value) return
      const m = new Date(d)
      m.setHours(selectedHour.value, selectedMinute.value, 0, 0)
      selected.value = m
      viewDate.value = new Date(m)
      emit('update:modelValue', new Date(m))
    }
    
    // ---------- month/year ----------
    const currentGy = new Date().getFullYear()
    const years = computed(() => {
      const arr: Array<{ label: string; value: number }> = []
      for (let gy = currentGy - props.yearPastRange; gy <= currentGy + props.yearFutureRange; gy++) {
        arr.push({ label: String(gy + 543), value: gy })
      }
      return arr
    })
    
    const selectedMonth = computed({
      get: () => viewDate.value.getMonth(),
      set: (m: number) => {
        if (isDisabled.value) return
        const d = new Date(viewDate.value)
        d.setMonth(m)
        viewDate.value = d
      }
    })
    
    const selectedYearGy = computed({
      get: () => viewDate.value.getFullYear(),
      set: (y: number) => {
        if (isDisabled.value) return
        const d = new Date(viewDate.value)
        d.setFullYear(y)
        viewDate.value = d
      }
    })
    
    function goPrevMonth() {
      if (isDisabled.value) return
      const d = new Date(viewDate.value)
      d.setMonth(d.getMonth() - 1)
      viewDate.value = d
      nextTick(updatePosition)
    }
    
    function goNextMonth() {
      if (isDisabled.value) return
      const d = new Date(viewDate.value)
      d.setMonth(d.getMonth() + 1)
      viewDate.value = d
      nextTick(updatePosition)
    }
    
    function goToday(setTimeNow = false) {
      if (isDisabled.value) return
      const now = new Date()
      const d = new Date(now)
    
      if (setTimeNow) {
        selectedHour.value = now.getHours()
        selectedMinute.value = Math.floor(now.getMinutes() / props.minuteStep) * props.minuteStep
      }
    
      d.setHours(selectedHour.value, selectedMinute.value, 0, 0)
      selected.value = d
      viewDate.value = new Date(d)
      emit('update:modelValue', new Date(d))
      nextTick(updatePosition)
    }
    
    // ---------- refs สำหรับ popover ----------
    const triggerRef = ref<HTMLElement | null>(null)
    const panelRef = ref<HTMLElement | null>(null)
    const open = ref(false)
    
    const panel = ref({ top: 0, left: 0, minWidth: 0 })
    const margin = 8
    
    // 👉 target ของ teleport: เริ่มต้นเป็น 'body' แล้วค่อยอัปเดตไปเป็น <dialog> ถ้ามี
    const teleportTarget = ref<HTMLElement | string>('body')
    
    async function updatePosition() {
      await nextTick()
      const t = triggerRef.value
      const p = panelRef.value
      if (!t || !p) return
    
      const rect = t.getBoundingClientRect()
      const pw = p.offsetWidth
      const ph = p.offsetHeight
    
      let left = rect.left
      if (left + pw > window.innerWidth - margin) {
        left = Math.max(margin, window.innerWidth - pw - margin)
      }
      if (left < margin) left = margin
    
      let top = rect.bottom + margin
      if (top + ph > window.innerHeight - margin) {
        top = rect.top - ph - margin
        if (top < margin) {
          top = Math.max(margin, window.innerHeight - ph - margin)
        }
      }
    
      panel.value = {
        top: Math.round(top),
        left: Math.round(left),
        minWidth: Math.round(rect.width)
      }
    }
    
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node
      if (triggerRef.value?.contains(target)) return
      if (panelRef.value?.contains(target)) return
      open.value = false
    }
    
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') open.value = false
    }
    
    watch(open, v => {
      if (isDisabled.value) {
        open.value = false
        return
      }
    
      if (v) {
        updatePosition()
        window.addEventListener('resize', updatePosition)
        window.addEventListener('scroll', updatePosition, true)
        document.addEventListener('mousedown', onDocClick)
        document.addEventListener('keydown', onKey)
      } else {
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition, true)
        document.removeEventListener('mousedown', onDocClick)
        document.removeEventListener('keydown', onKey)
      }
    })
    
    watch(isDisabled, v => {
      if (v) open.value = false
    })
    
    onMounted(() => {
      // sync นาทีตาม step
      selectedMinute.value =
        Math.floor(selected.value.getMinutes() / props.minuteStep) * props.minuteStep
    
      // 🔎 หา dialog ที่ครอบตัว datepicker อยู่
      const dlg = triggerRef.value?.closest('dialog')
      if (dlg) {
        // ให้ popover teleport เข้าไปอยู่ใน dialog เดียวกัน
        teleportTarget.value = dlg as HTMLElement
      }
    })
    
    onBeforeUnmount(() => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    })
    </script>
    
    <template>
      <!-- POPUP MODE -->
      <div v-if="variant === 'popover'" class="w-full">
        <!-- trigger -->
        <button
          ref="triggerRef"
          type="button"
          class="w-full flex items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-left focus:outline-none"
          :class="[
            isDisabled
              ? 'opacity-60 cursor-not-allowed bg-slate-100 hover:bg-slate-100'
              : 'hover:bg-slate-50 focus:ring-2 focus:ring-amber-300'
          ]"
          :aria-disabled="isDisabled"
          @click="!isDisabled && (open = !open)"
        >
          <span class="truncate">{{ fmtField(selected) }}</span>
          <span class="ml-3 text-amber-600">📅</span>
        </button>
    
        <!-- panel: เปลี่ยนมา teleport ไปยัง dialog ถ้ามี -->
        <teleport :to="teleportTarget">
          <div
            v-show="open"
            ref="panelRef"
            class="fixed z-[1200] rounded-2xl border border-amber-100 bg-white shadow-xl"
            :class="[sz.card]"
            :style="{
              top: panel.top + 'px',
              left: panel.left + 'px',
              minWidth: panel.minWidth + 'px'
            }"
          >
            <!-- Header -->
            <div :class="[sz.headerPad, 'border-b border-amber-100']">
              <div class="flex items-center justify-between">
                <button
                  type="button"
                  class="rounded-xl px-2 py-1"
                  :class="[isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-amber-50']"
                  @click="goPrevMonth"
                  aria-label="Prev"
                >
                  ‹
                </button>
                <div class="flex items-center gap-2">
                  <select
                    v-model.number="selectedMonth"
                    :disabled="isDisabled"
                    :class="[
                      'rounded-xl border border-amber-200 bg-white focus:outline-none',
                      sz.select,
                      isDisabled ? 'opacity-60 cursor-not-allowed' : 'focus:ring-2 focus:ring-amber-300'
                    ]"
                  >
                    <option v-for="m in months" :key="m.value" :value="m.value">
                      {{ m.label }}
                    </option>
                  </select>
                  <select
                    v-model.number="selectedYearGy"
                    :disabled="isDisabled"
                    :class="[
                      'rounded-xl border border-amber-200 bg-white focus:outline-none',
                      sz.select,
                      isDisabled ? 'opacity-60 cursor-not-allowed' : 'focus:ring-2 focus:ring-amber-300'
                    ]"
                  >
                    <option v-for="y in years" :key="y.value" :value="y.value">
                      {{ y.label }}
                    </option>
                  </select>
                </div>
                <button
                  type="button"
                  class="rounded-xl px-2 py-1"
                  :class="[isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-amber-50']"
                  @click="goNextMonth"
                  aria-label="Next"
                >
                  ›
                </button>
              </div>
              <div class="flex items-center justify-center pt-2">
                <button
                  type="button"
                  class="rounded border border-amber-200 px-2 py-1 text-[11px] text-amber-700"
                  :class="[isDisabled ? 'opacity-40 cursor-not-allowed bg-white' : 'hover:bg-amber-50']"
                  @click="() => { goToday() }"
                >
                  วันนี้
                </button>
              </div>
            </div>
    
            <!-- Weekdays -->
            <div
              class="grid grid-cols-7 text-center text-gray-500 px-3 pt-2"
              :class="[sz.weekdayText]"
            >
              <div v-for="d in dayNames" :key="d" class="py-1">
                {{ d }}
              </div>
            </div>
    
            <!-- Grid -->
            <div class="grid grid-cols-7 p-3" :class="[sz.gridGap]">
              <button
                v-for="cell in grid"
                :key="keyOf(cell.date)"
                type="button"
                class="transition"
                :class="[
                  sz.day,
                  isDisabled ? 'opacity-60 cursor-not-allowed' : '',
                  cell.inMonth ? 'text-gray-800' : 'text-gray-400',
                  cell.isSelected
                    ? 'bg-amber-500 text-white shadow'
                    : isDisabled
                    ? ''
                    : 'hover:bg-amber-50',
                  cell.isToday && !cell.isSelected ? 'ring-1 ring-amber-300' : ''
                ]"
                @click="
                  () => {
                    if (!isDisabled) {
                      selectDate(cell.date)
                      open = false
                    }
                  }
                "
              >
                {{ fmtDayNum(cell.date) }}
              </button>
            </div>
    
            <!-- Time -->
            <div :class="[sz.timePad, 'flex gap-2']">
              <div class="flex-1">
                <label class="block text-[11px] text-gray-500 mb-1">ชั่วโมง (00–23)</label>
                <select
                  v-model.number="selectedHour"
                  :disabled="isDisabled"
                  :class="[
                    'w-full rounded-xl border border-amber-200 bg-white focus:outline-none',
                    sz.select,
                    isDisabled ? 'opacity-60 cursor-not-allowed' : 'focus:ring-2 focus:ring-amber-300'
                  ]"
                >
                  <option v-for="h in hours" :key="h" :value="h">
                    {{ String(h).padStart(2, '0') }}
                  </option>
                </select>
              </div>
              <div class="flex-1">
                <label class="block text-[11px] text-gray-500 mb-1">นาที</label>
                <select
                  v-model.number="selectedMinute"
                  :disabled="isDisabled"
                  :class="[
                    'w-full rounded-xl border border-amber-200 bg-white focus:outline-none',
                    sz.select,
                    isDisabled ? 'opacity-60 cursor-not-allowed' : 'focus:ring-2 focus:ring-amber-300'
                  ]"
                >
                  <option v-for="m in minutes" :key="m" :value="m">
                    {{ String(m).padStart(2, '0') }}
                  </option>
                </select>
              </div>
            </div>
    
            <!-- Footer -->
            <div
              :class="['border-t border-amber-100 flex items-center justify-between', sz.footerPad]"
            >
              <span class="text-[11px] text-gray-500">พ.ศ. / เวลาไทย</span>
              <span class="font-medium" :class="props.accentClass">
                {{ fmtFullDateLong(selected) }} • {{ fmtTime(selected) }}
              </span>
            </div>
          </div>
        </teleport>
      </div>
    
      <!-- INLINE MODE -->
      <div
        v-else
        class="w-full rounded-2xl border border-amber-100 bg-white shadow-sm"
        :class="[sz.card]"
      >
        <div :class="[sz.headerPad, 'border-b border-amber-100']">
          <div class="flex items-center justify-between">
            <button
              type="button"
              class="rounded-xl px-3 py-1"
              :class="[isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-amber-50']"
              @click="goPrevMonth"
              aria-label="Previous month"
            >
              ‹
            </button>
            <div class="flex items-center gap-2">
              <select
                v-model.number="selectedMonth"
                :disabled="isDisabled"
                :class="[
                  'rounded-xl border border-amber-200 bg-white focus:outline-none',
                  sz.select,
                  isDisabled ? 'opacity-60 cursor-not-allowed' : 'focus:ring-2 focus:ring-amber-300'
                ]"
              >
                <option v-for="m in months" :key="m.value" :value="m.value">
                  {{ m.label }}
                </option>
              </select>
              <select
                v-model.number="selectedYearGy"
                :disabled="isDisabled"
                :class="[
                  'rounded-xl border border-amber-200 bg-white focus:outline-none',
                  sz.select,
                  isDisabled ? 'opacity-60 cursor-not-allowed' : 'focus:ring-2 focus:ring-amber-300'
                ]"
              >
                <option v-for="y in years" :key="y.value" :value="y.value">
                  {{ y.label }}
                </option>
              </select>
            </div>
            <button
              type="button"
              class="rounded-xl px-3 py-1"
              :class="[isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-amber-50']"
              @click="goNextMonth"
              aria-label="Next month"
            >
              ›
            </button>
          </div>
          <div class="flex items-center justify-center pt-2">
            <button
              type="button"
              class="rounded border border-amber-200 px-2 py-1 text-[11px] text-amber-700"
              :class="[isDisabled ? 'opacity-40 cursor-not-allowed bg-white' : 'hover:bg-amber-50']"
              @click="goToday(true)"
            >
              วันนี้
            </button>
          </div>
        </div>
    
        <div
          class="grid grid-cols-7 text-center text-gray-500 px-3 pt-2"
          :class="[sz.weekdayText]"
        >
          <div v-for="d in dayNames" :key="d" class="py-1">
            {{ d }}
          </div>
        </div>
    
        <div class="grid grid-cols-7 p-3" :class="[sz.gridGap]">
          <button
            v-for="cell in grid"
            :key="keyOf(cell.date)"
            type="button"
            class="transition"
            :class="[
              sz.day,
              isDisabled ? 'opacity-60 cursor-not-allowed' : '',
              cell.inMonth ? 'text-gray-800' : 'text-gray-400',
              cell.isSelected
                ? 'bg-amber-500 text-white shadow'
                : isDisabled
                ? ''
                : 'hover:bg-amber-50',
              cell.isToday && !cell.isSelected ? 'ring-1 ring-amber-300' : ''
            ]"
            @click="
              () => {
                if (!isDisabled) selectDate(cell.date)
              }
            "
          >
            {{ fmtDayNum(cell.date) }}
          </button>
        </div>
    
        <div :class="[sz.timePad, 'flex gap-2']">
          <div class="flex-1">
            <label class="block text-[11px] text-gray-500 mb-1">ชั่วโมง (00–23)</label>
            <select
              v-model.number="selectedHour"
              :disabled="isDisabled"
              :class="[
                'w-full rounded-xl border border-amber-200 bg-white focus:outline-none',
                sz.select,
                isDisabled ? 'opacity-60 cursor-not-allowed' : 'focus:ring-2 focus:ring-amber-300'
              ]"
            >
              <option v-for="h in hours" :key="h" :value="h">
                {{ String(h).padStart(2, '0') }}
              </option>
            </select>
          </div>
          <div class="flex-1">
            <label class="block text-[11px] text-gray-500 mb-1">นาที</label>
            <select
              v-model.number="selectedMinute"
              :disabled="isDisabled"
              :class="[
                'w-full rounded-xl border border-amber-200 bg-white focus:outline-none',
                sz.select,
                isDisabled ? 'opacity-60 cursor-not-allowed' : 'focus:ring-2 focus:ring-amber-300'
              ]"
            >
              <option v-for="m in minutes" :key="m" :value="m">
                {{ String(m).padStart(2, '0') }}
              </option>
            </select>
          </div>
        </div>
    
        <div
          :class="['border-t border-amber-100 flex items-center justify-between', sz.footerPad]"
        >
          <span class="text-[11px] text-gray-500">พ.ศ. / เวลาไทย</span>
          <span class="font-medium" :class="props.accentClass">
            {{ fmtFullDateLong(selected) }} • {{ fmtTime(selected) }}
          </span>
        </div>
      </div>
    </template>
    