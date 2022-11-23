import base64
import json
import logging
import os.path
import subprocess
import tempfile
import time
from concurrent.futures import ThreadPoolExecutor
from threading import Thread, Lock

import yaml

_POOL = ThreadPoolExecutor(max_workers=8)

_CACHE = {}
_CACHE_LOCK = Lock()

_FILE = 'crawl-cache.json'

if os.path.exists(_FILE):
    with open(_FILE, 'r', encoding='utf-8') as f:
        try:
            _CACHE = json.loads(f.read())
        except Exception as e:
            logging.exception(e)


class SaveCacheThread(Thread):
    def __init__(self):
        super().__init__()
        self.last = json.dumps(_CACHE)

    def run(self) -> None:
        while True:
            with _CACHE_LOCK:
                cache = json.dumps(_CACHE)
                if self.last != cache:
                    with open(_FILE, 'w', encoding='utf-8') as f:
                        f.write(cache)
            time.sleep(8.0)


SaveCacheThread().start()


def set_cache(func: str, param: str, value):
    with _CACHE_LOCK:
        if _CACHE.get(func) is None:
            _CACHE[func] = {}
        if _CACHE[func].get(param) is None:
            _CACHE[func][param] = {}
        _CACHE[func][param] = value


def clean_cache():
    global _CACHE, _CACHE_LOCK
    with _CACHE_LOCK:
        _CACHE = {}
        with open(_FILE, 'w', encoding='utf-8') as f:
            f.write('{}')


def do_crawl(func: str, param: any):
    param = base64.b64encode(json.dumps(param).encode('utf-8')).decode('utf-8')
    p = None
    try:
        file = tempfile.SpooledTemporaryFile()
        p = subprocess.Popen(f'goodguy-crawl-no-service.exe --run --function {func} --param {param}',
                             stdout=file)
        code = p.wait(60.0)
        if code == 0:
            file.seek(0)
            stdout = file.read()
            print(stdout)
            resp = json.loads(stdout.decode('utf-8'))
            set_cache(func, param, {
                'data': resp,
                'status': 'ok',
                'time': time.time(),
            })
            return resp
        else:
            set_cache(func, param, {
                'status': 'failed',
                'time': time.time(),
            })
            raise RuntimeError
    finally:
        if p is not None:
            p.kill()


def crawl(func: str, param: any):
    try:
        failed = False
        cache = _CACHE[func][base64.b64encode(json.dumps(param).encode('utf-8')).decode('utf-8')]
        if cache['time'] + 3600 > time.time():
            if cache['status'] == 'ok':
                return cache['data']
            elif cache['time'] + 30 > time.time():
                # 30秒内的失败直接返回
                failed = True
    except Exception as e:
        logging.exception(e)
        _ = e
    else:
        if failed:
            raise RuntimeError
    return _POOL.submit(do_crawl, func, param).result(60.0)


_SETTING_LOCK = Lock()


def update_setting(data):
    with _SETTING_LOCK:
        with open('config.yaml', 'w', encoding='utf-8') as file:
            file.write(yaml.dump(data))


def get_setting():
    with _SETTING_LOCK:
        try:
            with open('config.yaml', 'r', encoding='utf-8') as file:
                return yaml.load(file.read(), Loader=yaml.FullLoader)
        except Exception as e:
            logging.exception(e)
    return {}


__all__ = [
    'crawl',
    'update_setting',
    'get_setting',
    'clean_cache',
]

if __name__ == '__main__':
    print(crawl('MGetRecentContest', {'platform': ['nowcoder']}))
