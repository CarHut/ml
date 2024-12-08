from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import joblib
import numpy as np

# Load data
with open('C:\\Users\\Johny\\Desktop\\CarHut\\ml\\ml\\brands_and_models_ml\\find_model\\resources\\X.txt', 'r', encoding='utf-8') as file:
    X = file.readlines()
with open('C:\\Users\\Johny\\Desktop\\CarHut\\ml\\ml\\brands_and_models_ml\\find_model\\resources\\y.txt', 'r', encoding='utf-8') as file:
    y = file.readlines()
# Preprocess data
vectorizer = TfidfVectorizer()
X_vectorized = vectorizer.fit_transform(X)

# Split data into training an
# d testing sets
X_train, X_test, y_train, y_test = train_test_split(X_vectorized, y, test_size=0.2, random_state=42)
# Train a Logistic Regression model
model = LogisticRegression(max_iter=1000, verbose=1)
model.fit(X_train, y_train)
joblib.dump(model, 'model_classification_model.pkl')
joblib.dump(vectorizer, 'model_vectorizer.pkl')

# Evaluate the model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

# Make predictions
new_descriptions = ["Volkswagen Golf 1.6 TDI Comfortline", "Nieco random", "BMW X5 xDrive40i", "Predam Renault", "octavia 2",
                    "VW pickup"]
X_new = vectorizer.transform(new_descriptions)
predictions = model.predict(X_new)
print(predictions)