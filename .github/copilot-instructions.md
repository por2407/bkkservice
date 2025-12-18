ก่อนที่สร้างก่อนที่จะสร้างหรือแก้ไข style หน้าใดๆ
จงตรวจสอบ
1.design token ใน `frontend/assets/css/tokens.css` ก่อนทุกหน้าที่สร้างมาต้องมี design token ที่สอดคล้องกันเสมอ (ถ้าไม่มีต้องสร้างขึ้นมาใหม่) 
2. components ที่มีอยู่แล้วใน `frontend/components/share/` ว่ามี component ที่สามารถนำมาใช้ซ้ำได้หรือไม่
(ถ้ามีให้ใช้ component ที่มีอยู่แล้วแทนการสร้างใหม่) 
3. mode mobile และ web ui จะมีความแตกต่างกัน mobile ui จะเหมือนแอพมือถือ ต้องตรวจสอบให้แน่ใจว่าการออกแบบนั้นเหมาะสมกับการใช้งานบนมือถือ web ui จะเหมาะกับการใช้งานบนคอมพิวเตอร์ตั้งโต๊ะ โดย logic จะใช้ด้วยกันทั้งสองแบบ 
4. appType = "w" | "a" w=web a=app mobile  UserType = "c" | "e" | "d"  c=customer e=employee d=dealer
