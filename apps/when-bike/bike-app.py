import os

def application(environ, start_response):
    # Generate HTML content
    html = """<!DOCTYPE html>
<html>
<head>
    <title>When Bike</title>
    <meta charset="utf-8">
</head>
<body>
    <h1>I'm full-stack now :-)</h1>
    <p>Generated by Python!</p>
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
    
    # Debug info - print the current directory
    print(f"Current directory: {os.getcwd()}")
    
    # Send response
    start_response(status, response_headers)
    return [data]

# For local testing
if __name__ == '__main__':
    # This won't run on the server, but helps with local testing
    try:
        html_content = """<!DOCTYPE html>
<html>
<head>
    <title>When Bike</title>
</head>
<body>
    <h1>When Bike</h1>
    <p>This is the static HTML content for my when-bike application.</p>
</body>
</html>"""
        
        with open('index.html', 'w') as file:
            file.write(html_content)
        
        print("HTML file generated successfully!")
    except Exception as e:
        print(f"Error generating HTML: {e}")