#!/bin/bash

# Chemin vers l'environnement virtuel
VENV_DIR=".venv"

# Vérifier si l'environnement virtuel existe déjà
cd server || { echo "❌ RAG Backend directory not found"; exit 1; }
if [ -d "$VENV_DIR" ]; then
  echo "✅ Virtual environment '.venv' already exists."
else
  # Créer l'environnement virtuel s'il n'existe pas
  echo "⌛ Virtual environment '.venv' not found. Creating one..."
  python -m venv $VENV_DIR || { echo "❌ Failed to create virtual environment"; exit 1; }
  echo "✅ Virtual environment '.venv' created successfully."
fi

# Activer l'environnement virtuel Python
echo "⌛ Activating Python virtual environment..."
source $VENV_DIR/bin/activate || source $VENV_DIR/scripts/activate || { echo "❌ Failed to activate virtual environment"; exit 1; }
sleep 2
echo "✅ Virtual environment activated successfully."

# Installer les dépendances Python
echo "⌛ Installing Python dependencies..."
python -m pip install --upgrade pip || { echo "❌ Failed to upgrade pip"; exit 1; }
pip install -r requirements.txt || { echo "❌ Failed to install Python dependencies"; exit 1; }
echo "✅ Python dependencies installed successfully."

# Télécharger les modèles Ollama nécessaires
echo "⌛ Pulling required Ollama and Embedding models..."
python setup_models.py || { echo "❌ Failed to setup Ollama and Embedding models"; exit 1; }
echo "✅ Ollama and Embedding models pulled successfully."

# Vérifier si Django est installé et accessible
echo "⌛ Checking Django installation..."
python -c "import django; print(f'Django version: {django.get_version()}')" || { echo "❌ Django is not installed or not accessible."; exit 1; }

# Lancer le serveur Django
echo "⌛ Starting Django server..."
python manage.py runserver &
sleep 5 # Attendre un peu pour s'assurer que le serveur démarre correctement
if [ $? -eq 0 ]; then
  echo "✅ Django server started successfully."
  echo "🌐 Django server running at: http://127.0.0.1:8000"
else
  echo "❌ Failed to start Django server."
  exit 1
fi

# Lancer le serveur React
echo "⌛ Starting React application..."
cd ../ask-docs-app || { echo "❌ React frontend directory not found"; exit 1; }
npm install || { echo "❌ Failed to install React dependencies"; exit 1; }
echo "✅ React dependencies installed successfully."
npm run dev &
sleep 5 # Attendre un peu pour s'assurer que l'application démarre correctement
if [ $? -eq 0 ]; then
  echo "✅ React application started successfully."
  echo "🌐 React application running at: http://localhost:3000"
else
  echo "❌ Failed to start React application."
  exit 1
fi

wait # Attendre que tous les processus se terminent (Django + React)
