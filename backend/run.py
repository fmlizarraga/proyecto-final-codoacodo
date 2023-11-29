import os
from dotenv import load_dotenv
from app import app, send_from_directory

load_dotenv()

public_folder = os.path.join(os.path.dirname(
    os.path.abspath(__file__)), 'public')

app.static_folder = public_folder
app.static_url_path = "/public"

# Ruta para servir archivos estáticos
@app.route('/public/<path:filename>')
def serve_static(filename):
    print(filename)
    return send_from_directory(public_folder, filename)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
