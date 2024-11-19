from datetime import datetime

# Função para registrar acessos à página
def log_access():
    with open("donate_access_log.txt", "a") as file:
        access_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        file.write(f"Acesso registrado em: {access_time}\n")

# Registrar o acesso
log_access()
