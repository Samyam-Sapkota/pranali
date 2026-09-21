#!/usr/bin/env python3
"""
Static dev server for the Pranali Space frontend.

The only reason this exists instead of `python -m http.server` is caching:
the stock server sends no Cache-Control header, so browsers apply *heuristic*
freshness and happily keep serving an old main.js or styles.css after you have
edited it — which looks exactly like "my change didn't work".

This sends no-store on everything, so a plain refresh is always enough and you
never need Ctrl+Shift+R while developing.

    python devserver.py [port]
"""

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        # one tidy line per request, without the date noise
        sys.stderr.write("%s\n" % (fmt % args))


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
    handler = partial(NoCacheHandler, directory=".")
    with ThreadingHTTPServer(("127.0.0.1", port), handler) as httpd:
        print("Pranali Space — dev server on http://localhost:%d  (no-store; plain refresh is enough)" % port)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nstopped")


if __name__ == "__main__":
    main()
