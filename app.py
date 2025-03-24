
from flask import Flask, jsonify, render_template, request
import json
import scraper_2
from datetime import datetime

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")  # Serve the Home page

@app.route("/login")
def login():
    return render_template("login.html")  # Serve the Login page

@app.route("/scrape")
def scrape_reddit():
    try:
        # Run the scraper and save results to scam_stories.json
        stories = scraper_2.scrape_reddit()
        with open("scam_stories.json", "w") as f:
            json.dump(stories, f, indent=4)
        print("Scraped stories:", stories)  # Debug statement
        return jsonify(stories)  # Return the scraped data as JSON
    except Exception as e:
        print("Error during scraping:", e)  # Debug statement
        return jsonify({"error": str(e)}), 500

@app.route("/refresh")
def refresh_stories():
    try:
        # Re-scrape Reddit and update scam_stories.json
        stories = scraper_2.scrape_reddit()
        with open("scam_stories.json", "w") as f:
            json.dump(stories, f, indent=4)
        print("Refreshed stories:", stories)  # Debug statement
        return jsonify(stories)  # Return the newly scraped data as JSON
    except Exception as e:
        print("Error during refresh:", e)  # Debug statement
        return jsonify({"error": str(e)}), 500

@app.route("/stories")
def get_stories():
    try:
        # Load stories from scam_stories.json
        with open("scam_stories.json", "r") as f:
            stories = json.load(f)

        # Apply filters
        count = int(request.args.get("count", 10))  # Default to 10 stories
        subreddit = request.args.get("subreddit", "all")  # Default to all subreddits
        date_range = request.args.get("date_range", "")  # Default to no date filter

        # Filter by subreddit
        if subreddit != "all":
            stories = [story for story in stories if story["subreddit"].lower() == subreddit.lower()]

        # Filter by date range
        if date_range:
            try:
                start_date, end_date = date_range.split(" to ")
                start_timestamp = datetime.strptime(start_date, "%Y-%m-%d").timestamp()
                end_timestamp = datetime.strptime(end_date, "%Y-%m-%d").timestamp()
                stories = [story for story in stories if start_timestamp <= story["created_utc"] <= end_timestamp]
            except Exception as e:
                print("Error parsing date range:", e)

        # Limit the number of stories
        stories = stories[:count]

        print("Filtered stories:", stories)  # Debug statement
        return jsonify(stories)  # Return the filtered stories as JSON
    except Exception as e:
        print("Error loading stories:", e)  # Debug statement
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)  # Run the Flask server
