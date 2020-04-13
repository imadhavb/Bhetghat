  
#!/bin/bash

CMD=$1
shift

case $CMD in

    dev)
        echo "Application is running in development mode"
        echo "Installing node_modules in host machine for code intellisense in dev environment"
        npm install
        docker-compose up -d --build dev
        docker-compose logs -f
        ;;
    prod)
        docker-compose up -d --build prod
        ;;

    stop)
        docker-compose down
        ;;

    *)
        echo usage: "dev|prod|stop"
        exit 1
        ;;
esac