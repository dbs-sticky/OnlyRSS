def generate_html():
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

# For cPanel's entry point
def application(environ, start_response):
    # Generate the HTML file first
    generate_html()
    
    # Then redirect to the static file
    status = '302 Found'
    response_headers = [('Location', '/apps/when-bike/index.html')]
    start_response(status, response_headers)
    return [b'']

if __name__ == "__main__":
    generate_html()