import functools
import shutil
import pandas as pd
import requests
from zipfile import ZipFile
from tqdm.auto import tqdm
from strenum import StrEnum
from typing import List, Dict, Set
from pathlib import Path


BASE_PATH = './db/seed/'
FDC_DATASETS_URL = 'https://fdc.nal.usda.gov/fdc-datasets/'
FDC_BRANDED_FOOD_FILE_NAME = 'FoodData_Central_branded_food_csv_2022-10-28.zip'
FDC_SUPPORTING_DATA_FILE_NAME = 'FoodData_Central_Supporting_Data_csv_2022-10-28.zip'


class Colors(StrEnum):
    """Console text colors."""
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


def print_info(xd: str, text: str, color: Colors):
    print(f'{color}{xd}{Colors.ENDC}', text)


# def all_files_already_exist(files: List[str]) -> bool:
#     all_exist = True

#     for file in files:
#         file_path = f'{BASE_PATH}{file}'
#         q = Path(file_path)

#         if not q.exists():
#             all_exist = False
    
#     return all_exist


def download_fdc_files(files: List[str]):
    for file in files:
        print_info('file:', file, Colors.BOLD)
        url = f'{FDC_DATASETS_URL}{file}'
        print_info('url:', url, Colors.BOLD)
        r = requests.get(url, stream=True)

        if r.status_code != 200:
            r.raise_for_status()
            raise RuntimeError(f"Request to {url} returned status code {r.status_code}")

        file_size = int(r.headers.get('Content-Length'))
        r.raw.read = functools.partial(r.raw.read, decode_content=True)

        with tqdm.wrapattr(r.raw, 'read', total=file_size, desc='') as raw:
            file_path = f'{BASE_PATH}{file}'
            with open(file_path, 'wb') as f:
                shutil.copyfileobj(raw, f)


def unzip_files(files: List[str]):
    for file in files:
        print_info('file:', file, Colors.BOLD)
        file_path = f'{BASE_PATH}{file}'
        with ZipFile(file_path, 'r') as zipobj:
            zipobj.extractall(path=BASE_PATH)


def prepare_data(data: Dict[str, Set[str]]):
    for file, columns in data.items():
        file_path = f'{BASE_PATH}{file}'
        print_info('file:', file, Colors.BOLD)
        df = pd.read_csv(file_path, dtype='unicode')
        csv_columns = set(df.columns)

        for column in csv_columns.difference(columns):
            print_info('removed column:', column, Colors.BOLD)
            df.drop(column, inplace=True, axis=1)
        
        df.to_csv(file_path, index=False)


def remove_files(files: List[str]):
    for file in files:
        print_info('file:', file, Colors.BOLD)
        file_path = f'{BASE_PATH}{file}'
        file_to_rem = Path(file_path)
        file_to_rem.unlink()


def main():
    fdc_files = [
        FDC_BRANDED_FOOD_FILE_NAME,
        FDC_SUPPORTING_DATA_FILE_NAME
    ]
    data = {
        'food.csv': {
            'fdc_id',
            'data_type',
            'description',
            'publication_date'
        },
        'branded_food.csv': {
            'fdc_id',
            'brand_owner',
            'gtin_upc',
            'ingredients',
            'serving_size',
            'serving_size_unit',
            'branded_food_category',
            'data_source',
            'modified_date',
            'available_date',
            'market_country',
            'trade_channel'
        },
        # 'food_attribute_type.csv': {
        #     'id',
        #     'name',
        #     'description'
        # },
        # 'food_attribute.csv': {
        #     'id',
        #     'fdc_id',
        #     'food_attribute_type_id',
        #     'name',
        #     'value'
        # },
        'nutrient.csv': {
            'id',
            'name',
            'unit_name',
            'nutrient_nbr',
            'rank'
        },
        'food_nutrient_source.csv': {
            'id',
            'code',
            'description'
        },
        'food_nutrient_derivation.csv': {
            'id',
            'code',
            'description',
            'source_id'
        },
        'food_nutrient.csv': {
            'id',
            'fdc_id',
            'nutrient_id',
            'amount',
            'derivation_id'
        }
    }
    files_to_remove = [
        FDC_BRANDED_FOOD_FILE_NAME,
        FDC_SUPPORTING_DATA_FILE_NAME,
        'all_downloaded_table_record_counts.csv',
        'Download & API Field Descriptions October 2022.pdf',
        'fndds_derivation.csv',
        'fndds_ingredient_nutrient_value.csv',
        'food_category.csv',
        'food_update_log_entry.csv',
        'lab_method_code.csv',
        'lab_method_nutrient.csv',
        'lab_method.csv',
        'measure_unit.csv',
        'microbe.csv',
        'nutrient_incoming_name.csv',
        'retention_factor.csv',
        'wweia_food_category.csv',
        # attributes
        'food_attribute.csv',
        'food_attribute_type.csv'
    ]
    files = [file for file in data]

    try:
        # if all_files_already_exist(files):
        #     print_info('info:', 'files already downloaded', Colors.OKGREEN)
        #     return

        print_info('[start]', 'download files', Colors.OKBLUE)
        download_fdc_files(fdc_files)
        print_info('[done]', 'download files', Colors.OKBLUE)

        print_info('[start]', 'unzip', Colors.OKBLUE)
        unzip_files(fdc_files)
        print_info('[done]', 'unzip', Colors.OKBLUE)

        print_info('[start]', 'prepare data', Colors.OKBLUE)
        prepare_data(data)
        print_info('[done]', 'prepare data', Colors.OKBLUE)

        print_info('[start]', 'cleanup', Colors.OKBLUE)
        remove_files(files_to_remove)
        print_info('[done]', 'cleanup', Colors.OKBLUE)
    except KeyboardInterrupt:
        print_info('error:', 'interrupted', Colors.FAIL)
    except Exception as e:
        print_info('error:', str(e), Colors.FAIL)
    else:
        print_info('info:', 'seed data is ready', Colors.OKGREEN)


if __name__ == "__main__":
    main()
