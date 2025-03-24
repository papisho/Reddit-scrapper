
import praw
import random
from datetime import datetime

# Reddit API credentials
reddit = praw.Reddit(
    client_id="bV6nNc8ieM952wGh50o5qw",
    client_secret="sYnegm-cs_eqKAskdJI2XINtFAQRKg",
    user_agent="ScamStories by /u/wild_boars",
)

# Subreddits and keywords to search for
subreddits = ["scams", "legaladvice", "personalfinance"]
keywords = ["scam", "fraud", "stolen", "lost money", "fake", "phishing", "hack", "identity theft"]

def scrape_reddit():
    filtered_stories = []
    seen_ids = set()  # Track seen post IDs to avoid duplicates

    for sub in subreddits:
        subreddit = reddit.subreddit(sub)
        for post in subreddit.hot(limit=20):  # Increase limit to fetch more posts
            if post.id in seen_ids:  # Skip duplicate posts
                continue
            seen_ids.add(post.id)

            # Loosen filters: Allow shorter posts and more links
            if not post.stickied and len(post.selftext) > 100:  # Reduced minimum length
                if any(word in post.selftext.lower() for word in keywords):  # Keyword filter
                    if post.selftext.count("http") < 5:  # Increased link limit
                        filtered_stories.append({
                            "id": post.id,
                            "title": post.title,
                            "text": post.selftext,
                            "upvotes": post.score,
                            "url": post.url,
                            "subreddit": sub,
                            "created_utc": post.created_utc
                        })

    # Shuffle the stories for variation
    random.shuffle(filtered_stories)
    return filtered_stories

if __name__ == "__main__":
    stories = scrape_reddit()
    print(stories)  # For testing

