import tkinter as tk
from xml.etree.ElementTree import tostring

import psycopg2
import joblib

brand_classification_model_path = "C:\\Users\\Johny\\Desktop\\CarHut\\ml\\ml\\brands_and_models_ml\\find_model\\model_classification_model.pkl"
vectorizer_path = "C:\\Users\\Johny\\Desktop\\CarHut\\ml\\ml\\brands_and_models_ml\\find_model\\model_vectorizer.pkl"
model = joblib.load(brand_classification_model_path)
vectorizer = joblib.load(vectorizer_path)

window = tk.Tk()
window.geometry("1920x1080")
window.resizable(0, 0)

current_header_count = 0
first_header = True
headers = []
header_ids = []
header_label = tk.Label(window, text=f'[{current_header_count}]: {''}', font=('Arial', 25))
brand_and_model_box = tk.Text(window, height=5, width=40)

def sort_headers_by_ids_asc():
    header_ids.sort()
    conn = connect_to_postgresql()
    cur = conn.cursor()
    for _id in header_ids:
        cur.execute(f'SELECT * FROM bazos_data_scraping WHERE id = {_id} LIMIT 1')
        headers.append(cur.fetchone()[1])

def connect_to_postgresql():
    connection = psycopg2.connect(
        database='postgres', user='postgres', password='janik', host='localhost', port='5432'
    )
    connection.autocommit = True
    return connection

def update_header():
    global current_header_count
    global header_label

    add_labels(brand_and_model=brand_and_model_box.get("1.0", "end"))
    current_header_count += 1
    predict_brand_and_model(headers[current_header_count])
    header_label.configure(text=f'[{header_ids[current_header_count]}]: {headers[current_header_count]}')

def add_labels(brand_and_model):
    brand_and_model = brand_and_model.replace("\n", "").replace("\r", "")
    with open('C:\\Users\\Johny\\Desktop\\CarHut\\ml\\ml\\brands_and_models_ml\\find_model\\resources\\bazos_assigned_headers.txt', 'a', encoding="utf-8") as the_file:
        the_file.write(f'{header_ids[current_header_count]};{headers[current_header_count]}\n')

    with open('C:\\Users\\Johny\\Desktop\\CarHut\\ml\\ml\\brands_and_models_ml\\find_model\\resources\\bazos_assigned_labels.txt', 'a', encoding="utf-8") as the_file:
        the_file.write(f'{brand_and_model}\n')

    print(f'{headers[current_header_count]}: {brand_and_model}')

def set_headers():
    global headers
    global header_ids
    cursor = connect_to_postgresql().cursor()
    cursor.execute('SELECT * FROM bazos_data_scraping')
    header_ids = [row[0] for row in cursor.fetchall()]
    sort_headers_by_ids_asc()

def predict_brand_and_model(header):
    global next_prediction
    X_new = vectorizer.transform([header])
    predictions = model.predict(X_new)
    brand_and_model_box.delete("1.0", "end")
    brand_and_model_box.insert("1.0", predictions[0])

def init():
    global current_header_count
    global headers
    global header_ids
    try:
        with open('C:\\Users\\Johny\\Desktop\\CarHut\\ml\\ml\\brands_and_models_ml\\find_model\\resources\\bazos_assigned_headers.txt', 'r', encoding="utf-8") as f:
            last_line = f.readlines()[-1]
        file_last_id = last_line.split(";")[0]
        index_of_id = header_ids.index(int(file_last_id))
        headers = headers[index_of_id+1:]
        header_ids = header_ids[index_of_id+1:]
    except Exception as e:
        print('Error occurred while trying to get last element')
    header_label.configure(text=f'[{header_ids[0]}]: {headers[0]}')
    predict_brand_and_model(headers[0])

if __name__ == "__main__":
    set_headers()
    init()
    next_button = tk.Button(window, text='Update header', command=update_header)
    # PACKING
    header_label.pack()
    next_button.pack()
    brand_and_model_box.pack()
    window.mainloop()


