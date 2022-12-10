FROM postgres:latest

ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD postgres

RUN mkdir /seed
COPY *.csv /seed
COPY *.sql /docker-entrypoint-initdb.d/

RUN chmod 777 /docker-entrypoint-initdb.d/*.sql
RUN chmod 777 /seed/*

EXPOSE 5432
