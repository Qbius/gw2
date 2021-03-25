from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs
from urllib.request import urlopen
from json import loads, dumps
from itertools import chain
from re import match

def api(endpoint, **kwargs):
    parameters = ('?' + '&'.join(f'{name}={value}' for name, value in kwargs.items())) if kwargs else ''
    url = f'https://api.guildwars2.com/v2/{endpoint}{parameters}'
    return loads(urlopen(url).read())

def get_fractal_info(token):
    account = api('account', access_token=token)
    initiate, adept, expert, master  = api('account/achievements', ids='2965,2894,2217,2415', access_token=token)
    done = [*map(lambda n: n, range(0, 25) if initiate['done'] else initiate['bits']), *map(lambda n: 25 + n, range(0, 25) if adept['done'] else adept['bits']), *map(lambda n: 50 + n, range(0, 25) if expert['done'] else expert['bits']), *map(lambda n: 75 + n, range(0, 25) if master['done'] else master['bits'])]
    not_done = [i + 1 for i in range(100) if i not in done]
    return {'level': account['fractal_level'], 'missing': not_done}

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parameters = parse_qs(self.path.split('?')[1]) if '?' in self.path else {}
        error = ''

        if 'access_token' not in parameters:
            error = "Required parameter 'access_token' not found"
        elif len(parameters['access_token']) < 1 or not match(r'\w{8}\-\w{4}\-\w{4}\-\w{4}\-\w{20}\-\w{4}\-\w{4}\-\w{4}\-\w{12}', parameters['access_token'][0]):
            error = "Invalid access token"

        if error:
            self.send_response(400)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(dumps({'error': error}).encode())
        else:
            access_token = parameters['access_token'][0]
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(dumps(get_fractal_info(access_token)).encode())