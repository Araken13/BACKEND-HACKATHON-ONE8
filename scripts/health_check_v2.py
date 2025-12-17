import requests
import sys
import time

SERVICES = [
    {
        "name": "🧠 Python AI Service (Mock)",
        "url": "http://localhost:8000/",
        "required": True
    },
    {
        "name": "🚀 Backend NestJS",
        "url": "http://localhost:3000/churn/stats", 
        "required": True
    },
    {
        "name": "🎨 Frontend React (Vite)",
        "url": "http://localhost:5174/",
        "alternates": ["http://localhost:5173/"],
        "required": True
    }
]

def check_service(name, url, alternates=None):
    urls_to_try = [url]
    if alternates:
        urls_to_try.extend(alternates)
        
    for target_url in urls_to_try:
        try:
            start_time = time.time()
            response = requests.get(target_url, timeout=2)
            latency = (time.time() - start_time) * 1000
            
            if response.status_code < 400:
                print(f"✅ {name:30} [OK] {response.status_code} ({latency:.0f}ms) -> {target_url}")
                return True
            else:
                print(f"⚠️ {name:30} [WARN] Status {response.status_code} -> {target_url}")
                
        except requests.exceptions.ConnectionError:
            continue # Tenta o próximo
        except Exception as e:
            print(f"❌ {name:30} [ERR] {str(e)} -> {target_url}")
            return False

    # Se chegou aqui, falhou em todos
    print(f"❌ {name:30} [DOWN] Falha na conexão -> {urls_to_try}")
    return False

def main():
    print("="*60)
    print("🩺 CHURN INSIGHT V2 - HEALTH CHECK SYSTEM")
    print("="*60)
    
    all_passed = True
    
    for service in SERVICES:
        success = check_service(service["name"], service["url"], service.get("alternates"))
        if service["required"] and not success:
            all_passed = False
    
    print("-" * 60)
    if all_passed:
        print("🎉 TODOS OS SISTEMAS ESTÃO OPERACIONAIS!")
        sys.exit(0)
    else:
        print("🔥 ALGUNS SISTEMAS CRÍTICOS ESTÃO FORA DO AR.")
        sys.exit(1)

if __name__ == "__main__":
    main()
