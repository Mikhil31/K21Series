"""Dev server for the K21 site: serves ./site on 0.0.0.0:8321 (phone on the same Wi-Fi can
reach it) and tells browsers never to cache, so a reload always shows the latest files."""
import functools
import http.server
import os

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'site')


class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()


http.server.ThreadingHTTPServer(('0.0.0.0', 8321), functools.partial(NoCache, directory=ROOT)).serve_forever()
