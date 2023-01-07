# Project - ZTB

## Requirements

- python _(tested with 3.10 and 3.11)_
- Docker Desktop

## Install and Run

Clone the repository, then...

### Linux and MacOS

```bash
pip install -r requirements.txt
python3 ./seed_init.py
cp .env.template .env
docker-compose up
```

### Windows (PowerShell)

```bash
pip install -r requirements.txt
py ./seed_init.py
cp .env.template .env
docker-compose up
```

### Windows (CMD)

```bash
pip install -r requirements.txt
py ./seed_init.py
copy .env.template .env
docker-compose up
```

## Mongo

- **username:** user _(default)_
- **password:** password _(default)_
- **port:** 27017

## Postgres

- **username:** user _(default)_
- **password:** password _(default)_
- **port:** 5432

## API

- **protocol:** http
- **host:** localhost
- **port:** 8000

## License

[MIT](https://choosealicense.com/licenses/mit/)
