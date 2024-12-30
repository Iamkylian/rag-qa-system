import os

def pull_model(model_name):
    print(f"Pulling model: {model_name}...")
    # Exécuter la commande pour télécharger le modèle
    result = os.system(f"ollama pull {model_name}")
    
    # Vérifier si la commande a échoué
    if result != 0:
        print(f"❌ Failed to pull model: {model_name}. Please ensure that 'ollama' is installed and running.")
    else:
        print(f"✅ Successfully pulled model: {model_name}")

# Télécharge les modèles Ollama
pull_model("nomic-embed-text")
pull_model("llama3.2")