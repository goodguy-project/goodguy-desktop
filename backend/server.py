import logging
from flask import Flask, request, abort
from flask_cors import cross_origin
from sqlalchemy.orm import Session
import webbrowser

from crawl import crawl, update_setting, get_setting
from database import Follower, session
from heartbeat import alive

_APP = Flask(__name__)
log = logging.getLogger('werkzeug')
log.disabled = True


@_APP.route('/heartbeat', methods=['POST'])
@cross_origin()
def heartbeat():
    alive()
    return 'pong'


@_APP.route('/follower/add', methods=['POST'])
@cross_origin()
def add_follower():
    data = request.json
    try:
        with session() as s:  # type: Session
            s.add(Follower(
                name=data.get('name', ''),
                codeforces_id=data.get('codeforces_id', ''),
                atcoder_id=data.get('atcoder_id', ''),
                nowcoder_id=data.get('nowcoder_id', ''),
                luogu_id=data.get('luogu_id', ''),
                vjudge_id=data.get('vjudge_id', ''),
                leetcode_id=data.get('leetcode_id', ''),
            ))
    except Exception as e:
        abort(400)
        _ = e
    return {'code': 0}


@_APP.route('/follower/update', methods=['POST'])
@cross_origin()
def update_follower():
    data = request.json
    fid = data.get('fid')
    if not isinstance(fid, str) and not isinstance(fid, int):
        abort(400)
    try:
        with session() as s:  # type: Session
            f = s.query(Follower).filter(Follower.id == fid).first()
            if f is None:
                raise KeyError(f'fid not found: {fid}')
            if data.get('name') is not None:
                f.name = data.get('name')
            if data.get('codeforces_id') is not None:
                f.codeforces_id = data.get('codeforces_id')
            if data.get('atcoder_id') is not None:
                f.atcoder_id = data.get('atcoder_id')
            if data.get('nowcoder_id') is not None:
                f.nowcoder_id = data.get('nowcoder_id')
            if data.get('luogu_id') is not None:
                f.luogu_id = data.get('luogu_id')
            if data.get('vjudge_id') is not None:
                f.vjudge_id = data.get('vjudge_id')
            if data.get('leetcode_id') is not None:
                f.leetcode_id = data.get('leetcode_id')
    except Exception as e:
        abort(400)
        _ = e
    return {'code': 0}


@_APP.route('/follower/delete', methods=['POST'])
@cross_origin()
def delete_follower():
    data = request.json
    fid = data.get('fid')
    if not isinstance(fid, str) and not isinstance(fid, int):
        abort(400)
    try:
        with session() as s:  # type: Session
            f = s.query(Follower).filter(Follower.id == fid).first()
            if f is None:
                raise KeyError(f'fid not found: {fid}')
            s.delete(f)
    except Exception as e:
        abort(400)
        _ = e
    return {'code': 0}


@_APP.route('/follower/search', methods=['POST'])
@cross_origin()
def search_follower():
    data = request.json
    fid = data.get('fid')
    try:
        with session() as s:  # type: Session
            q = s.query(Follower)
            if isinstance(fid, int) or isinstance(fid, str):
                q = q.filter(Follower.id == int(fid))
            elif isinstance(fid, list):
                q = q.filter(Follower.id.in_(fid))
            resp = [e.to_dict() for e in q.all()]
    except Exception as e:
        abort(400)
        _ = e
    else:
        return {'code': 0, 'data': resp}
    return {'code': -1}


@_APP.route('/crawl/get-setting', methods=['POST'])
@cross_origin()
def get_crawl_setting():
    return {'code': 0, 'data': get_setting()}


@_APP.route('/crawl/update-setting', methods=['POST'])
@cross_origin()
def update_crawl_setting():
    data = request.json
    update_setting(data)
    return {'code': 0}


@_APP.route('/jump', methods=['POST'])
@cross_origin()
def jump():
    webbrowser.open(request.json['link'])
    return {'code': 0}


crawlers = [
    'GetUserContestRecord',
    'GetUserSubmitRecord',
    'GetRecentContest',
    'MGetUserContestRecord',
    'MGetUserSubmitRecord',
    'MGetRecentContest',
    'GetDailyQuestion',
]


def crawl_decorator(func: str):
    def wrapper():
        try:
            return crawl(func, request.json)
        except RuntimeError:
            abort(400)

    wrapper.__name__ = func
    return wrapper


for crawler in crawlers:
    _APP.route(f'/crawl/{crawler}', methods=['POST'])(cross_origin()(crawl_decorator(crawler)))


def run(host: str, port: int):
    # server = WSGIServer((host, port), _APP, log=log)
    print(f'server is serving on {host}:{port}')
    # server.serve_forever()
    _APP.run(host=host, port=port, threaded=True)


__all__ = [
    'run',
]

if __name__ == '__main__':
    import time, threading


    class T(threading.Thread):
        def run(self) -> None:
            while True:
                alive()
                time.sleep(1.0)


    T().start()
    run('127.0.0.1', 61648)
