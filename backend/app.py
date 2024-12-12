from flask import Flask, request, jsonify
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from models import Base, Users, WorkoutGroupMembers, WorkoutGroups, WorkoutLocations
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

engine = create_engine('sqlite:///workout.db')
Base.metadata.create_all(engine)  
Session = sessionmaker(bind=engine)

@app.route('/users', methods=['POST'])
def create_user():
    session = Session()
    data = request.json
    new_user = Users(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        purdue_id=data['purdue_id']
    )
    session.add(new_user)
    session.commit()

    user_id = new_user.user_id
    session.close()
    
    return jsonify({'message': 'User created', 'user_id': user_id}), 201

@app.route('/users', methods=['GET'])
def get_users():
    session = Session()

    query = text("""
        SELECT user_id, first_name, last_name, email, purdue_id
        FROM users
    """)

    result = session.execute(query).fetchall()

    session.close()

    users_list = [
        {
            'ID': row[0],
            'FirstName': row[1],
            'LastName': row[2],
            'Email': row[3],
            'Purdue_ID': row[4],
        }
        for row in result
    ]
    return jsonify(users_list), 200

@app.route('/users/<int:user_id>', methods=['PUT'])
def edit_user(user_id):
    session = Session()
    user = session.query(Users).filter_by(user_id=user_id).first()
    
    if user is None:
        session.close()
        return jsonify({'message': 'User not found'}), 404

    data = request.json
    print(data)
    user.first_name = data.get('FirstName', user.first_name)
    user.last_name = data.get('LastName', user.last_name)
    user.email = data.get('Email', user.email)
    user.purdue_id = data.get('Purdue_ID', user.purdue_id)
    
    session.commit()
    session.close()
    
    return jsonify({'message': 'User updated'}), 200

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    session = Session()
    user = session.query(Users).filter_by(user_id=user_id).first()
    
    if user is None:
        session.close()
        return jsonify({'message': 'User not found'}), 404

    session.delete(user)
    session.commit()
    session.close()
    
    return jsonify({'message': 'User deleted'}), 200

@app.route('/groups', methods=['GET'])
def get_groups():
    session = Session()
    all_groups = session.query(WorkoutGroups).all()
    session.close()

    group_list = [
        {
            "groupId": group.group_id,
            "groupName": group.group_name,
            "groupLeaderId": group.group_leader_id,
            "workoutType": group.workout_type,
            "location" : group.location,
            "scheduledTime": group.scheduled_time,
            "duration": group.duration,
        }
        for group in all_groups
    ]

    return jsonify(group_list), 200

@app.route('/group', methods=['POST'])
def create_group():
    session = Session()
    data = request.json
    new_group = WorkoutGroups(
        group_name=data["group_name"],
        group_leader_id=data["group_leader_id"],
        workout_type=data["workout_type"],
        location=data["location"],
        scheduled_time=data["scheduled_time"],
        duration=data["duration"],
    )
    session.add(new_group)
    session.commit()

    group_id = new_group.group_id
    session.close()
    
    return jsonify({'message': 'Group created', 'group_id': group_id}), 201

@app.route('/groups/<int:group_id>', methods=['PUT'])
def edit_group(group_id):
    session = Session()
    group = session.query(WorkoutGroups).filter_by(group_id=group_id).first()
    
    if group is None:
        session.close()
        return jsonify({'message': 'Group not found'}), 404

    data = request.json
    print(data)
    group.group_name=data.get('groupName', group.group_name)
    group.group_leader_id=data.get('groupLeaderId', group.group_leader_id)
    group.workout_type=data.get('workoutType', group.workout_type)
    group.location=data.get('location', group.location)
    group.scheduled_time=data.get('scheduledTime', group.scheduled_time)
    group.duration=data.get('duration', group.duration)
    
    session.commit()
    session.close()
    
    return jsonify({'message': 'Group updated'}), 200

@app.route('/groups/<int:group_id>', methods=['DELETE'])
def delete_group(group_id):
    session = Session()
    group = session.query(WorkoutGroups).filter_by(group_id=group_id).first()
    
    if group is None:
        session.close()
        return jsonify({'message': 'Group not found'}), 404

    session.delete(group)
    session.commit()
    session.close()
    
    return jsonify({'message': 'Group deleted'}), 200

@app.route('/locations', methods=['GET'])
def get_locations():
    session = Session()
    all_locations = session.query(WorkoutLocations).all()
    session.close()

    location_list = [
        {
            "location_id": location.location_id,
            "location_name": location.location_name,
            "address": location.address,
            "indoor": location.indoor,
            "max_capacity": location.max_capacity
        }
        for location in all_locations
    ]

    return jsonify(location_list), 200

@app.route('/report/<int:location_id>', methods=['GET'])
def get_report(location_id):
    session = Session()
    
    query = text("""
        SELECT workout_type, COUNT(*) 
        FROM workout_groups 
        WHERE location = :location_id 
        GROUP BY workout_type
    """)

    result = session.execute(query, {"location_id": location_id}).fetchall()

    session.close()

    workout_counts = {row[0]: row[1] for row in result}
    return jsonify(workout_counts), 200

if __name__ == '__main__':
    app.run(debug=True)
