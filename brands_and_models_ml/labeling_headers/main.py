import re
import psycopg2

volkswagen_variations = ["vw", "wagen", "volks"]
mercedes_variations = ["mercedes", "merc", "mercedes benz", "benz"]
skoda_variations = ["skoda", "skodovka", "škodovka"]
alfa_romeo_variations = ["alfa", "romeo"]
citroen_variations = ["citroen", "citron"]
ferrari_variations = ["ferari"]
rolls_royce_variations = ["rolls royce"]

def connect_to_postgresql():
    connection = psycopg2.connect(
        database='postgres', user='postgres', password='janik', host='localhost', port='5432'
    )

    connection.autocommit = True

    return connection


def fetch_all_brands(conn):
    cursor = conn.cursor()
    cursor.execute('''SELECT * FROM brand''')
    brands = cursor.fetchall()
    brands = [row[1] for row in brands]
    return (brands + volkswagen_variations + mercedes_variations + skoda_variations + alfa_romeo_variations +
            citroen_variations + ferrari_variations + rolls_royce_variations)


def fix_brand_variations(result_brands):
    fixed_result_brands = []
    for i in range(0, len(result_brands)):
        if result_brands[i] in volkswagen_variations:
            fixed_result_brands.append("Volkswagen")
        elif result_brands[i] in mercedes_variations:
            fixed_result_brands.append("Mercedes-Benz")
        elif result_brands[i] in skoda_variations:
            fixed_result_brands.append("Škoda")
        elif result_brands[i] in alfa_romeo_variations:
            fixed_result_brands.append("Alfa Romeo")
        elif result_brands[i] in citroen_variations:
            fixed_result_brands.append("Citroën")
        elif result_brands[i] in ferrari_variations:
            fixed_result_brands.append("Ferrari")
        elif result_brands[i] in rolls_royce_variations:
            fixed_result_brands.append("Rolls-Royce")
        else:
            fixed_result_brands.append(result_brands[i])

    return fixed_result_brands

def fetch_all_car_headers(conn):
    cursor = conn.cursor()
    cursor.execute('''SELECT * FROM autobazar_eu''')
    autobazar_eu_cars = cursor.fetchall()
    cursor.execute('''SELECT * FROM bazos_data_scraping''')
    bazos_cars = cursor.fetchall()

    # Extract brand names using regex
    brand_names = fetch_all_brands(conn)

    result_brands = []
    result_headers = []

    headers = [row[1] for row in bazos_cars] + [row[1] for row in autobazar_eu_cars]
    # Remove new line spaces
    headers_without_ws = [s.replace("\n", "").replace("\r", "") for s in headers]

    for header in headers_without_ws:
        # print('Current car: ', header)
        was_added = False
        for brand in brand_names:
            brand_pattern = re.escape(brand)
            pattern = rf'\b{brand_pattern}\b'  # Match the brand name as a whole word

            # Search for the brand pattern case-insensitively anywhere in the description
            match = re.search(pattern, header, flags=re.IGNORECASE)
            if match:
                result_brands.append(brand)
                result_headers.append(header)
                was_added = True
                break
        if was_added is False:
            result_brands.append("Other")
            result_headers.append(header)
    cursor.close()

    fixed_brands = fix_brand_variations(result_brands)

    return (result_headers, fixed_brands)

def save_to_file(data, filename):
    with open(filename, 'w', encoding='utf-8') as file:
        for item in data:
            file.write(f"{str(item)}\n")


if __name__ == '__main__':
    conn = connect_to_postgresql()

    # Fetch all car headers
    labels = fetch_all_car_headers(conn)

    # Close the database connection
    conn.close()

    # Save extracted brand names to file
    save_to_file(labels[1], 'C:\\Users\\Johny\\Desktop\\CarHut\\ml\\ml\\brands_and_models_ml\\labeling_headers\\resources\\y.txt')
    save_to_file(labels[0], 'C:\\Users\\Johny\\Desktop\\CarHut\\ml\\ml\\brands_and_models_ml\\labeling_headers\\resources\\X.txt')