// plugins/app-height.client.ts
export default defineNuxtPlugin(() => {
    let maxH = 0
  
    const readViewportHeight = () => {
      // visualViewport แม่นกว่า innerHeight บนมือถือรุ่นใหม่
      const vv = window.visualViewport
      return Math.round(vv?.height ?? window.innerHeight)
    }
  
    const setAppHeight = () => {
      const h = readViewportHeight()
  
      // อัปเดตเฉพาะตอนความสูง "เพิ่มขึ้น" เช่น โหลดครั้งแรก / หมุนจอ
      if (h > maxH) {
        maxH = h
        document.documentElement.style.setProperty("--app-height", `${h}px`)
      }
    }
  
    setAppHeight()
  
    // resize จาก keyboard จะทำให้ h ลดลง -> setAppHeight ไม่อัปเดต
    window.addEventListener("resize", setAppHeight)
  
    // เวลา rotate บางเครื่องจะเด้งหลายรอบ เลยหน่วงนิด
    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        maxH = 0 // reset เพื่ออ่านค่าใหม่หลังหมุนจอ
        setAppHeight()
      }, 300)
    })
  
    // iOS บางเวอร์ชัน visualViewport resize แยก event
    window.visualViewport?.addEventListener("resize", setAppHeight)
  })
  