def application(environ, start_response):
    # Generate HTML content
    html = """<!DOCTYPE html>
<html>
<head>
    <title>My First Python Web App</title>
</head>
<body>
    <h1>Hello from onlyRSS.org!</h1>
    <p>This is my first Python web application using pure WSGI, no framework.</p>
</body>
</html>"""
    
    # Convert to bytes
    data = html.encode('utf-8')
    
    # HTTP response headers
    status = '200 OK'
    response_headers = [
        ('Content-Type', 'text/html'),
        ('Content-Length', str(len(data)))
    ]
    
    # Send response
    start_response(status, response_headers)
    return [data]

# For local testing
if __name__ == '__main__':
    from wsgiref.simple_server import make_server
    
    # Create a simple WSGI server
    with make_server('', 8000, application) as httpd:
        print("Serving on port 8000...")
        httpd.serve_forever()