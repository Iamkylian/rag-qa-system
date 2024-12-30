# rag-qa-system

Sur ce repository, vous trouverez le code source de l'application React.jsbasé sur le concept du RAG aini que dans le dossier ``./example`` des extrait de code illustrant des concepts clés du RAG tel que la tokenisation, l'embedding...

## Fonctionnement

### Technologies

* React
Le frontend de l'application à été développé en React. React permet de créer des composantes réutilisables, ce qui facilite le développement et la maintenance de l'application. Son écosystème riche offre une multitude de bibliothèques et d'outils complémentaires, permettant de trouver des solutions adaptées et de trasfomer mon application facilement.
De plus, React offre une excellente performance grâce à sa gestion efficace du DOM virtuel.

* Django et Django Rest Framework (DRF)
Le backend de l'application à été développé en Django. Django àassure une excellente scalabilité, tandis que son ORM puissant simplifie les interactions avec la base de données. 
Django Rest Framework (DRF) complète parfaitement Django en facilitant la création d'APIs RESTful robustes et flexibles, permettant d'exposer facilement des endpoints API pour la communication entre le frontend React et le backend Django. Cette stack me permet de développer rapidement une application performante, sécurisée et facilement maintenable.

### Prérequis

- Python 3.10
- Application Ollama

### Installation

1. Installer et Lancez l'application Ollama

2. Se déplacer dans au repertoire racine du dépot si ce n'est pas déja fait :
    ```bash
    cd ~/rag-qa-system
    ```

### Lancer l'application

1. Ouvrez un terminal Git Bash
2. Lancez le script de similarité cosinus :
    ```bash
    ./start_servers.sh
    ```

## Problèmes rencontrés

### Gestion des problèmes CORS

J'ai rencontré un problème avec CORS (Cross-Origin Resource Sharing) lors du développement de mon application. Ce problème est survenu car les navigateurs modernes bloquent par défaut les requêtes HTTP effectuées depuis une origine différente de celle du serveur cible. Voici comment j'ai compris et résolu ce problème dans mon projet Django.

Le cœur du problème était que mon application React tournait sur `http://localhost:3000`, tandis que mon serveur Django était sur `http://127.0.0.1:8000`. Ces deux origines sont considérées comme différentes par le navigateur à cause du port et potentiellement du domaine.

Pour résoudre ce problème, j'ai dû installer et configurer le package django-cors-headers. Voici ce que j'ai ajouté à mon projet Django :

1. J'ai d'abord installé le package :

```bash
pip install django-cors-headers
```

2. Ensuite, j'ai ajouté le middleware CORS dans mes paramètres Django :

```python
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    # ...
]
```

Ce middleware intercepte toutes les requêtes entrantes et sortantes pour vérifier si elles respectent les règles CORS que j'ai définies.

3. J'ai spécifié les origines autorisées :

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

Ces lignes indiquent à mon serveur Django d'accepter les requêtes provenant de ces URL spécifiques, qui correspondent à l'origine de mon application React en développement.

Sans cette configuration, mes appels API depuis React étaient bloqués par le navigateur, qui affichait des erreurs du type :

```
Access to fetch at 'http://127.0.0.1:8000/' from origin 'http://localhost:3000' has been blocked by CORS policy.
```

Grâce à ces ajouts, j'ai pu permettre à mon serveur Django d'accepter les requêtes provenant de mon application React, résolvant ainsi le problème CORS. Mes appels Axios depuis React peuvent maintenant communiquer avec l'API Django sans être bloqués par la politique CORS du navigateur.