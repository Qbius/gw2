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

def get_characters(token):
    characters = api('characters', ids='all', access_token=token)
    item_ids = set(chain(*[[piece['id'], *piece.get('upgrades', []), *piece.get('infusions', [])] for char in characters for piece in char['equipment']]))
    item_info = dict(zip(item_ids, api('items', ids=','.join(map(str, item_ids)))))
    twohanders = ['Greatsword', 'Hammer', 'LongBow', 'Rifle', 'ShortBow', 'Staff']

    result = {}
    for character in characters:
        explicit_eq = [(piece['slot'], {'stats': piece['stats']['attributes'], 'info': piece, 'icon': item_info[piece['id']]['icon'], 'rarity': item_info[piece['id']].get('rarity', None), 'adj': item_info[piece['id']]['details'].get('attribute_adjustment', None), 'spread': piece['stats']['id'], '2h': (item_info[piece['id']]['details'].get('type', '') in twohanders)}) for piece in character['equipment'] if 'stats' in piece]

        def get_ar(piece):
            ar = 0
            for infusion in piece.get('infusions', []):
                details = item_info[infusion]['details']
                if 'Infusion' in details.get('infusion_upgrade_flags', []) and any(attr['attribute'] == 'AgonyResistance' for attr in details['infix_upgrade']['attributes']):
                    ar += next(attr['modifier'] for attr in details['infix_upgrade']['attributes'] if attr['attribute'] == 'AgonyResistance')
            return ar

        implicit_stats_items = [piece for piece in character['equipment'] if 'stats' not in piece]
        implicit_eq = [(piece['slot'], {'stats': {attrs['attribute']: attrs['modifier'] for attrs in item_info[piece['id']]['details']['infix_upgrade']['attributes']}, 'info': piece, 'icon': item_info[piece['id']]['icon'], 'rarity': item_info[piece['id']].get('rarity', None), 'adj': item_info[piece['id']]['details'].get('attribute_adjustment', None), 'spread': item_info[piece['id']]['details']['infix_upgrade']['id']}) for piece in implicit_stats_items if 'infix_upgrade' in item_info[piece['id']]['details']]
        
        eq = []
        for slot, piece in [*explicit_eq, *implicit_eq]:
            piece['stats']['ar'] = get_ar(piece['info'])
            runes = [upgrade for upgrade in piece['info']['upgrades'] if item_info[upgrade]['details']['type'] == 'Rune'] if 'upgrades' in piece['info'] else []
            sigils = [upgrade for upgrade in piece['info']['upgrades'] if item_info[upgrade]['details']['type'] == 'Sigil'] if 'upgrades' in piece['info'] else []
            if runes:
                piece['rune'] = item_info[runes[0]]['details']['bonuses']
            if sigils:
                piece['sigils'] = [item_info[sigil]['details']['infix_upgrade']['buff']['description'] for sigil in sigils]
            eq.append((slot, piece))

        result[character['name']] = dict(eq)
    return result

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
            self.wfile.write(dumps(get_characters(access_token)).encode())