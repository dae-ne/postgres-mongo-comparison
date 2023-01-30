# PostgreSQL vs MongoDB - comparison app

## Requirements

- python _(tested with 3.10 and 3.11)_
- Docker, Docker Compose

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

## Test in Postman

1. Create a new Postman workspace.
2. Import the `Stats` collection from `./postman/Stats.postman_collection.json`
3. Create an environment:

| VARIABLE | TYPE    | INITIAL VALUE         |
|----------|---------|-----------------------|
| base_url | default | http://localhost:8000 |

4. Select the new environment (top right corner).
5. Open any endpoint and click `Send`.
6. When the request is done click `Visualize`.

## License

[MIT](https://choosealicense.com/licenses/mit/)
