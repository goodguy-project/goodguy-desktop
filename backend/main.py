import argparse

from server import run


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--host', help='server host')
    parser.add_argument('--port', help='server port')
    args = parser.parse_args()
    run(host=args.host, port=int(args.port))


if __name__ == '__main__':
    main()
