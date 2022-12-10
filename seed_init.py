import requests
from zipfile import ZipFile
import shutil
from tqdm.auto import tqdm
import functools
import pandas as pd
import json

BASE_PATH = './seed'
POSTGRES_BASE_PATH = f'{BASE_PATH}/postgres/'
MONGO_BASE_PATH = f'{BASE_PATH}/mongo/'
FILE_NAMES = (
    'FoodData_Central_branded_food_json_2022-10-28.zip',
    'FoodData_Central_branded_food_csv_2022-10-28.zip',
    'FoodData_Central_Supporting_Data_csv_2022-10-28.zip'
)
PATHS = (MONGO_BASE_PATH, POSTGRES_BASE_PATH, POSTGRES_BASE_PATH)
CSV_FILES = [
    POSTGRES_BASE_PATH + 'food.csv'
    # POSTGRES_BASE_PATH + 'branded_food.csv'
]
TABLE_NAMES = [
    {'fdc_id', 'data_type', 'description', 'publication_date'}
    # {'fdc_id', 'brand_owner', 'gtin_upc', 'ingredients', 'serving_size', 'serving_size_unit', 'branded_food_category', 'data_source', 'modified_date', 'available_date', 'market_country', 'trade_channel'}
]

def download_files(file_names, output_paths):
    base_url = 'https://fdc.nal.usda.gov/fdc-datasets/'
    for file, path in zip(file_names, output_paths):
        print(file)

        url = base_url + file
        r = requests.get(url, stream=True)

        if r.status_code != 200:
            r.raise_for_status()
            raise RuntimeError(f"Request to {url} returned status code {r.status_code}")
        
        file_size = int(r.headers.get('Content-Length'))
        r.raw.read = functools.partial(r.raw.read, decode_content=True)

        with tqdm.wrapattr(r.raw, 'read', total=file_size, desc='') as raw:
            with open(path + file, 'wb') as f:
                shutil.copyfileobj(raw, f)

def unzip_files(file_names, paths):
    for file, path in zip(file_names, paths):
        print(file)
        with ZipFile(path + file, 'r') as zipobj:
            zipobj.extractall(path=path)

def prepare_json_files(file_path):
    data = {}
    print('reading data from file...')
    with open(file_path, 'r', encoding='utf8') as file_read:
        data = json.load(file_read)
    print('saving updated data to file')
    with open(file_path, 'w', encoding='utf8') as file_write:
        file_write.write(json.dumps(data['BrandedFoods']))

def prepare_csv_files(file_paths, table_names):
    for file_path, tables in zip(file_paths, table_names):
        print(file_path)
        df = pd.read_csv(file_path)
        column_names = set(df.columns)
        for column in column_names.difference(tables):
            df.drop(column, inplace=True, axis=1)
        df.to_csv(file_path, index=False)

print('[start] downloading data...')
download_files(FILE_NAMES, PATHS)
print('[done] downloading data')

print('[start] unzipping...')
unzip_files(FILE_NAMES, PATHS)
print('[done] unzipping')

print('[start]: prepare json files...')
json_file_path = MONGO_BASE_PATH + 'FoodData_Central_branded_food_json_2022-10-28.json'
prepare_json_files(json_file_path)
print('[done]: prepare json files')

print('[start]: prepare csv files...')
prepare_csv_files(CSV_FILES, TABLE_NAMES)
print('[done]: prepare csv files')
