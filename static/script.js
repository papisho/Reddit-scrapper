
// Initialize Flatpickr for date range picker
flatpickr("#date-range", {
    mode: "range",
    dateFormat: "Y-m-d",
});

// Fetch stories from the backend and display them
async function fetchStories() {
    try {
        const storyCount = document.getElementById("story-count").value;
        const subredditFilter = document.getElementById("subreddit-filter").value;
        const dateRange = document.getElementById("date-range").value;

        const response = await fetch(`/stories?count=${storyCount}&subreddit=${subredditFilter}&date_range=${dateRange}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const stories = await response.json();
        console.log("Fetched stories:", stories);  // Debug statement
        displayStories(stories);
    } catch (error) {
        console.error("Error fetching stories:", error);
    }
}

// Refresh stories by re-scraping Reddit
async function refreshStories() {
    try {
        const response = await fetch("/refresh");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const stories = await response.json();
        console.log("Refreshed stories:", stories);  // Debug statement
        fetchStories();  // Fetch and display the updated stories
    } catch (error) {
        console.error("Error refreshing stories:", error);
    }
}

// Display stories in the HTML
function displayStories(stories) {
    const container = document.getElementById("stories-container");
    if (!container) {
        console.error("Stories container not found!");
        return;
    }
    container.innerHTML = "";  // Clear previous content

    if (stories.length === 0) {
        container.innerHTML = "<p>No stories found.</p>";
        return;
    }

    stories.forEach(story => {
        const storyElement = document.createElement("div");
        storyElement.className = "story";
        storyElement.innerHTML = `
            <h2>${story.title}</h2>
            <p>${story.text.slice(0, 200)}...</p>
            <a href="${story.url}" target="_blank">Read more</a>
        `;
        container.appendChild(storyElement);
    });
}

// Switch between Home and Login tabs
document.getElementById("home-tab").addEventListener("click", () => {
    document.getElementById("home-content").style.display = "block";
    document.getElementById("login-content").style.display = "none";
});

document.getElementById("login-tab").addEventListener("click", () => {
    document.getElementById("home-content").style.display = "none";
    document.getElementById("login-content").style.display = "flex";
});

// Event listeners for buttons
document.getElementById("scrap-button").addEventListener("click", fetchStories);
document.getElementById("refresh-button").addEventListener("click", refreshStories);

// Fetch stories when the page loads (optional)
// window.onload = fetchStories;


/*
// Initialize Flatpickr for date range picker
flatpickr("#date-range", {
    mode: "range",
    dateFormat: "Y-m-d",
});

// Fetch stories from the backend and display them
async function fetchStories() {
    try {
        const storyCount = document.getElementById("story-count").value;
        const subredditFilter = document.getElementById("subreddit-filter").value;
        const dateRange = document.getElementById("date-range").value;

        const response = await fetch(`/stories?count=${storyCount}&subreddit=${subredditFilter}&date_range=${dateRange}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const stories = await response.json();
        console.log("Fetched stories:", stories);  // Debug statement
        displayStories(stories);
    } catch (error) {
        console.error("Error fetching stories:", error);
    }
}

// Refresh stories by re-scraping Reddit
async function refreshStories() {
    try {
        const response = await fetch("/refresh");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const stories = await response.json();
        console.log("Refreshed stories:", stories);  // Debug statement
        fetchStories();  // Fetch and display the updated stories
    } catch (error) {
        console.error("Error refreshing stories:", error);
    }
}

// Display stories in the HTML
function displayStories(stories) {
    const container = document.getElementById("stories-container");
    if (!container) {
        console.error("Stories container not found!");
        return;
    }
    container.innerHTML = "";  // Clear previous content

    if (stories.length === 0) {
        container.innerHTML = "<p>No stories found.</p>";
        return;
    }

    stories.forEach(story => {
        const storyElement = document.createElement("div");
        storyElement.className = "story";
        storyElement.innerHTML = `
            <h2>${story.title}</h2>
            <p>${story.text.slice(0, 200)}...</p>
            <a href="${story.url}" target="_blank">Read more</a>
        `;
        container.appendChild(storyElement);
    });
}

// Event listeners for buttons
document.getElementById("scrap-button").addEventListener("click", fetchStories);
document.getElementById("refresh-button").addEventListener("click", refreshStories);

// Fetch stories when the page loads (optional)
// window.onload = fetchStories;
*/

