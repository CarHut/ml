import re
import psycopg2
import joblib

brand_classification_model_path = "C:\\Users\\Johny\\Desktop\\CarHut\\ml\\ml\\brands_and_models_ml\\brand_classification_model.pkl"
vectorizer_path = "C:\\Users\\Johny\\Desktop\\CarHut\\ml\\ml\\brands_and_models_ml\\vectorizer.pkl"
model = joblib.load(brand_classification_model_path)
vectorizer = joblib.load(vectorizer_path)

def connect_to_postgresql():
    connection = psycopg2.connect(
        database='postgres', user='postgres', password='janik', host='localhost', port='5432'
    )
    connection.autocommit = True
    return connection

connection = connect_to_postgresql()
cur = connection.cursor()
cur.execute("SELECT * FROM bazos_data_scraping")
bazos_data = cur.fetchall()
cur.execute("SELECT * FROM autobazar_eu")
autobazar_data = cur.fetchall()
cur.execute("SELECT * FROM model")
models = cur.fetchall()
# Add mercedes models with 'trieda' key word (ID 3 = brand mercedes)
mercedes_models = [row for row in models if row[2] == 3]
mercedes_models_with_trieda = [
    [row[0], row[1].replace(" ", " trieda "), row[2]] for row in mercedes_models
]
models.extend(mercedes_models_with_trieda)


def load_models_for_brand(brand_name):
    connection = connect_to_postgresql()
    cur = connection.cursor()
    cur.execute(f'SELECT * FROM model WHERE brand_id = (SELECT b.id FROM brand b WHERE b.brand = \'{brand_name}\' LIMIT 1)')
    result = cur.fetchall()
    return result

def find_position_of_model_in_header(model_name, header_content):
    position = header_content.lower().find(model_name.lower())
    return position


# Strategy
# When checking models, use reversed order
# When checking for a model match, check pairs of words if its needed (this means when you have model S 400, you need to check in header 2 words)
# When the model consists of only one word, check only one word in header, also the word must be enclosed to be matched to the specific model
def find_best_suited_model_in_header(found_intermidiate_models):
    if found_intermidiate_models is None or len(found_intermidiate_models) == 0:
        return None
    # Find best start position of a model in header
    best_start_position_models = []
    start_pos = 99999999
    # Firstly find best position
    for i in range(0, len(found_intermidiate_models)):
        if start_pos > found_intermidiate_models[i][1]:
            start_pos = found_intermidiate_models[i][1]

    # Find all models which the best start position
    for i in range(0, len(found_intermidiate_models)):
        if start_pos == found_intermidiate_models[i][1]:
            best_start_position_models.append(found_intermidiate_models[i])

    # Find the longest string (will match the best model)
    model_length = -1
    longest_model_name = None
    for i in range(0, len(best_start_position_models)):
        if best_start_position_models[i][2] > model_length:
            longest_model_name = best_start_position_models[i]

    return longest_model_name[0]

def match_model(header_content, pure_models):
    # Traverse models
    found_model = None
    found_intermidiate_models = []
    for i in range(len(pure_models) - 1, 0, -1):
        # if model consists of 2 words
        list_of_words_in_model = pure_models[i].split(" ")
        if len(list_of_words_in_model) == 2: # Model consists of 2 word
            # Split header to list of words that it consists
            header_words = header_content.split(" ")
            if len(header_words) < 2:
                continue

            for j in range(0, len(header_words) - 1, 1):
                header_words_tuple = header_words[j] + " " + header_words[j + 1]
                model_pattern = re.escape(pure_models[i])
                pattern = rf'\b{model_pattern}\b'
                match = re.search(pattern, header_words_tuple, flags=re.IGNORECASE)
                if match:
                    found_intermidiate_models.append((pure_models[i], find_position_of_model_in_header(pure_models[i], header_content), len(pure_models[i])))
                    break
        elif len(list_of_words_in_model) == 1: # Model consists of 1 word
            model_pattern = re.escape(pure_models[i])
            pattern = rf'\b{model_pattern}'  # Match the brand name as a whole word
            match = re.search(pattern, header_content, flags=re.IGNORECASE)
            if match:
                found_intermidiate_models.append((pure_models[i], find_position_of_model_in_header(pure_models[i], header_content), len(pure_models[i])))
            # Some header might not include model specific characters for example dash '-'
            model_without_dash = pure_models[i].replace("-", "")
            model_pattern = re.escape(model_without_dash)
            pattern = rf'\b{model_pattern}'
            match = re.search(pattern, header_content, flags=re.IGNORECASE)
            if match:
                found_intermidiate_models.append((pure_models[i], find_position_of_model_in_header(model_without_dash, header_content), len(pure_models[i])))

    found_model = find_best_suited_model_in_header(found_intermidiate_models)
    return found_model

def find_brand_for_model(matched_model):
    for modelx in models:
        if modelx[1] == matched_model:
            cur.execute(f'SELECT * FROM brand WHERE id = {modelx[2]} LIMIT 1')
            found_brand = cur.fetchone()
            return found_brand[1]
    return "Brand was not found"

def predict_brand_and_model(header_content):
    vectorized_header = vectorizer.transform([header_content])
    brand_prediction = model.predict(vectorized_header)
    brand_prediction_fixed = brand_prediction[0].replace("\n", "")
    if brand_prediction_fixed == 'Other':
        brand_models = models
        pure_models = [row[1] for row in brand_models]
        matched_model = match_model(header_content, pure_models)
        brand_of_a_model = find_brand_for_model(matched_model)
        return (brand_of_a_model, matched_model)
    else:
        brand_models = load_models_for_brand(brand_prediction_fixed)
        pure_models = [row[1] for row in brand_models]
        matched_model = match_model(header_content, pure_models)
        return (brand_prediction_fixed, matched_model)


def check_all_headers():
    headers = [row[1] for row in bazos_data] + [row[1] for row in autobazar_data]
    # headers = ['Audi A5 Sportback 2.0 TDI 150 kW Quattro Matrix Webasto']
    treated_headers = [s.replace("\n", "").replace("\r", "") for s in headers]
    labels = []
    for i in range(0, len(treated_headers)):
        car = predict_brand_and_model(treated_headers[i])
        if car is None:
            print(f'[{i}] - {treated_headers[i]} + " ->>>  None')
            labels.append('None')
        else:
            # Brand present model not
            if car[0] is not None and car[1] is None:
                print(f'[{i}] - {treated_headers[i]} + " ->>> " + {car[0]}')
                labels.append(car[0] + ' ' + 'None')
            else:
                print(f'[{i}] - {treated_headers[i]} + " ->>> " + {car[0] + ' ' + car[1]}')
                labels.append(car[0] + ' ' + car[1])
        print("----------------------\n")
    return (headers, labels)

def save_to_file(data, filename):
    with open(filename, 'w', encoding='utf-8') as file:
        for item in data:
            file.write(f"{str(item)}\n")

if __name__ == '__main__':
    cars = check_all_headers()
    save_to_file(cars[0], 'C:\\Users\\Johny\\Desktop\\CarHut\\ml\\ml\\brands_and_models_ml\\find_model\\resources\\X.txt') #headers
    save_to_file(cars[1], 'C:\\Users\\Johny\\Desktop\\CarHut\\ml\\ml\\brands_and_models_ml\\find_model\\resources\\y.txt') #labels

