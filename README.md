# Project - ZTB

## Requirements
- python *(tested with 3.10)*
- Docker Desktop

## Install and Run

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

##  Mongo
- **username:** user *(default)*\
- **password:** password *(default)*\
- **port:** 27017

##  Postgres
- **username:** user *(default)*\
- **password:** password *(default)*\
- **port:** 5432

## License
[MIT](https://choosealicense.com/licenses/mit/)
