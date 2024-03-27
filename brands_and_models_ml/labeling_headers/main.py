import re
import psycopg2
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

    return brands


def fetch_all_car_headers(conn):
    cursor = conn.cursor()
    cursor.execute('''SELECT * FROM autobazar_eu''')
    cars = cursor.fetchall()

    # Extract brand names using regex
    brand_names = fetch_all_brands(conn)
    result_brands = []
    result_headers = []

    for car in cars:
        description = car[1]
        print('Current car: ', description)
        for brand in brand_names:
            brand_pattern = re.escape(brand[1])
            pattern = rf'\b{brand_pattern}\b'  # Match the brand name as a whole word

            # Search for the brand pattern case-insensitively anywhere in the description
            match = re.search(pattern, description, flags=re.IGNORECASE)
            if match:
                result_brands.append(match.group())
                result_headers.append(description)
                break

    return (result_headers, result_brands)

def save_to_file(data, filename):
    with open(filename, 'w', encoding='utf-8') as file:
        for item in data:
            file.write("%s\n" % item)


if __name__ == '__main__':
    conn = connect_to_postgresql()

    # Fetch all car headers
    labels = fetch_all_car_headers(conn)

    # Close the database connection
    conn.close()
    print(labels[0])

    # Save extracted brand names to file
    save_to_file(labels[1], 'C:\\Users\\Johny\\Desktop\\CarHut\\ml\\ml\\brands_and_models_ml\\labeling_headers\\resources\\y.txt')
    save_to_file(labels[0], 'C:\\Users\\Johny\\Desktop\\CarHut\\ml\\ml\\brands_and_models_ml\\labeling_headers\\resources\\X.txt')