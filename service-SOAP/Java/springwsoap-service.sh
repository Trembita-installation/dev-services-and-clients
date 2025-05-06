#!/bin/sh


function installService() {
	echo 'Додаю сервіс до автозапуску...'
	#modify service daemon for current user
	autostartFile="./springwsoap.service"
 	currentuser=$(stat -c "%G" .)
	sed -i "s/User=sa/User=$currentuser/g" $autostartFile
	sudo mkdir /opt/SpringWSoap
	sudo mkdir /opt/SpringWSoap/config
	sudo cp ./target/SpringWSoap-0.0.1-SNAPSHOT.jar /opt/SpringWSoap
	sudo cp -R ./config/* /opt/SpringWSoap/config
	sudo cp ./springwsoap.service /etc/systemd/system
	sudo systemctl daemon-reload
	sudo systemctl enable springwsoap.service
	sudo systemctl start springwsoap.service
	sudo systemctl status springwsoap.service
}



function removeService() {
	echo "Видаляю SpringWSoap сервіс..."
	sudo systemctl stop springwsoap.service
	sudo systemctl disable springwsoap.service
	sudo rm /etc/systemd/system/springwsoap.service
	sudo sudo systemctl daemon-reload
	
	sudo rm -R /opt/SpringWSoap
}

function startService() {
	echo "Запускаю SpringWSoap сервіс..."
	sudo systemctl start springwsoap.service
	sudo systemctl status springwsoap.service
}

function stopService() {
	echo "Зупиняю SpringWSoap сервіс..."
	sudo systemctl stop springwsoap.service
	sudo systemctl status springwsoap.service
}


if [[ $EUID -ne 0 ]]; then
    echo "Скрипт потрібно запускати з правами root (додайте sudo перед командою)"
    exit 1
fi

if [ -z $1 ]; then
	PS3='Будь-ласка, зробіть вибір: '
	select option in "Додати сервіс до автозапуску" "Запустити сервіс" "Зупинити сервіс" "Видалити сервіс" "Вихід"
	do
	    case $option in
		"Додати сервіс до автозапуску")
		    installService
		    break
		    ;;
		"Запустити сервіс")
		    startService
		    break
		    ;;
		"Припинити сервіс")
		    stopService
		    break
		    ;;
		"Видалити сервіс")
		    removeService
		    break
		    ;;
		"Вихід")
		    break
		    ;;
		*)
		    echo 'Invalid option.'
		    ;;
	    esac
	done	
	exit 1
fi


case $1 in
    'install')
        installService
        ;;
    'start')
        startService
        ;;
    'stop')
        stopService
        ;;
    'remove')
        removeService
        ;;
    *)
        echo 'Usage: bash springws-service.sh install|start|stop|remove'
        ;;
esac

