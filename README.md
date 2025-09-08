# 🛠️ Inventario Backend

API REST para la gestión de productos, categorías, unidades y estados. Construido con Django y MySQL.

## 🚀 Tecnologías

- Python 3.13+
- Django 5.x
- Django REST Framework
- MySQL

## ⚙️ Instalación

```bash
# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar base de datos en settings.py
# Ejecutar migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario (opcional)
python manage.py createsuperuser

# Ejecutar servidor
python manage.py runserver

GET /api/productos/

POST /api/productos/

GET /api/categorias/

GET /api/unidades/

GET /api/estados/
