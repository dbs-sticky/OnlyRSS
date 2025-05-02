# bike-ride.py


import urllib.request
import urllib.parse
import urllib.error
import requests
import json
import sys
import csv
import os
from dotenv import load_dotenv # Import the function
import re # Import regular expressions for finding the div
from datetime import datetime
from google import genai # Added for Gemini
import markdown # Added for Markdown to HTML conversion

# Load environment variables from .env file
load_dotenv() # This reads the .env file and loads variables into the environment

# --- Configuration ---
# Now os.getenv will find the variables loaded from .env
VISUAL_CROSSING_API_KEY = os.getenv('VISUAL_CROSSING_API_KEY')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
DATAWRAPPER_API_KEY = os.getenv('DATAWRAPPER_API_KEY')

# Add checks to ensure keys were loaded
if not VISUAL_CROSSING_API_KEY:
    print("Error: VISUAL_CROSSING_API_KEY not found in environment or .env file.")
    sys.exit(1)
if not GEMINI_API_KEY:
    print("Error: GEMINI_API_KEY not found in environment or .env file.")
    sys.exit(1)
if not DATAWRAPPER_API_KEY:
    print("Error: DATAWRAPPER_API_KEY not found in environment or .env file.")
    sys.exit(1)

LOCATION = 'burghfield common' # Location for the weather report
UNIT_GROUP = 'metric'

# Get the absolute path of the directory containing this script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Define OUTPUT_DIR relative to the script's location
OUTPUT_DIR = os.path.join(SCRIPT_DIR, 'output') # Directory to save the output files

# --- Create output directory if it doesn't exist ---
if not os.path.exists(OUTPUT_DIR):
    try:
        os.makedirs(OUTPUT_DIR)
        print(f"Created output directory: {OUTPUT_DIR}")
    except OSError as e:
        print(f"Error creating directory {OUTPUT_DIR}: {e}")
        sys.exit(1) # Exit if directory creation fails

CSV_FILENAME = os.path.join(OUTPUT_DIR, 'weather_data.csv')
JSON_FILENAME = os.path.join(OUTPUT_DIR, 'weather_data_filtered.json') # Optional: Save filtered data
# Ensure this points to the EXISTING HTML file you want to update
HTML_REPORT_FILENAME = os.path.join(OUTPUT_DIR, 'burghfield.html')

# Construct the API URL
# URL encodes the location automatically if needed, but pre-encoding is safer
# encoded_location = urllib.parse.quote(LOCATION)
# API_URL = f"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{encoded_location}/today?unitGroup={UNIT_GROUP}&elements=datetime%2Ctemp%2Cfeelslike%2Cprecipprob%2Cwindgust%2Cwindspeed%2Cvisibility%2Cuvindex%2Csunrise%2Csunset&include=hours&key={VISUAL_CROSSING_API_KEY}&contentType=json"


encoded_location = urllib.parse.quote(LOCATION)
API_URL = f"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{encoded_location}/today?unitGroup={UNIT_GROUP}&elements=datetime%2Ctemp%2Cfeelslike%2Cprecip%2Cprecipprob%2Cwindspeed%2Ccloudcover%2Cvisibility%2Csolarradiation%2Csunrise%2Csunset&include=hours&key={VISUAL_CROSSING_API_KEY}&contentType=json"

# --- Helper Functions ---

def fetch_weather_data(url):
    """Fetches weather data from the Visual Crossing API."""
    print(f"Fetching weather data for '{LOCATION}'...")
    try:
        # Use a 'with' statement for automatic resource management
        with urllib.request.urlopen(url) as response:
            if response.status != 200:
                print(f"Error: API request failed with status code {response.status}")
                try:
                    error_info = response.read().decode()
                    print(f"Error details: {error_info}")
                except Exception as read_err:
                    print(f"Could not read error details: {read_err}")
                return None

            print("API request successful.")
            # print("Response Headers:", response.headers) # Uncomment for debugging
            jsonData = json.load(response)
            return jsonData

    except urllib.error.HTTPError as e:
        # More specific error handling for HTTP errors
        error_info = "No details available."
        try:
            error_info = e.read().decode()
        except Exception:
            pass # Ignore if reading the error body fails
        print(f'HTTP Error fetching data: {e.code} {e.reason}\nDetails: {error_info}')
        return None
    except urllib.error.URLError as e:
        # Handle errors like network connection issues
        print(f'URL Error fetching data: {e.reason}')
        return None
    except json.JSONDecodeError as e:
        print(f'Error decoding JSON response: {e}')
        return None
    except Exception as e:
        # Catch any other unexpected errors during the fetch process
        print(f'An unexpected error occurred during fetch: {e}')
        return None

