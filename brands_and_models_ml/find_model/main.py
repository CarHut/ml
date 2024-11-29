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

def load_models_for_brand(brand_name):
    connection = connect_to_postgresql()
    cur = connection.cursor()
    cur.execute(f'SELECT * FROM model WHERE brand_id = (SELECT b.id FROM brand b WHERE b.brand = \'{brand_name}\' LIMIT 1)')
    result = cur.fetchall()
    return result

def find_position_of_model_in_header(model_name, header_content):
    position = header_content.find(model_name)
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

def match_model(header_content, models):
    # Traverse models
    found_model = None
    found_intermidiate_models = []
    for i in range(len(models) - 1, 0, -1):
        # if model consists of 2 words
        list_of_words_in_model = models[i].split(" ")
        if len(list_of_words_in_model) == 2: # Model consists of 2 word
            # Split header to list of words that it consists
            header_words = header_content.split(" ")
            if len(header_words) < 2:
                continue

            for j in range(0, len(header_words) - 1, 1):
                header_words_tuple = header_words[j] + " " + header_words[j + 1]
                model_pattern = re.escape(models[i])
                pattern = rf'\b{model_pattern}\b'
                match = re.search(pattern, header_words_tuple, flags=re.IGNORECASE)
                if match:
                    found_intermidiate_models.append((models[i], find_position_of_model_in_header(models[i], header_content), len(models[i])))
                    break
        elif len(list_of_words_in_model) == 1: # Model consists of 1 word
            model_pattern = re.escape(models[i])
            pattern = rf'\b{model_pattern}'  # Match the brand name as a whole word
            match = re.search(pattern, header_content, flags=re.IGNORECASE)
            if match:
                found_intermidiate_models.append((models[i], find_position_of_model_in_header(models[i], header_content), len(models[i])))

    found_model = find_best_suited_model_in_header(found_intermidiate_models)
    return found_model


def predict_brand_and_model(header_content):
    vectorized_header = vectorizer.transform([header_content])
    brand_prediction = model.predict(vectorized_header)
    brand_prediction_fixed = brand_prediction[0].replace("\n", "")
    brand_models = load_models_for_brand(brand_prediction_fixed)
    pure_models = [row[1] for row in brand_models]
    matched_model = match_model(header_content, pure_models)
    return (brand_prediction[0], matched_model)


def check_all_headers():
    headers = [row[1] for row in bazos_data] + [row[1] for row in autobazar_data]
    treated_headers = [s.replace("\n", "") for s in headers]
    for i in range(0, len(treated_headers)):
        car = predict_brand_and_model(treated_headers[i])
        print(f'[{i}] - {treated_headers[i]} + " ->>> " + {car}')
        print("----------------------\n")

if __name__ == '__main__':
    check_all_headers()
