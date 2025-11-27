// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  nitro: {
    preset: "github-pages",
    serveStatic: true,
  },

  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxt/fonts"],

  app: {
    baseURL: "/bkkservice/",
    head: {
      title: "© บริษัท บางกอก เซอร์วิส แอนด์ เอ็นจิเนียริ่ง จำกัด",
      link: [
        // ไอคอนสำหรับแท็บ
        { rel: "icon", type: "image/png", href: "/bkkservice/logo.png" },
        // สำหรับ iOS (Add to Home Screen)
        { rel: "apple-touch-icon", href: "/bkkservice/logo.png" },
      ],
      meta: [
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
        },
      ],
      htmlAttrs: {
        "data-theme": "light",
      },
    },
  },

  runtimeConfig: {
    public: {
      apiBase: import.meta.env.VITE_API_BASE || "http://localhost:3001",
    },
  },

  css: ["~/assets/css/main.css"],

  fonts: {
    provider: "google",
    defaults: {
      styles: ["normal"],
      subsets: ["latin", "thai"],
    },
    families: [
      // ฟอนต์หลัก เน้นอ่านง่าย
      {
        name: "Noto Sans Thai",
        weights: ["100 900"], // variable font ครอบคลุมทุกน้ำหนัก
        styles: ["normal"],
        subsets: ["latin", "thai"],
      },
      // ฟอนต์หัวข้อ แนวเทค / startup
      {
        name: "Kanit",
        weights: ["100 900"],
        styles: ["normal"],
        subsets: ["latin", "thai"],
      },
      // ฟอนต์แนวอ่านยาวๆ ทางการ
      {
        name: "Taviraj",
        weights: ["100 900"],
        styles: ["normal"],
        subsets: ["latin", "thai"],
      },
    ],
  },
});
