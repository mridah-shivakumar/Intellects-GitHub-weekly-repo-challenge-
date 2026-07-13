"""
Intellects Club - SRM Ramapuram (Dept of AIML)
Python Web Runtime Server
"""

import os
import json
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 5000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class IntellectsHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Default route to index.html
        if self.path == '/' or self.path == '/index.html':
            self.path = '/index.html'
        return super().do_GET()

    def do_POST(self):
        if self.path == '/api/register-challenge':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                print(f"[REGISTER] Received GitHub Challenge Registration for {data.get('name', 'User')}")

                # Append registration data to local submissions.json
                data_file = os.path.join(DIRECTORY, 'challenge_registrations.json')
                registrations = []
                if os.path.exists(data_file):
                    with open(data_file, 'r', encoding='utf-8') as f:
                        try:
                            registrations = json.load(f)
                        except json.JSONDecodeError:
                            registrations = []
                
                registrations.append(data)
                with open(data_file, 'w', encoding='utf-8') as f:
                    json.dump(registrations, f, indent=2)

                response_bytes = json.dumps({'status': 'success', 'message': 'Registration recorded successfully!'}).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(response_bytes)))
                self.end_headers()
                self.wfile.write(response_bytes)
            except Exception as e:
                err_msg = json.dumps({'status': 'error', 'message': str(e)}).encode('utf-8')
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(err_msg)
        else:
            self.send_error(404, "Endpoint not found")

def run_server():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, IntellectsHandler)
    print("=========================================================")
    print("INTELLECTS CLUB SERVER RUNNING (Dept of AIML)")
    print(f"Access URL: http://localhost:{PORT}")
    print("=========================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
