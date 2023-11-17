import pickle

file = open("./src/model.pkl", "rb")
model = pickle.load(file)
file.close()
