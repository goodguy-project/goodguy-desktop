import logging
import os
from contextlib import contextmanager

from sqlalchemy import Column, create_engine, Integer, Text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.pool import SingletonThreadPool

_ORM_BASE = declarative_base()


def _to_dict(self):
    return {c.name: getattr(self, c.name, None) for c in self.__table__.columns}


_ORM_BASE.to_dict = _to_dict


class Follower(_ORM_BASE):
    __tablename__ = 'follower'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(Text)
    codeforces_id = Column(Text)
    atcoder_id = Column(Text)
    nowcoder_id = Column(Text)
    luogu_id = Column(Text)
    vjudge_id = Column(Text)
    leetcode_id = Column(Text)


_CWD = os.getcwd()
_DB_PATH = os.path.join(_CWD, 'goodguy-desktop.sqlite3')
_ENGINE = create_engine(f'sqlite:///{_DB_PATH}', poolclass=SingletonThreadPool,
                        connect_args={'check_same_thread': False})
_SESSION_CLZ = sessionmaker(bind=_ENGINE)

# create table if not exist
Follower.__table__.create(bind=_ENGINE, checkfirst=True)


@contextmanager
def session() -> Session:
    try:
        s = _SESSION_CLZ()
        yield s
        s.commit()
    except Exception as e:
        logging.exception(e)
        raise


if __name__ == '__main__':
    pass
