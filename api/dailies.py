from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs
from urllib.request import urlopen
from json import loads, dumps
from re import match

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            all_dailies = loads(urlopen('https://api.guildwars2.com/v2/achievements/daily').read())
            fractal_dailies_ids = [str(frac['id']) for frac in all_dailies['fractals']]
            fractal_dailies_info = loads(urlopen('https://api.guildwars2.com/v2/achievements?ids=' + ','.join(fractal_dailies_ids)).read())
            names = [match(r"(?:Daily Recommended Fractal—Scale|Daily Tier \d) (\d+|[a-zA-Z\ ']+)", frac['name']).groups()[0] for frac in fractal_dailies_info]
            result = {
                'scales': [int(frac) for frac in names if frac.isdigit()],
                'names': list(set(frac for frac in names if not frac.isdigit())),
            }            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(dumps(result).encode())
        except:
            self.send_response(400)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(dumps({'error': 'error while downloading dailies info'}).encode())
