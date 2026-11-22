import socket
import threading
import sys

def forward(src, dst):
    try:
        while True:
            data = src.recv(8192)
            if not data:
                break
            dst.sendall(data)
    except Exception:
        pass
    finally:
        try:
            src.close()
        except Exception:
            pass
        try:
            dst.close()
        except Exception:
            pass

def main():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        server.bind(("127.0.0.1", 5433))
        server.listen(128)
        print("Port forwarder listening on 127.0.0.1:5433 -> 127.0.0.1:5432", flush=True)
    except Exception as e:
        print(f"Error binding to 5433: {e}", flush=True)
        sys.exit(1)

    while True:
        try:
            client, addr = server.accept()
            remote = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            remote.connect(("127.0.0.1", 5432))
            threading.Thread(target=forward, args=(client, remote), daemon=True).start()
            threading.Thread(target=forward, args=(remote, client), daemon=True).start()
        except Exception as e:
            print(f"Connection error: {e}", flush=True)

if __name__ == "__main__":
    main()