def calculate_bike_temp(temp, windspeed):
    """
    Calculates an approximate 'bike temp' using a wind chill formula.
    Formula: Twc = 13.12 + 0.6215*Ta - 11.37*V^0.16 + 0.3965*Ta*V^0.16
    Assumes temp in Celsius and windspeed in km/h.
    Note: This formula is generally valid for temps <= 10°C and wind >= 4.8 km/h.
    Returns None if calculation is not possible or inputs are invalid.
    """
    # Return air temperature if wind speed is negligible, as formula is less applicable
    if windspeed is None or windspeed < 4.8:
        return temp # Return original temp if wind is low or unknown

    if temp is None:
        return None # Cannot calculate without temperature

    try:
        # Ensure inputs are numeric for calculation
        temp_c = float(temp)
        wind_kmh = float(windspeed)

        # Apply the wind chill formula
        bike_temp = (13.12 + 0.6215 * temp_c
                     - 11.37 * (wind_kmh ** 0.16)
                     + 0.3965 * temp_c * (wind_kmh ** 0.16))
        return round(bike_temp, 2) # Round to two decimal places
    except (ValueError, TypeError, OverflowError) as e:
        # Handle cases where conversion to float fails or calculation errors occur
        print(f"Warning: Could not calculate biketemp for temp={temp}, windspeed={windspeed}. Error: {e}")
        return None # Indicate calculation failure

