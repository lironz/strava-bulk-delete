let manifest = {
    "name": "Strava bulk remove",
    "version": "1.0.1",
    "description": "Bulk remove activities from Strava - by Paul du Pavillon",
    "manifest_version": 2,
    "permissions": [
        "tabs", "https://www.strava.com/athlete/training"
    ],
    "content_scripts": [
        {
            "matches": ["https://www.strava.com/athlete/training"],
            "js": ["script.js"]
        }
    ],
    "browser_action": {
        "default_icon": "assets/icons/48.png",
        "default_popup": "popup.html"
    },
    "icons": {
        "16": "assets/icons/16.png",
        "48": "assets/icons/48.png",
        "128": "assets/icons/128.png"
    }
}

console.log(JSON.stringify(manifest, null, '\t'));