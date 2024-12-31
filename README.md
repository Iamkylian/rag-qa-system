# rag-qa-system

In this repository, you will find the source code for the React.js application based on the RAG concept, as well as code snippets in the `./example` folder illustrating key RAG concepts such as tokenization, embedding, and more.

## How it works

### Technologies

* React
The frontend of the application was developed in React. React allows for the creation of reusable components, which facilitates the development and maintenance of the application. Its rich ecosystem offers a multitude of complementary libraries and tools, making it easy to find suitable solutions and transform my application easily.
Moreover, React offers excellent performance thanks to its efficient management of the virtual DOM.

* Django and Django Rest Framework (DRF)
The backend of the application was developed in Django. Django ensures excellent scalability, while its powerful ORM simplifies interactions with the database. 
Django Rest Framework (DRF) perfectly complements Django by facilitating the creation of robust and flexible RESTful APIs, making it easy to expose API endpoints for communication between the React frontend and Django backend. This stack allows me to quickly develop a performant, secure, and easily maintainable application.

### Prerequisites

- Python 3.10
- Ollama application

### Installation

1. Install and Launch the Ollama application

2. Navigate to the root directory of the repository if not already there:
    ```bash
    cd ~/rag-qa-system
    ```

### Launch the application

1. Open a Git Bash terminal
2. Run the start-up script:
    ```bash
    ./start_servers.sh
    ```
This script will:
- Set up and activate a Python virtual environment
- Install all necessary Python dependencies
- Pull required Ollama and Embedding models
- Apply Django migrations
- Start the Django server (exposing API endpoints for RAG system so that the React app can communicate with it)
- Install React dependencies
- Launch the React application (start the React development server, making the frontend accessible in a web browser for user interaction)

## Encountered Issues

### Handling CORS Issues

I encountered a CORS (Cross-Origin Resource Sharing) issue while developing my application. This problem arose because modern browsers by default block HTTP requests made from an origin different from that of the target server. Here's how I understood and resolved this issue in my Django project.

The core of the problem was that my React application was running on `http://localhost:3000`, while my Django server was on `http://127.0.0.1:8000`. These two origins are considered different by the browser due to the port and potentially the domain.

To solve this problem, I had to install and configure the django-cors-headers package. Here's what I added to my Django project:

1. First, I installed the package:

```bash
pip install django-cors-headers
```

2. Then, I added the CORS middleware in my Django settings:

```python
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    # ...
]
```

This middleware intercepts all incoming and outgoing requests to check if they comply with the CORS rules I defined.

3. I specified the allowed origins:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

These lines tell my Django server to accept requests coming from these specific URLs, which correspond to the origin of my React application in development.

Without this configuration, my API calls from React were blocked by the browser.

Thanks to these additions, I was able to allow my Django server to accept requests from my React application, thus resolving the CORS issue. My Axios calls from React can now communicate with the Django API without being blocked by the browser's CORS policy.