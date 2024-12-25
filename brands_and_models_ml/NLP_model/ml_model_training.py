from sklearn.model_selection import train_test_split

# read X and y data
X = []
y = []

with open('resources/X_and_y.txt', 'r', encoding='utf-8') as outfile:
    for line in outfile:
        if len(line.split(";")) == 2:
            X.append(line.split(";")[0])
            y.append(line.split(";")[1])

# Convert strings to lower case
X_temp = [row.lower() for row in X]
X = X_temp

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Convert to numerical representation
from sklearn.feature_extraction.text import CountVectorizer
vectorizer = CountVectorizer(analyzer="char", ngram_range=(1, 3))
X_train_vectorized = vectorizer.fit_transform(X_train)
X_test_vectorized = vectorizer.transform(X_test)

# Model
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Embedding, LSTM
model = Sequential([
    Embedding(input_dim=len(vectorizer.vocabulary_), output_dim=128),
    LSTM(128, return_sequences=False),
    Dense(8, activation='softmax')
])
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
model.fit(X_train_vectorized, y_train, epochs=10, batch_size=32)

# Evaluation
y_pred = model.predict(X_test_vectorized)
from sklearn.metrics import classification_report
print(classification_report(y_test, y_pred))

# My predictions
test_tokens = ['500000', 'km']
test_vectorized = vectorizer.transform(test_tokens)
predictions = model.predict(test_vectorized)

for i in range(0, len(test_tokens)):
    print(test_tokens[i] + " - " + predictions[i])