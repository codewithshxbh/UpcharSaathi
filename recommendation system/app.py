import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

doctor_df=pd.read_csv("docinfo.csv")
specialization_df=pd.read_csv("dataset.csv")

@app.route('/doctorFinder',methods=['POST'])
def recommend_doc():
    data=request.json
    disease=data.get('disease')
    city=data.get('city')

    # Handle case where disease or city is not provided
    if not disease or not city:
        return jsonify({"error": "Disease and city are required parameters"}), 400

    specRow=specialization_df[specialization_df['Disease'].str.strip().str.lower()==disease.strip().lower()] #getting the row of disease in csv, fir spec nikalna hai
    
    if specRow.empty:
        return jsonify({"error": "No specialization found for disease"}), 404
    else:
        specialization=specRow.iloc[0]['Specialization'] #got specialization

        filtered=doctor_df[(doctor_df['city'].str.strip().str.lower()==city.strip().lower()) & (doctor_df['specialization'].str.strip().str.lower()==specialization.strip().lower())]
        
        if filtered.empty:
            return jsonify({"error": f"No doctor found in {city} for {specialization} specialization"}), 404

        filtered['score']=filtered['rating']*0.7 + filtered['experience']*0.3

        recommended=filtered.sort_values(by=['specialization','score'],ascending=[True,False])
        
        # Return all recommended doctors, not just the first 5
        return jsonify(recommended.to_dict(orient="records"))

# Add a simple GET endpoint for doctors that returns all doctors or filters by city
@app.route('/doctors', methods=['GET'])
def get_all_doctors():
    city = request.args.get('city')
    limit = request.args.get('limit')
    
    # Convert limit to integer if provided, otherwise use None (no limit)
    if limit:
        try:
            limit = int(limit)
        except ValueError:
            limit = None
    
    if city:
        filtered = doctor_df[doctor_df['city'].str.strip().str.lower() == city.strip().lower()]
        if filtered.empty:
            return jsonify({"error": f"No doctors found in {city}"}), 404
        
        if limit:
            return jsonify(filtered.head(limit).to_dict(orient="records"))
        else:
            return jsonify(filtered.to_dict(orient="records"))
    else:
        # Return all doctors if no city specified, or use limit if provided
        if limit:
            return jsonify(doctor_df.head(limit).to_dict(orient="records"))
        else:
            return jsonify(doctor_df.to_dict(orient="records"))

# Add an endpoint to get available specializations
@app.route('/specializations', methods=['GET'])
def get_specializations():
    specializations = doctor_df['specialization'].unique().tolist()
    return jsonify({"specializations": specializations})

# Add an endpoint to get available cities
@app.route('/cities', methods=['GET'])
def get_cities():
    cities = doctor_df['city'].unique().tolist()
    return jsonify({"cities": cities})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

