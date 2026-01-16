import urllib.request
import json
import datetime
import os

# Configuration
import random

# Configuration
UPRNS = [
    "100080241045",
    "100080241046",
    "100080241047",
    "100080241048",
    "100080241049",
    "100080241050",
    "100080241051",
    "100080241052",
    "100080241053",
    "100080241054"
]
LOCATION_NAME = "Hanningtons Way"
API_URL = "https://www.westberks.gov.uk/apiserver/ajaxlibrary"
METHOD = "goss.echo.westberks.forms.getNextRubbishRecyclingFoodCollectionDate3wkly"
SITE_URL = "onlyrss.org/apps/bins/" # UPDATE THIS with your actual domain

def fetch_data():
    selected_uprn = random.choice(UPRNS)
    print(f"Using UPRN: {selected_uprn}")
    
    payload = {
        "jsonrpc": "2.0",
        "id": str(int(datetime.datetime.now().timestamp())),
        "method": METHOD,
        "params": {"uprn": selected_uprn}
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

def format_friendly_datetime(dt):
    """Format datetime in a user-friendly way: Saturday 16th January (2026) at 12:08pm"""
    # Get day with ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
    day = dt.day
    if 10 <= day % 100 <= 20:
        suffix = 'th'
    else:
        suffix = {1: 'st', 2: 'nd', 3: 'rd'}.get(day % 10, 'th')
    
    # Format time in 12-hour format
    hour = dt.hour
    minute = dt.minute
    am_pm = 'am' if hour < 12 else 'pm'
    hour_12 = hour % 12
    if hour_12 == 0:
        hour_12 = 12
    
    # Build the formatted string
    return f"{dt.strftime('%A')} {day}{suffix} {dt.strftime('%B')} ({dt.year}) at {hour_12}:{minute:02d}{am_pm}"

def generate_html(collections):
    # Sort collections by date
    collections.sort(key=lambda x: x['datetime'])

    # Group by date
    grouped_collections = {}
    for item in collections:
        date_key = item['display_str']
        if date_key not in grouped_collections:
            grouped_collections[date_key] = []
        grouped_collections[date_key].append(item)

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
    
    <!-- Open Graph / Social Sharing -->
    <meta property="og:title" content="West Berkshire Bin Collections">
    <meta property="og:description" content="Next collection dates for {location_name}">
    <meta property="og:image" content="https://{site_url}/bins.jpg">
    <meta property="og:url" content="https://{site_url}/index.html">
    <meta property="og:type" content="website">
</head>
<body>
    <div class="container">
        <header>
            <h1>Bin Collection Dates</h1>
            <p>Next collection dates for {location_name}</p>
            
            <div id="stale-warning" class="stale-warning">
                ⚠️ <strong>Warning:</strong> This data may be out of date. 
                <br>
                Last update was more than a week ago. Please check the council website directly.
            </div>

            <img src="bins.jpg" alt="Bin collection" class="header-image">
        </header>

        <main>
            <div class="results-grid">
                {cards}
            </div>
            
            <div style="margin-top: 1rem; text-align: center; display: flex; flex-direction: column; gap: 0.75rem; align-items: center;">
                <a href="https://www.google.com/calendar/render?cid=webcal://{site_url}/bins.ics" class="btn" target="_blank">
                    📅 Subscribe via Google Calendar
                </a>
                <a href="webcal://{site_url}/bins.ics" class="btn" target="_blank">
                    🍎 Subscribe via Apple Calendar
                </a>
                <a href="https://{site_url}/bins.ics" class="btn" target="_blank">
                    📧 Subscribe via Outlook
                </a>
                <button class="btn" onclick="copyCalendarUrl()" id="copy-btn">
                    📋 Copy Calendar URL
                </button>
            </div>

            <div id="last-updated" data-timestamp="{timestamp_iso}" style="margin-top: 2rem; text-align: center; color: var(--text-muted); font-size: 0.75rem;">
                Last updated: {last_updated}
            </div>
        </main>
    </div>
    <script>
        function copyCalendarUrl() {{
            const url = 'https://{site_url}/bins.ics';
            navigator.clipboard.writeText(url).then(function() {{
                const btn = document.getElementById('copy-btn');
                const originalText = btn.innerHTML;
                btn.innerHTML = '✅ Copied!';
                setTimeout(function() {{
                    btn.innerHTML = originalText;
                }}, 2000);
            }}).catch(function(err) {{
                alert('Failed to copy URL: ' + err);
            }});
        }}

        document.addEventListener('DOMContentLoaded', function() {{
            const lastUpdatedEl = document.getElementById('last-updated');
            const warningEl = document.getElementById('stale-warning');
            
            if (lastUpdatedEl && warningEl) {{
                const timestamp = lastUpdatedEl.getAttribute('data-timestamp');
                if (timestamp) {{
                    const lastUpdateDate = new Date(timestamp);
                    const now = new Date();
                    const diffTime = Math.abs(now - lastUpdateDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                    
                    // Show warning if data is older than 7 days
                    if (diffDays > 7) {{
                        warningEl.style.display = 'block';
                    }}
                }}
            }}
        }});
    </script>
</body>
</html>"""

    card_template = """
                <div class="card">
                    <div class="card-date">{date_display}</div>
                    <div class="card-collections">
                        {collection_items}
                    </div>
                </div>"""
    
    item_template = """
                        <div class="collection-item">
                            <div class="card-icon {class_name}"></div>
                            <span class="collection-name">{type_name}</span>
                        </div>"""

    cards_html = ""
    for date_display, items in grouped_collections.items():
        items_html = ""
        for item in items:
            items_html += item_template.format(
                class_name=item['class'],
                type_name=item['type']
            )
        
        cards_html += card_template.format(
            date_display=date_display,
            collection_items=items_html
        )

    now = datetime.datetime.now()
    return html_template.format(
        location_name=LOCATION_NAME,
        site_url=SITE_URL.rstrip('/'),
        cards=cards_html,
        last_updated=format_friendly_datetime(now),
        timestamp_iso=now.isoformat()
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
    
    # Check if we need to update the ICS file
    new_uids = set()
    for item in parsed_collections:
         dt = item['datetime']
         if dt:
             dt_start = dt.strftime("%Y%m%d")
             new_uids.add(f"{dt_start}-{item['type']}@westberksbins")
    
    existing_uids = set()
    if os.path.exists(ics_path):
        try:
            with open(ics_path, 'r', encoding='utf-8') as f:
                for line in f:
                    if line.startswith('UID:'):
                        existing_uids.add(line.strip().split(':', 1)[1])
        except Exception as e:
            print(f"Warning: Could not read existing ICS file: {e}")

    if new_uids != existing_uids:
        print(f"Dates changed. Generating bins.ics at {ics_path}...")
        try:
            ics = generate_ics(parsed_collections)
            with open(ics_path, "w", encoding="utf-8") as f:
                f.write(ics)
            print("Successfully wrote bins.ics")
        except Exception as e:
            print(f"ERROR writing bins.ics: {e}")
    else:
        print("No changes to bin dates. Skipping ICS update.")
        
    print("Done.")

if __name__ == "__main__":
    main()
