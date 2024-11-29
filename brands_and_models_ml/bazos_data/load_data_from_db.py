import psycopg2

def connect_to_postgresql():
    connection = psycopg2.connect(
        database='postgres', user='postgres', password='janik', host='localhost', port='5432'
    )
    connection.autocommit = True
    return connection

def load_bazos_offers():
    connection = connect_to_postgresql()
    cur = connection.cursor()
    cur.execute("SELECT * FROM bazos_data_scraping;")
    result = cur.fetchall()
    connection.close()
    return result