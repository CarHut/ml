import joblib
import load_data_from_db as loader

bazos_offers = loader.load_bazos_offers()
bazos_headers = [row[1] for row in bazos_offers]

brand_classification_model_path = "..\\brand_classification_model.pkl"
vectorizer_path = "..\\vectorizer.pkl"

model = joblib.load(brand_classification_model_path)
vectorizer = joblib.load(vectorizer_path)

for i in range(0, len(bazos_headers)):
    X_new = vectorizer.transform([bazos_headers[i]])
    predictions = model.predict(X_new)
    print(f'{bazos_headers[i]}  ->>>>>  {predictions}\n')
