FROM        debian
ARG         ACCEPT_EULA=Y
ARG         DEBIAN_FRONTEND=noninteractive
# RUN         mkdir -p /home/node/app
# WORKDIR     /home/node/app
RUN         apt-get update -qq -y && \
            apt-get -y install apache2 && \
            apt-get -y install libapache2-mod-php
RUN         apt-get update -qq -y && \
            apt-get -y install nodejs npm

RUN         echo "ServerName localhost:80" >> /etc/apache2/apache2.conf   
COPY        cps-admin/build/ /var/www/html
COPY        cps-admin/ /var/www/html
RUN         chmod -R a+x /var/www/html/node_modules
RUN         cd /var/www/html && npm run start&
RUN         apt-get update -qq && \
            apt-get install -qq -y nano
RUN         apt-get update -qq && \
            apt-get install -qq -y net-tools && \
            apt-get install -qq -y curl        
EXPOSE      80
EXPOSE      8060
CMD        apachectl -D FOREGROUND   
#CMD         [ "npm", "start"]


