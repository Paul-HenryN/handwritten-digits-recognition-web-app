import pickle

file = open("./src/model.pkl", "rb")
model = pickle.load(file)
file.close()


def predict(X):
    return model.predict(X)
