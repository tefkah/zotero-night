#!/usr/bin/env python3

import os, sys
import shutil
import json
import configparser
import argparse
import shlex
import xml.etree.ElementTree as ET
import subprocess
import collections

config = configparser.ConfigParser(strict = False)
if os.path.isfile('start.ini'):
  config.read('start.ini')
if 'plugins' in config and 'path' in config['plugins']:
  plugins = config['plugins']['path'].strip().split('\n')
else:
  plugins = ['build']

argp = argparse.ArgumentParser()
argp.add_argument('--profile-path', dest='profile_path', default=config.get('profile', 'path', fallback=None))
argp.add_argument('--profile-name', dest='profile_name', default=config.get('profile', 'name', fallback=None))
argp.add_argument('--plugin', dest='plugin', nargs='+', default=plugins)
argp.add_argument('--log', default=config.get('log', 'path', fallback=None))
args = argp.parse_args()

if not args.profile_path:
  argp.print_help()
  sys.exit(1)

args.profile_path = os.path.expanduser(args.profile_path)
if args.log:
  args.log = os.path.expanduser(args.log)

def system(cmd):
  print('$', cmd)
  subprocess.run(cmd, shell=True, check=True)

# patch preferences
def pref_value(v):
  if v in ['true', 'false']: return v == 'true'
  if v == 'null': return None
  try:
    return int(v)
  except ValueError:
    pass
  try:
    return float(v)
  except ValueError:
    pass
  try:
    return json.loads(v)
  except json.decoder.JSONDecodeError:
    pass
  return v

preferences = dict(config['preferences']) if 'preferences' in config else {}
preferences = { k: pref_value(v) for k, v in preferences.items() }

def pref_name(line):
  if not line.startswith('user_pref('): return None
  if not line.startswith('user_pref("'): raise ValueError('unexpected user pref: ' + line)
  open_quote = None
  for i, c in enumerate(line):
    if c == '"':
      if open_quote is None:
        open_quote = i
      else:
        try:
          return json.loads(line[open_quote : i + 1])
        except json.decoder.JSONDecodeError:
          pass
  raise ValueError('unexpected user pref: ' + line)

for prefs in ['user', 'prefs']:
  prefs = os.path.join(args.profile_path, f'{prefs}.js')
  if not os.path.exists(prefs): continue

  user_prefs = []
  with open(prefs) as f:
    for line in f.readlines():
      if pref_name(line) not in preferences:
        user_prefs.append(line)
    if os.path.basename(prefs) == 'user.js':
      for key, value in preferences.items():
        if value is not None:
          user_prefs.append(f'user_pref({json.dumps(key)}, {json.dumps(value)});\n')

  with open(prefs, 'w') as f:
    f.write(''.join(user_prefs))

system('npm run build')

#system(f'rm -rf {profile}extensions.json')

if 'db' in config['profile']:
  shutil.copyfile(config['profile']['db'], os.path.join(args.profile_path, 'zotero', 'zotero.sqlite'))

for plugin in args.plugin:
  rdf = ET.parse(os.path.join(plugin, 'install.rdf')).getroot()
  for plugin_id in rdf.findall('{http://www.w3.org/1999/02/22-rdf-syntax-ns#}Description/{http://www.mozilla.org/2004/em-rdf#}id'):
    plugin_path = os.path.join(args.profile_path, 'extensions', plugin_id.text)

  with open(plugin_path, 'w') as f:
    path = os.path.join(os.getcwd(), plugin)
    if path[-1] != '/': path += '/'
    print(path, file=f)

cmd = '/Applications/Zotero.app/Contents/MacOS/zotero -purgecaches -P'
if args.profile_name: cmd += ' ' + shlex.quote(args.profile_name)
cmd += ' -jsconsole -ZoteroDebugText -datadir profile'
if args.log: cmd += ' > ' + shlex.quote(args.log)
cmd += ' &'

system(cmd)
