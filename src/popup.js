(function(){
    document.addEventListener('DOMContentLoaded', function() {
        const link = document.getElementById('gotostrava');

        link.addEventListener('click', function() {
            chrome.tabs.create({ url: 'https://www.strava.com/athlete/training' });
        });
    });
})();