def process_data(jsonData):
    """
    Processes the raw JSON data: adds biketemp, filters by time,
    and returns filtered data, headers, sunrise hour, and sunset hour.
    """
    sunrise_hour_int = None
    sunset_hour_int = None
    sunrise_str_ret = None
    sunset_str_ret = None

    if not jsonData or 'days' not in jsonData or not jsonData['days']:
        print("Error: Invalid or empty JSON data received for processing.")
        # Return None for all expected values on critical failure
        return None, None, None, None, None, None

    try:
        todayData = jsonData['days'][0]
        hourlyData = todayData.get('hours', []) # Use .get for safer access
        day_date_str = todayData.get('datetime') # Get the date string for the report

        if not hourlyData:
            print("Warning: No hourly data found in the API response.")
            # Return empty lists/None if no hours data, but might still have date/sunrise/sunset
            sunrise_str_ret = todayData.get('sunrise')
            sunset_str_ret = todayData.get('sunset')
            try:
                if sunrise_str_ret: sunrise_hour_int = int(sunrise_str_ret.split(':')[0])
                if sunset_str_ret: sunset_hour_int = int(sunset_str_ret.split(':')[0])
            except (ValueError, IndexError, TypeError):
                 print("Warning: Could not parse sunrise/sunset hours even though times exist.")
            return [], [], day_date_str, sunrise_hour_int, sunset_hour_int, hourlyData # Return all hours if none found

        processed_hourly_data = []
        # Add 'biketemp' to each hour
        for hour in hourlyData:
            temp = hour.get('temp')
            windspeed = hour.get('windspeed')
            # Calculate biketemp only if temp and windspeed are available
            hour['biketemp'] = calculate_bike_temp(temp, windspeed)
            # Rename 'feelslike' to 'windchill (walk)' for clarity in prompt/output
            if 'feelslike' in hour:
                hour['windchill (walk)'] = hour.pop('feelslike')
            # Rename 'biketemp' to 'windchill (bike)'
            if 'biketemp' in hour:
                 hour['windchill (bike)'] = hour.pop('biketemp')
            processed_hourly_data.append(hour) # Keep the hour even if biketemp is None


        # Get sunrise/sunset times for filtering and reporting
        sunrise_str_ret = todayData.get('sunrise')
        sunset_str_ret = todayData.get('sunset')

        if not sunrise_str_ret or not sunset_str_ret:
            print("Warning: Sunrise or sunset time missing from data. Filtering by time not possible.")
            filtered_data = processed_hourly_data # Use all hours if times are missing
        else:
            try:
                # Extract hour part and convert to integer for filtering logic
                sunrise_hour_int = int(sunrise_str_ret.split(':')[0])
                sunset_hour_int = int(sunset_str_ret.split(':')[0])

                # Filter hours: 1 hour before sunrise to 1 hour after sunset (for context, maybe prompt needs only between?)
                # Prompt asks for table rows BETWEEN sunrise and sunset, let's adjust filter for that
                filtered_data = [
                    hour for hour in processed_hourly_data
                    # Check if 'datetime' exists and has the expected format
                    if 'datetime' in hour and isinstance(hour['datetime'], str) and ':' in hour['datetime'] and
                       # Safely convert hour part to integer for comparison
                       # Filter strictly between sunrise and sunset hours as requested for table
                       (sunrise_hour_int) <= int(hour['datetime'].split(':')[0]) <= (sunset_hour_int)
                ]
            except (ValueError, IndexError, TypeError) as e:
                # Handle errors during time parsing or comparison
                print(f"Error parsing time strings (sunrise: {sunrise_str_ret}, sunset: {sunset_str_ret}) or filtering: {e}")
                print("Returning all processed hourly data as fallback.")
                filtered_data = processed_hourly_data # Fallback to all data on error

        if not filtered_data:
            print("Warning: No data available within the filtered time range (sunrise to sunset).")
            # Still return sunrise/sunset if available, but empty data/headers
            return [], [], day_date_str, sunrise_hour_int, sunset_hour_int, processed_hourly_data # Return all hours for context

        # Determine headers dynamically from the keys of the first record
        # This ensures all columns, including calculated/renamed ones, are included
        headers = list(filtered_data[0].keys())
        # Return filtered_data for CSV, full processed_hourly_data for Gemini context
        return filtered_data, headers, day_date_str, sunrise_hour_int, sunset_hour_int, processed_hourly_data

    except KeyError as e:
        # Handle cases where expected keys like 'days', 'hours' are missing
        print(f"Error processing data: Missing expected key in JSON structure - {e}")
        return None, None, None, None, None, None
    except Exception as e:
        # Catch any other unexpected errors during processing
        print(f"An unexpected error occurred during data processing: {e}")
        return None, None, None, None, None, None


def ensure_dir(directory):
    """Creates the specified directory if it doesn't exist."""
    try:
        os.makedirs(directory, exist_ok=True)
    except OSError as e:
        print(f"Error creating directory {directory}: {e}")
        return False
    return True

def write_to_json(data, filename):
    """Writes the processed data to a JSON file."""
    if data is None: # Check if data is None (indicating an earlier error)
        print("Skipping JSON write due to missing data.")
        return
    if not ensure_dir(os.path.dirname(filename)):
        return # Stop if directory creation failed

    try:
        with open(filename, 'w', encoding='utf-8') as json_file:
            json.dump(data, json_file, indent=4)
        print(f"Filtered data successfully written to {filename}")
    except IOError as e:
        print(f"Error writing JSON file {filename}: {e}")
    except Exception as e:
        print(f"An unexpected error occurred during JSON write: {e}")

def write_to_csv(data, headers, filename):
    """Writes the processed data to a CSV file."""
    # Check for valid data and headers before proceeding
    if not data or not headers:
        print("Skipping CSV write due to missing data or headers.")
        return
    if not ensure_dir(os.path.dirname(filename)):
        return # Stop if directory creation failed

    try:
        with open(filename, mode='w', newline='', encoding='utf-8') as file:
            # Use DictWriter for easier writing based on headers
            # Adjust fieldnames to match the potentially renamed keys if needed, but process_data now returns correct headers
            writer = csv.DictWriter(file, fieldnames=headers, extrasaction='ignore') # Ignore extra fields if any
            writer.writeheader() # Write the header row
            writer.writerows(data) # Write all data rows
        print(f"Data successfully written to {filename}")
    except IOError as e:
        print(f"Error writing CSV file {filename}: {e}")
    except Exception as e:
        print(f"An unexpected error occurred during CSV write: {e}")

