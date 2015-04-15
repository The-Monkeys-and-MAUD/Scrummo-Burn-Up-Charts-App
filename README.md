Scrummo Burn Up Charts
=======================

####Scrummo adds Agile points estimation to Trello

Points (or "story points") are used for estimation in agile methodologies such as Scrum. We made Scrummo because we wanted a points plugin that works a little differently to others that are available.

####Chrome Plugin

Scrummo has a Chrome extension available in the Chrome Webstore. Installation is about as easy as it gets.

Download it here and start estimating!
https://chrome.google.com/webstore/detail/blocgblopglhhmdeeafpljaameimgega/

#####Notes:
* When you add points to the card, Scrummo puts the points into a comment so that they have a date association
* You can make a burn up chart for your project at http://scrummo.io, or by forking this repo, and running it locally.

####Credits
Scrummo was developed by The Monkeys:

    Peter Vahaviolos - https://github.com/taledo
    Chris Langlands - https://github.com/hooch
    Kynan Hughes - https://github.com/k7n4n5t3w4rt
    Petra Gulicher - https://github.com/petronbot
    Han Lee - https://github.com/hanl
    Philip Pondijo - https://github.com/phipon

We use it for all our projects, some of which can be seen on http://themonkeys.com.au.

####GitHub

Plz fork it on GitHub and submit a pull request with your suggested improvements - https://github.com/TheMonkeys/Scrummo-Browser-Plugin


Requirements
------------

### Apache 2

If you're on Mac OS X you can use MAMP for this if you like. However you set it up, you'll need to be able to edit your
virtual host configuration.

### PHP >= 5.3.7

With the following extensions:

- MCrypt
- PDO with MySQL support
- mbstring

You can use MAMP for this if you like; if you do, set up your PATH so you can use php and mysql tools on the command
line:



    echo -e '\nexport PATH=/Applications/MAMP/bin/php/php5.4.4/bin:/Applications/MAMP/Library/bin:$PATH\n\n' >> ~/.profile

### MySQL

As above, you can use MAMP for this if you like.

Installing phpMyAdmin will be helpful if you don't have any other mysql tools installed.

### Ruby

The version of Ruby that comes preinstalled on Mac OS X is fine; if you don't have Ruby 1.8 installed
then follow the instructions at [http://www.ruby-lang.org/en/downloads/](http://www.ruby-lang.org/en/downloads/).

### NodeJS

Follow NodeJS install instructions at [http://nodejs.org/download/](http://nodejs.org/download/).

Then install the build system's requirements like so:

```bash
sudo easy_install Pygments &&
    sudo npm install -g grunt-cli mocha testem livereload docco &&
    sudo gem install compass
```

Note that that also installed the Ruby module `compass`.

### Composer

Follow the instructions at [http://getcomposer.org/](http://getcomposer.org/).

Setting up your development environment
---------------------------------------

Once you have the above requirements installed, you can set up your development server.

### Bootstrap your build environment

If you're on a unix-like environment, you can run:

```bash
./init.sh
```

Otherwise you'll need to do it manually:

```bash
cd build/
npm install
composer install
```

### Run a front-end production build

```
grunt
```

### Apache

Edit your /etc/hosts file (something like C:/Windows/System32/drivers/etc/hosts on Windows):

```
127.0.0.1       Scrummo-Burn-Up-Charts.dev
```

Then add a virtual host to your Apache configuration:

```
<VirtualHost *>
    DocumentRoot "/path/to/Scrummo-Burn-Up-Charts/build/public/"
    ServerName Scrummo-Burn-Up-Charts.dev
    <Directory /path/to/Scrummo-Burn-Up-Charts/build/public/>
        AllowOverride All
        Order allow,deny
        Allow from all
    </Directory>
</VirtualHost>

```

### MySQL

To avoid any extra configuration, create a database called `scrummo` and a user called
`scrummo` with password `scrummo` with `SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER`
permissions on the `scrummo` database, with access from localhost.

If you must use a different configuration, then create a file `build/app/config/local/database.php` using the one in
`build/app/config/database.php` as a template (you only need to include settings that differ from those in
`build/app/config/database.php` - Laravel config settings are inherited). Note that an existing .gitignore file will
prevent your local configuration being checked in to git.

If your machine's `hostname` ends in `.local` then the `--env=local` part above is optional. Unfortunately Laravel 4
defaults to `production` if it can't match your hostname against the patterns in `build/bootstrap/start.php` so it
would be good to get into the habit of using `--env` all the time, just in case.

### Bootstrap your database

```bash
cd build/
php artisan migrate --env=local --seed
```

### Test

Visit [http://Scrummo-Burn-Up-Charts.dev/](http://Scrummo-Burn-Up-Charts.dev/) and you should see the home page. Check your browser's error console
for any load errors or javascript errors.

Visit [http://Scrummo-Burn-Up-Charts.dev/tests/](http://Scrummo-Burn-Up-Charts.dev/tests/) to run the automated acceptance tests.

Building
--------

In development, run the following command to have the grunt watcher build your sass and js as you work:

    cd build/
    grunt dev

Prior to checkin or release, run a full grunt build to ensure the linter is happy with your code and all tests pass:

    cd build/
    grunt
