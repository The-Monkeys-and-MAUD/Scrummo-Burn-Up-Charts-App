#!/bin/bash

# script directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# list executable commands separated by space
commandependencies=( php mysql npm grunt compass composer )

# show success message
function msgsuccess() {
    echo "$(tput setaf 2)OK$(tput sgr0)";
}

# show fail message and stop execution
function msgfail() {
    echo -e >&2 "$(tput setaf 1)FAIL$(tput sgr0)"; exit 1;
}

# check executable is on env path
function checkcommand() {
    command -v $1 >/dev/null 2>&1 || { msgfail; }
}

# check for project dependencies
function checkdependencies() {
    for i in "${commandependencies[@]}"
    do
        echo -n "Checking for executable $i..."
        checkcommand $i
        msgsuccess
    done
}

function checkdevdependencies() {
    checkdependencies
    echo -n "Checking for executable bower..."
    checkcommand bower
    msgsuccess
}

# install project dependencies
function installdependencies() {
    # install npm modules
    echo "Installing npm dependencies..."

    echo "Updating composer"
    composer self-update

    cd ${DIR}/build/

    npm install

    # need to run composer in the workbench first
    if [ -d workbench ]
    then
        for c in `find ${DIR}/build/workbench -name composer.json`; do
            d=`dirname $c`
            if ! `echo $d | grep -q /vendor/`; then
                echo "Installing composer dependencies in $d..."
                cd $d
                composer install
            fi
        done
    fi

    cd ${DIR}/build/

    # install composer modules
    if [ -f composer.json ]
    then
        echo "Installing composer dependencies..."
        composer install
    fi

    if [ -f artisan ]
    then
        echo "Generating Laravel encryption key..."
        php artisan key:generate
    fi

    if [ -d app/storage ]
    then
        echo "Update storage folder permissions"
        chmod -R 777 app/storage
    fi

    if [ -d public/silverstripe/assets/Uploads ]
    then
        echo "Update Uploads folder permissions"
        chmod -R 777 public/silverstripe/assets
    fi

    cd ${OLDPWD}
}

function installdevdependencies() {
    echo "Installing basic javascript files..."
    cd ${DIR}/build/
    bower install
    cd ${OLDPWD}
}


# Setup building process
function build() {
    
    cd ${DIR}/build/

    # run grunt default task
    echo "Running grunt default task.."
    grunt 

    # generate documentation
    echo "Generating documentation.."
    grunt docs

    cd ${OLDPWD}
}


# commands to restore default state
function revertbuild() {
    : cleaning commands

    echo "Removing npm dependencies.."
    rm -rf ${DIR}/build/node_modules
}

case "$1" in
    "")
        checkdevdependencies
        installdevdependencies
        installdependencies
        build
    ;;
    build)
        build
    ;;
    rebuild)
        revertbuild
        build
    ;;
    check)
        checkdependencies
        installdependencies
    ;;
esac
