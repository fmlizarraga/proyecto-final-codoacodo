import os
from dotenv import load_dotenv
from app import app
from flask import send_from_directory, jsonify, send_file
from werkzeug.exceptions import NotFound

load_dotenv()

public_folder = os.path.join(os.path.dirname(
    os.path.abspath(__file__)), 'public')

app.static_folder = public_folder
app.static_url_path = "/public"

app.config['MIME_TYPES'] = {
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.html': 'text/html',
}

# Ruta para servir archivos estáticos
@app.route('/public/<path:filename>')
def serve_static(filename):
    print(os.path.join(public_folder, filename))
    return send_file(os.path.join(public_folder, filename))

# Ruta para manejar la raíz y redirigir al index.html
@app.route('/')
def root():
    return send_file(os.path.join(public_folder, 'index.html'))

# Ruta catch-all para redirigir a la carpeta pública
@app.route('/<path:path>')
def catch_all(path):
    file_path = os.path.join(public_folder, path)
    if os.path.exists(file_path):
        return send_file(file_path)
    else:
        return send_file(os.path.join(public_folder, 'index.html'))

# Ruta de manejo de errores 404
@app.errorhandler(NotFound)
def page_not_found(e):
    return jsonify({"ok": False , "message": "La ruta solicitada no existe", "error": "Not Found"}), 404

if __name__ == "__main__":
    app.run(debug=True, port=5000)