def update_html_div(html_content_to_insert, filename, div_class="ai-output"):
    """
    Updates the content of a specific div in an existing HTML file.
    """
    if not html_content_to_insert:
        print("Skipping HTML update due to empty content.")
        return
    if not os.path.exists(filename):
        print(f"Error: Cannot update HTML. File not found: {filename}")
        # Optionally, create a basic file structure here if desired
        # print(f"Creating {filename} with basic structure.")
        # basic_html = f'<!DOCTYPE html><html><head><title>Report</title></head><body><div class="{div_class}"></div></body></html>'
        # try:
        #     ensure_dir(os.path.dirname(filename))
        #     with open(filename, 'w', encoding='utf-8') as file:
        #         file.write(basic_html)
        # except IOError as e:
        #     print(f"Error creating basic HTML file {filename}: {e}")
        #     return # Stop if creation fails
        return # Stop if file doesn't exist and we don't create it

    try:
        # Read the existing HTML content
        with open(filename, 'r', encoding='utf-8') as file:
            existing_html = file.read()

        # --- Use Regular Expression to find and replace the div content ---
        # This pattern finds <div class="ai-output"> potentially with other attributes,
        # captures the content inside (non-greedily), and finds the closing </div>.
        # It uses re.DOTALL so '.' matches newline characters.
        pattern = re.compile(rf'(<div\s+class="{div_class}"[^>]*>).*?(</div>)', re.IGNORECASE | re.DOTALL)

        # Replace the content between the tags with the new content
        # The replacement includes the original start tag (group 1), the new content, and the original end tag (group 2)
        new_html, num_replacements = pattern.subn(rf'\1{html_content_to_insert}\2', existing_html)

        if num_replacements == 0:
            print(f"Warning: Target div with class='{div_class}' not found in {filename}. HTML file not updated.")
            # Optionally append the div if not found
            # print(f"Appending new div with class='{div_class}' to {filename}.")
            # append_point = existing_html.lower().find('</body>')
            # if append_point != -1:
            #     new_div = f'<div class="{div_class}">\n{html_content_to_insert}\n</div>\n'
            #     new_html = existing_html[:append_point] + new_div + existing_html[append_point:]
            # else: # Fallback if no body tag found
            #     new_html = existing_html + f'\n<div class="{div_class}">\n{html_content_to_insert}\n</div>'
            # # Write the modified HTML (with appended div) back to the file
            # with open(filename, 'w', encoding='utf-8') as file:
            #     file.write(new_html)
            # print(f"HTML file {filename} updated by appending the div.")

        else:
            # Write the modified HTML (with replaced div content) back to the file
            with open(filename, 'w', encoding='utf-8') as file:
                file.write(new_html)
            print(f"HTML file {filename} successfully updated within <div class='{div_class}'>.")

    except IOError as e:
        print(f"Error reading or writing HTML file {filename}: {e}")
    except Exception as e:
        print(f"An unexpected error occurred during HTML update: {e}")

def create_simple_html_page(content, filename):
    """
    Creates a simple HTML page with just the provided content and the current date/time as a heading.
    """
    if not content:
        print("Skipping simple HTML page creation due to empty content.")
        return
    
    try:
        # Convert Markdown to HTML if the content is in Markdown format
        html_content = markdown.markdown(content, extensions=['tables'])
        
        # Get current date and time for the heading
        current_datetime = datetime.now().strftime('%A, %d %B %Y at %I:%M%p')
        
        # Create a simple HTML document structure
        simple_html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bike Ride Weather Report</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
        }}
        h1 {{
            color: #333;
        }}
        ul {{
            padding-left: 20px;
        }}
        li {{
            margin-bottom: 10px;
        }}
    </style>
</head>
<body>
    <h1>Weather Report - {current_datetime}</h1>
    {html_content}
