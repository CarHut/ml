import joblib
import requests
from sklearn.feature_extraction.text import TfidfVectorizer

def load_brand_model():
    return joblib.load('..\\brand_classification_model.pkl')

def make_api_call(url):
    response = requests.get(url)
    return response.json()

def load_headers():
    url = f'http://localhost:8080/api/getAllTempCars'
    response_data = make_api_call(url)
    headers_list = [entity['header'] for entity in response_data]
    id_list = [entity['id'] for entity in response_data]
    return [headers_list, id_list]


[headers, id_list] = load_headers()

class_model = load_brand_model()

vectorizer = joblib.load('..\\vectorizer.pkl')
# Vectorize the test data
headers_vectorized = vectorizer.transform(headers)
predicted_brands = class_model.predict(headers_vectorized)
predicted_brands = [brand.strip() for brand in predicted_brands]


def update_brands(id_list, predicted_brands):
    for i in range(0, len(id_list)):
        print(predicted_brands[i])
        make_api_call('http://localhost:8080/api/updateBrand?brand=' + predicted_brands[i] + '&id=' + id_list[i])


update_brands(id_list, predicted_brands)

