import os
import threading
import time

from cachetools import TTLCache

_Cache = TTLCache(maxsize=64, ttl=30)


def alive():
    _Cache.__setitem__(time.time(), None)


def check_alive():
    if _Cache.__len__() == 0:
        print('orphan process now, exit on its own.')
        os._exit(0)


class Thread(threading.Thread):
    def __init__(self):
        super().__init__()

    def run(self) -> None:
        while True:
            # check heartbeat per 10 second
            time.sleep(10)
            check_alive()


Thread().start()

__all__ = [
    'alive',
]

if __name__ == '__main__':
    for i in range(5):
        time.sleep(1)
        alive()
