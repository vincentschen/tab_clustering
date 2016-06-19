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