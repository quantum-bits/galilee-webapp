## Galilee quick setup instructions for Ubuntu 16.04

1. Create a directory such as 'galilee' to store the galilee-server and galilee-webapp files
	* $ `git clone https://github.com/quantum-bits/galilee-server.git`
	* $ `git clone https://github.com/quantum-bits/galilee-webapp`

2. Download the secret.conf.json file and put it in the galilee-server source tree
	* DO NOT COMMIT IT TO GITHUB

3. Upgrade/install Node using nvm (https://github.com/creationix/nvm)
	* $ `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash`
	* Close and reopen your terminal
	* $ `command -v nvm`
		* verify it outputs "nvm"
	* Install the latest version of node and use it
		* $ `nvm install node`
		* $ `nvm use node`

4. Install PostgreSQL (https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04)
	* $ `sudo apt-get update`
	* $ `sudo apt-get install postgresql postgresql-contrib`

5. Setup PGSQL for galilee User
	* $ `sudo -u postgres createuser --login --pwprompt galilee`
		* use "pass" as the password
	* $ `sudo -u postgres createdb --owner=galilee galilee`

6. Setup and start galilee-server - run these commands in the galilee-server directory
	* $ `npm install`
	* Initialize the database
		* $ `npm run knex:migrate:dev`
		* $ `npm run knex:seed:dev`
	* Run the server (use this command for development; will update changes)
		* $ `npm run watch:dev`

7. Setup and start galilee-webapp - run these commands in the galilee-app directory
	* $ `npm install`
	* Run the web-app!
		* $ `npm start`

