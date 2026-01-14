import urllib.request
import json
import datetime
import os

# Configuration
UPRN = "100080241051"
API_URL = "https://www.westberks.gov.uk/apiserver/ajaxlibrary"
METHOD = "goss.echo.westberks.forms.getNextRubbishRecyclingFoodCollectionDate3wkly"
SITE_URL = "onlyrss.com/apps/bins/" # UPDATE THIS with your actual domain

def fetch_data():
    payload = {
        "jsonrpc": "2.0",
        "id": str(int(datetime.datetime.now().timestamp())),
        "method": METHOD,
        "params": {"uprn": UPRN}
    }
    
    try:
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(
            API_URL, 
            data=data, 
            headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
        )
        
        with urllib.request.urlopen(req) as response:
            if response.status != 200:
                print(f"Error: HTTP {response.status}")
                return None
            return json.loads(response.read().decode('utf-8'))
            
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

def parse_date(date_text, sub_text):
    # Logic adapted from westberks.py
    # Prefer sub_text if available and not empty, otherwise date_text
    # API returns dates like "Tuesday 20 January"
    
    date_str = sub_text if sub_text else date_text
    if not date_str:
        return None, None

    # Clean up string if needed
    date_str = date_str.strip()
    
    # Append current year to parse
    current_year = datetime.date.today().year
    full_date_str = f"{date_str} {current_year}"
    
    try:
        dt = datetime.datetime.strptime(full_date_str, "%A %d %B %Y")
        
        # Handle year rollover (if we are in Dec and date is Jan, it's next year)
        # Or more simply: if the parsed date is more than a few months in the past, it's probably next year
        # But for bin collections, it's usually upcoming.
        # Let's use the logic: if parsed date is < today - 30 days, add 1 year.
        if dt.date() < datetime.date.today() - datetime.timedelta(days=30):
             dt = dt.replace(year=current_year + 1)
             
        return dt, date_str
    except ValueError:
        print(f"Could not parse date: {full_date_str}")
        return None, date_str

def generate_html(collections):
    html_template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>West Berkshire Bin Collections</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <header>
            <h1>Bin Collection Dates</h1>
            <p>Next collection dates for UPRN: {uprn}</p>
            <p style="margin-top: 1rem;">
                <a href="https://www.google.com/calendar/render?cid=webcal://{site_url}/bins.ics" class="btn" target="_blank">
                    Subscribe to Google Calendar
                </a>
            </p>
        </header>

        <main>
            <div class="results-grid">
                {cards}
            </div>
            
            <div style="margin-top: 2rem; text-align: center; color: var(--text-muted); font-size: 0.75rem;">
                Last updated: {last_updated}
            </div>
        </main>
    </div>
</body>
</html>"""

    card_template = """
                <div class="card {class_name}">
                    <div class="card-icon"></div>
                    <div class="card-content">
                        <h2>{type_name}</h2>
                        <p class="date">{date_display}</p>
                    </div>
                </div>"""

    cards_html = ""
    for item in collections:
        cards_html += card_template.format(
            class_name=item['class'],
            type_name=item['type'],
            date_display=item['display_str']
        )

    return html_template.format(
        uprn=UPRN,
        site_url=SITE_URL,
        cards=cards_html,
        last_updated=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )

def generate_ics(collections):
    ics_content = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//West Berkshire Bins//OnlyRSS//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "X-WR-CALNAME:Bin Collections",
        "X-WR-TIMEZONE:Europe/London",
    ]

    for item in collections:
        dt = item['datetime']
        if not dt:
            continue
            
        # All day event
        dt_start = dt.strftime("%Y%m%d")
        dt_end = (dt + datetime.timedelta(days=1)).strftime("%Y%m%d")
        uid = f"{dt_start}-{item['type']}@westberksbins"
        
        ics_content.extend([
            "BEGIN:VEVENT",
            f"UID:{uid}",
            f"DTSTAMP:{datetime.datetime.now().strftime('%Y%m%dT%H%M%SZ')}",
            f"DTSTART;VALUE=DATE:{dt_start}",
            f"DTEND;VALUE=DATE:{dt_end}",
            f"SUMMARY:{item['type']} Collection",
            "DESCRIPTION:West Berkshire Council Bin Collection",
            "END:VEVENT"
        ])

    ics_content.append("END:VCALENDAR")
    return "\r\n".join(ics_content)

def main():
    print("Fetching data...")
    data = fetch_data()
    
    if not data or 'result' not in data:
        print("Failed to get valid data.")
        return

    result = data['result']
    
    collection_types = [
        {
            'type': 'Rubbish',
            'class': 'rubbish',
            'text_key': 'nextRubbishDateText',
            'sub_key': 'nextRubbishDateSubText'
        },
        {
            'type': 'Recycling',
            'class': 'recycling',
            'text_key': 'nextRecyclingDateText',
            'sub_key': 'nextRecyclingDateSubText'
        },
        {
            'type': 'Food Waste',
            'class': 'food',
            'text_key': 'nextFoodWasteDateText',
            'sub_key': 'nextFoodWasteDateSubText'
        }
    ]
    
    parsed_collections = []
    
    for c_type in collection_types:
        text = result.get(c_type['text_key'], '')
        sub = result.get(c_type['sub_key'], '')
        
        dt, display_str = parse_date(text, sub)
        
        if display_str:
            parsed_collections.append({
                'type': c_type['type'],
                'class': c_type['class'],
                'datetime': dt,
                'display_str': display_str
            })

    print(f"Found {len(parsed_collections)} collections.")

    # Determine the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Generate HTML
    html_path = os.path.join(script_dir, "index.html")
    print(f"Generating index.html at {html_path}...")
    try:
        html = generate_html(parsed_collections)
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html)
        print("Successfully wrote index.html")
    except Exception as e:
        print(f"ERROR writing index.html: {e}")

    # Generate ICS
    ics_path = os.path.join(script_dir, "bins.ics")
    print(f"Generating bins.ics at {ics_path}...")
    try:
        ics = generate_ics(parsed_collections)
        with open(ics_path, "w", encoding="utf-8") as f:
            f.write(ics)
        print("Successfully wrote bins.ics")
    except Exception as e:
        print(f"ERROR writing bins.ics: {e}")
        
    print("Done.")

if __name__ == "__main__":
    main()
