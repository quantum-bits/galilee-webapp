## Galilee quick setup instructions for Ubuntu 16.04

1. Create a directory such as 'galilee' to store the galilee-server and galilee-webapp files
	a. $ `git clone https://github.com/quantum-bits/galilee-server.git`
	b. $ `git clone https://github.com/quantum-bits/galilee-webapp`

2. Download the secret.conf.json file and put it in the galilee-server source tree
	a. DO NOT COMMIT IT TO GITHUB

3. Upgrade/install Node using nvm (https://github.com/creationix/nvm)
	a. $ `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash`
	b. Close and reopen your terminal
	c. $ `command -v nvm`
		1. verify it outputs "nvm"
	d. Install the latest version of node and use it
		1. $ `nvm install node`
		2. $ `nvm use node`

4. Install PostgreSQL (https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04)
	a. $ `sudo apt-get update`
	b. $ `sudo apt-get install postgresql postgresql-contrib`

5. Setup PGSQL for galilee User
	a. $ `sudo -u postgres createuser --login --pwprompt galilee`
		1. use "pass" as the password
	b. $ `sudo -u postgres createdb --owner=galilee galilee`

6. Setup and start galilee-server - run these commands in the galilee-server directory
	a. $ `npm install`
	b. Initialize the database
		1. $ `npm run knex:migrate:dev`
		2. $ `npm run knex:seed:dev`
	c. Run the server (use this command for development; will update changes)
		1. $ `npm run watch:dev`

7. Setup and start galilee-webapp - run these commands in the galilee-app directory
	a. $ `npm install`
	b. Fix Materialize issue (Need to do this when you update SASS)
		1. $ `sudo gem install sass` (Make sure you have sass installed)
		2. $ `./run-sass.sh`
	c. Run the web-app!
		1. $ `npm start`

