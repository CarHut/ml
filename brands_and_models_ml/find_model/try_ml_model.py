import joblib

brand_classification_model_path = "C:\\Users\\Johny\\Desktop\\CarHut\\ml\\ml\\brands_and_models_ml\\find_model\\model_classification_model.pkl"
vectorizer_path = "C:\\Users\\Johny\\Desktop\\CarHut\\ml\\ml\\brands_and_models_ml\\find_model\\model_vectorizer.pkl"
model = joblib.load(brand_classification_model_path)
vectorizer = joblib.load(vectorizer_path)

# Make predictions
new_descriptions = ["Opel Insignia 1.6 CDTI ECOTEC S S Edition"]
X_new = vectorizer.transform(new_descriptions)
predictions = model.predict(X_new)
print(predictions)