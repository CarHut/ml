import joblib
import requests
from sklearn.feature_extraction.text import TfidfVectorizer
import re

def make_api_call(url):
    response = requests.get(url)
    return response.json()


def load_brand_model():
    return joblib.load('brand_classification_model.pkl')


# def load_headers():
#     with open('C:\\Users\\Johny\\Desktop\\CarHut\\ml\\ml\\brands_and_models_ml\\labeling_headers\\resources\\X.txt', 'r', encoding='utf-8') as file:
#         y = file.readlines()
#
#     return y


def load_headers():
    url = f'http://localhost:8080/api/getAllTempCars'
    response_data = make_api_call(url)
    headers_list = [entity['header'] for entity in response_data]
    headers_list = [header + '\n' for header in headers_list]
    id_list = [entity['id'] for entity in response_data]
    return [headers_list, id_list]


def load_models_for_brand(brand):
    brand = brand.strip()
    url = f'http://localhost:8080/api/getModelsByBrandName?brandName={brand}'
    response_data = make_api_call(url)
    return response_data


def find_brands_for_headers(headers, ml_model):
    vectorizer = joblib.load('vectorizer.pkl')
    headers_vectorized = vectorizer.transform(headers)
    predicted_brands = ml_model.predict(headers_vectorized)
    return predicted_brands


def update_model(result_model, id):
    url = f'http://localhost:8080/api/updateModel?model=' + result_model + '&id=' + id
    make_api_call(url)


def find_models_with_first_position(result_model):
    min = 999999
    # From one cause we ignore Other
    for i in range(1, len(result_model)):
        if min > result_model[i][1]:
            min = result_model[i][1]

    result = []

    for i in range(1, len(result_model)):
        if min == result_model[i][1]:
            result.append(result_model[i][0])

    return result


def assign_models_to_brands_and_insert_to_table(brands, headers, id_list):
    for i in range(0, len(brands)):
        models = load_models_for_brand(brands[i])
        result_model = [['Other', -1]]

        for j in range(0, len(models)):
            model = models[j]['model']
            model_pattern = re.escape(model)
            pattern = rf'{model_pattern}'  # Match the brand name as a whole word

            # Search for the brand pattern case-insensitively anywhere in the description
            match = re.search(pattern, headers[i], flags=re.IGNORECASE)
            if match:
                result_model.append([model, match.start()])

        if len(result_model) == 2:
            result_model = result_model[1][0]
        elif len(result_model) == 1:
            result_model = result_model[0][0]
        else:
            final_models = []
            final_models = find_models_with_first_position(result_model)

            if len(final_models) > 1:
                length = 0
                for k in range(0, len(final_models)):
                    if length < len(final_models[k]):
                        result_model = final_models[k]
                        length = len(final_models[k])
            else:
                result_model = final_models[0]

        print(f'{i}   {brands[i].strip()}  |  {result_model}  |  {headers[i]}')
        update_model(result_model, id_list[i])

if __name__ == '__main__':
    ml_model = load_brand_model()
    [headers, id_list] = load_headers()
    brands = find_brands_for_headers(headers, ml_model)
    assign_models_to_brands_and_insert_to_table(brands, headers, id_list)