</body>
</html>'''

        # Ensure the directory exists
        ensure_dir(os.path.dirname(filename))
        
        # Write to the file
        with open(filename, 'w', encoding='utf-8') as file:
            file.write(simple_html)
        
        print(f"Simple HTML page successfully created at {filename}")
    
    except IOError as e:
        print(f"Error writing simple HTML file {filename}: {e}")
    except Exception as e:
        print(f"An unexpected error occurred during simple HTML creation: {e}")

# --- Main Execution Block ---
if __name__ == "__main__":
    print(f"--- Starting Weather Report Generation ({datetime.now()}) ---")

    # 1. Fetch Data from API
    raw_weather_data = fetch_weather_data(API_URL)

    # Proceed only if data fetching was successful
    if raw_weather_data:
        # Optional: Print raw data for debugging
        # print("\nRaw JSON Data received:")
        # print(json.dumps(raw_weather_data, indent=4))

        # 2. Process the fetched data
        print("\nProcessing weather data...")
        # Get all return values from process_data
        filtered_data_for_csv, csv_headers, report_date_str, sunrise_hour, sunset_hour, all_hourly_data_for_gemini = process_data(raw_weather_data)

        # Proceed only if processing returned necessary info (even if filtered_data is empty)
        if report_date_str is not None and sunrise_hour is not None and sunset_hour is not None and all_hourly_data_for_gemini is not None:

            # 3. Write Filtered Data to CSV (using filtered_data_for_csv)
            write_to_csv(filtered_data_for_csv, csv_headers, CSV_FILENAME)

            # 4. Call Gemini API
            print("\nGenerating bike ride analysis with Gemini...")
            try:
                # Configure the Gemini client
                # genai.configure(api_key=GEMINI_API_KEY)
                # Use a known valid model name, e.g., gemini-1.5-flash
                # client = genai.GenerativeModel(model_name="gemini-1.5-flash")
                client = genai.Client(api_key=GEMINI_API_KEY)

                # Prepare the prompt content carefully
                # Use all_hourly_data_for_gemini which includes renamed keys
                response = client.models.generate_content(
                    model="gemini-2.0-flash", 
                    contents = f"""
Your job is to assess the day's weather and determine the best 1, 2, 3, 4 and 5 hour slots for a bike ride.
The weather data is provided in JSON format. Here's the JSON data containing the hourly weather metrics: {json.dumps(all_hourly_data_for_gemini)}. 
The JSON contains hourly weather metrics for the day, including the datetime, temp, windchill (walk), windchill (bike), precip, precipprob, windspeed, visibility, cloudcover, and solarradiation for each hour of the day.
The data is for {LOCATION}, England, United Kingdom.
The metrics are:
* "temp": This is the air temperature, and should be referred to as “temperature” and is in °C.
* windchill (walk): This considers windchill, and should be referred to as "walk temperature" and is in °C.
* windchill (bike): This considers windchill, and should be referred to as "bike temperature" and is in °C.
* precip: The amount of rain that fell or is predicted to fall in the specified time period. The values are indicated in mm. This should be referred to as "rainfall"
* precipprob: This is the possibility of rain for the given time period expressed as a percentage from 0-100%. This should be referred to as "rain probability"
* windspeed: Which should be referred to as "wind speed" and is in kph.
* visibility: This is the distance that can be seen in daylight. Which should be referred to as "visibility", and is in km.
* cloudcover: Cloud cover is the amount of sky that is covered by cloud expressed as a percentage, and should be referred to as "cloud cover"
* solarradiation: The solar radiation measures the power (in W/m2) at the instantaneous moment of the observation (or forecast prediction), this should be referred to as "solar radiation".
High solar radiation, low cloud cover, and high bike temperature are preferred, but ALL weather metrics should be taken into consideration. A low precipprob should not be a deterrent, but high precipprob should be avoided.
In a bulleted list (2 list items) show the "Data updated:" as the first item and "Data valid for:" as the second list item.
"Data updated:" in the format like this "Thursday 22nd April 2025 at 5:30pm". The data was last updated at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}.
"Data valid for:" in the format like this "Thursday 22nd April 2025". The date today is {report_date_str}.
All the bike riding slots should start after Sunrise and be complete before Sunset.
All riding slots i.e. 1hr, 2hr, 3hr, 4hr, and 5hr should be continuous hours that fall within sunrise ({sunrise_hour}) and sunset ({sunset_hour}).
List the best time-slots as an unordered list with each time slot being an item in that list. 1 through 5, starting with 1hr:, 2hr: etc. and always explain your reasoning for each on the same line. This list should have the following heading "Best Bike Riding Time-slots:" as a 3rd level heading. Each item should start with the following format e.g. **1hr**: 3pm – 4pm. When referring to time ranges, please use the 12-hour clock format with 'am' and 'pm' indicators. For example, write '3pm - 4pm' rather than '15:00 - 16:00'. Always use lowercase for 'am' and 'pm' without periods, and include a space before and after the dash between times. And be followed with the explanation. Keep the explanation brief, there's no need to list out all the specific weather metrics, just the ones that are most important for bike riding. And even then there's no need to list out the metrics values exactly, but you can show the metrics if you believe they are pertenant.
Do not use paragraph tags within <li> elements
Other than the two lists and the heading, do not include any other output in your response.
Rather that state "degrees", state "°C" for temperatures.
All output should be in Markdown.
"""
                )
                # Make the API call
                # response = client.generate_content(prompt_content)
                # response = client.models.generate_content(prompt_content) # Original line, might need adjustment based on genai library version

                # 5. Process and Output Gemini Response
                if response and hasattr(response, 'text') and response.text: # Check response structure
                    gemini_output_markdown = response.text
                    print("\n--- Gemini Bike Ride Analysis ---")
                    print(gemini_output_markdown)
                    print("--- End of Gemini Analysis ---")

                    # Convert Markdown to HTML (just the Gemini part)
                    # Use extensions for better table formatting if needed
                    html_output_fragment = markdown.markdown(gemini_output_markdown, extensions=['tables'])

                    # Update the existing HTML file within the specified div
                    update_html_div(html_output_fragment, HTML_REPORT_FILENAME, div_class="ai-output")
                    
                    # Create the simple HTML page with just the Gemini output
                    simple_html_filename = os.path.join(OUTPUT_DIR, 'trmnl-bike.html')
                    create_simple_html_page(gemini_output_markdown, simple_html_filename)

                else:
                    print("\nError: Received no valid text response from Gemini.")
                    # Print debugging info if available
                    if response:
                        # Try accessing potential error attributes or parts
                        error_details = getattr(response, 'prompt_feedback', None) or getattr(response, 'candidates', None)
                        print(f"Gemini Response Details/Error: {error_details or response}")


            except Exception as genai_err:
                print(f"\nError during Gemini API call or processing: {genai_err}")

        else:
            # Processing failed or didn't return necessary info
            print("Data processing failed or did not return required information (date/sunrise/sunset/hourly data). Cannot generate Gemini report or CSV.")
            # sys.exit(1) # Optional: exit if processing failure is critical
    else:
        # Fetching failed, print message and exit
        print("Failed to fetch weather data. Cannot generate report.")
        sys.exit(1) # Exit if fetching fails

    print(f"\n--- Weather Report Generation Finished ({datetime.now()}) ---")


    # Now update the Datawrapper chart

url = "https://api.datawrapper.de/v3/charts/aI2gc"

# Create a dynamic chart title using the report_date_str
if report_date_str:
  # Convert the date string to a datetime object
  try:
    date_obj = datetime.strptime(report_date_str, "%Y-%m-%d")
    # Get the day name from the date
    day_name = date_obj.strftime("%A")
    payload = {"title": f"Hourly metrics for {day_name}"}
  except ValueError:
    # Fallback if date parsing fails
    print(f"Warning: Could not parse date string: {report_date_str}")
    payload = {"title": "Hourly weather metrics"}
else:
  # Fallback if no date is available
  payload = {"title": "Hourly weather metrics"}

headers = {"accept": "*/*",
           "Authorization": f"Bearer {DATAWRAPPER_API_KEY}",
           "content-type": "application/json"
           }

response = requests.patch(url, json=payload, headers=headers)

print(response.text)

# Add code to publish the chart
publish_url = "https://api.datawrapper.de/v3/charts/aI2gc/publish"

headers = {"accept": "*/*",
           "Authorization": f"Bearer {DATAWRAPPER_API_KEY}"
           }

# Reuse the same headers for authorization
publish_response = requests.post(publish_url, headers=headers)

print(publish_response.text)