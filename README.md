## About
TabShifter is a Google Chrome extension that moves your tab to a logical place with your other tabs. Each tab is placed in a cluster with other tabs that are similar to it. Upon opening a tab, our backend returns an array of similarity scores between that tab and other open tabs. Then, we figure out which cluster that tab is most similar to and move that tab to that cluster. Additional features are added including coloring of favicons in a particular cluster to the same color for easy visualization of cluster start and ends.

## First time install
1. Download or clone the repo. 
2. Open `chrome://extensions`.
3. Make sure "Developer Mode" is selected.
3. "Load Unpacked Extension" > Select the `app` folder. 
4. Reload `CMD + R` to make changes. 

## Running Server 
1. Navigate to `server`.
2. Install a virtualenv `virtualenv .env`. If you don't have virtualenv, install it using `sudo pip install virtualenv`
3. Active the virtualenv `source .env/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Export environment variables: `export FLASK_APP=server.py`
6. To run: `flask run`
