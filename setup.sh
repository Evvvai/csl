#!/bin/sh

#* Ubuntu / Debian
#  Docker 
sudo apt-get update
sudo apt-get upgrade
sudo apt install docker.io
systemctl start docker
systemctl enable docker

#  Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose


#* Arch
sudo pacman -Syu docker          	# Install Docker
sudo pacman -Syu docker-compose  	# Install docker-compose

sudo systemctl enable docker     	# Start Docker on system startup (optional)
sudo systemctl start docker      	# Start Docker now

sudo usermod -a -G docker $(whoami) # Give permission