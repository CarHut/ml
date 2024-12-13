from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import joblib
import numpy as np

# Load data
with open('C:\\Users\\Johny\\Desktop\\CarHut\\ml\\ml\\brands_and_models_ml\\find_model\\resources\\bazos_assigned_headers.txt', 'r', encoding='utf-8') as file:
    X_bazos = file.readlines()
with open('C:\\Users\\Johny\\Desktop\\CarHut\\ml\\ml\\brands_and_models_ml\\find_model\\resources\\bazos_assigned_labels.txt', 'r', encoding='utf-8') as file:
    y_bazos = file.readlines()
with open('C:\\Users\\Johny\\Desktop\\CarHut\\ml\\ml\\brands_and_models_ml\\find_model\\resources\\autobazar_eu_assigned_headers.txt', 'r', encoding='utf-8') as file:
    X_autobazar = file.readlines()
with open('C:\\Users\\Johny\\Desktop\\CarHut\\ml\\ml\\brands_and_models_ml\\find_model\\resources\\autobazar_eu_assigned_labels.txt', 'r', encoding='utf-8') as file:
    y_autobazar = file.readlines()

# Prepare headers
bazos_headers_without_id = [row.split(";")[1] for row in X_bazos]
autobazar_headers_without_id = [row.split(";")[1] for row in X_autobazar]
bazos_headers_without_nl = [row.replace("\n", "").replace("\r", "") for row in bazos_headers_without_id]
autobazar_headers_without_nl = [row.replace("\n", "").replace("\r", "") for row in autobazar_headers_without_id]
bazos_headers_to_lower_case = [row.lower() for row in bazos_headers_without_nl]
autobazar_headers_to_lower_case = [row.lower() for row in autobazar_headers_without_nl]
X = np.concatenate((bazos_headers_to_lower_case, autobazar_headers_to_lower_case))
y = np.concatenate((y_bazos, y_autobazar))

# Preprocess data
vectorizer = TfidfVectorizer()
X_vectorized = vectorizer.fit_transform(X)

# Split data into training an
# d testing sets
X_train, X_test, y_train, y_test = train_test_split(X_vectorized, y, test_size=0.2, random_state=42)
# Train a Logistic Regression model
model = LogisticRegression(max_iter=10000, verbose=1)
model.fit(X_train, y_train)
joblib.dump(model, 'model_classification_model_with_processed_data.pkl')
joblib.dump(vectorizer, 'model_vectorizer_with_processed_data.pkl')

# Evaluate the model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

# Make predictions
new_descriptions = ["Volkswagen Golf 1.6 TDI Comfortline", "Nieco random", "BMW X5 xDrive40i", "Predam Renault", "octavia 2",
                    "VW xxxx"]
X_new = vectorizer.transform(new_descriptions)
predictions = model.predict(X_new)
print(predictions)