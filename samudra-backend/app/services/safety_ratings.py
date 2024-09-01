import pickle 
def covert_to_mps(kmph):
    return kmph * 1000 / 3600

def get_safety_rating(swell_height, current_velocity):
    covert_to_mps(current_velocity)
    pkl_path = 'samudra-backend\app\ml_models\safety_index_model.pkl'
    with open(pkl_path, 'rb') as file:
        model = pickle.load(file)
    prediction = model.predict([[swell_height, current_velocity]])
    return prediction[0] # 0= Green, 1 = Orange , 2 = Red, 3 = Yellow
