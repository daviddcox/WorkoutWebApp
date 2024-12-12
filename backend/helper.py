from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Users, WorkoutGroups, WorkoutLocations
from datetime import datetime, timedelta

# Create engine and session
engine = create_engine('sqlite:///workout.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

# Add Users
user1 = Users(first_name="John", last_name="Doe", email="johndoe@example.com", purdue_id="001")
user2 = Users(first_name="Jane", last_name="Smith", email="janesmith@example.com", purdue_id="002")
user3 = Users(first_name="Alice", last_name="Johnson", email="alicej@example.com", purdue_id="003")
user4 = Users(first_name="Bob", last_name="Davis", email="bobd@example.com", purdue_id="004")
session.add_all([user1, user2, user3, user4])
session.commit()

# Add Locations
location1 = WorkoutLocations(location_name="Rec Center", address="123 Fitness Ave", indoor=True, max_capacity=50)
location2 = WorkoutLocations(location_name="Track Field", address="456 Sports Ln", indoor=False, max_capacity=100)
session.add_all([location1, location2])
session.commit()

# Add Workout Groups with some overlap in types
group1 = WorkoutGroups(
    group_name="Boiler Running Club",
    group_leader_id=user1.user_id,
    workout_type="Running",
    location=location2.location_id,
    scheduled_time="Tuesdays and Thursdays at 6pm",
    duration=60,
    created_at=datetime.now()
)

group2 = WorkoutGroups(
    group_name="Morning Yoga Group",
    group_leader_id=user2.user_id,
    workout_type="Yoga",
    location=location1.location_id,
    scheduled_time="Mondays at 7:30am",
    duration=45,
    created_at=datetime.now()
)

group3 = WorkoutGroups(
    group_name="Advanced Yoga Flow",
    group_leader_id=user2.user_id,
    workout_type="Yoga",
    location=location2.location_id,  # Overlap with Track Field location
    scheduled_time="Wednesdays at 6pm",
    duration=60,
    created_at=datetime.now()
)

group4 = WorkoutGroups(
    group_name="Track Running Enthusiasts",
    group_leader_id=user3.user_id,
    workout_type="Running",
    location=location2.location_id,
    scheduled_time="Saturdays at 9am",
    duration=90,
    created_at=datetime.now()
)

group5 = WorkoutGroups(
    group_name="Sunrise Yoga",
    group_leader_id=user4.user_id,
    workout_type="Yoga",
    location=location1.location_id,
    scheduled_time="Sundays at 6am",
    duration=30,
    created_at=datetime.now()
)

group6 = WorkoutGroups(
    group_name="Outdoor Running Squad",
    group_leader_id=user1.user_id,
    workout_type="Running",
    location=location1.location_id,  # Overlap with Rec Center location
    scheduled_time="Fridays at 5pm",
    duration=60,
    created_at=datetime.now()
)

group7 = WorkoutGroups(
    group_name="Yoga for All",
    group_leader_id=user3.user_id,
    workout_type="Yoga",
    location=location2.location_id,  # Overlap with Track Field location
    scheduled_time="Fridays at 7pm",
    duration=45,
    created_at=datetime.now()
)

# Add groups to session
session.add_all([group1, group2, group3, group4, group5, group6, group7])
session.commit()

# Query all groups to check
groups = session.query(WorkoutGroups).all()
for group in groups:
    print(f"Group Name: {group.group_name}, Leader ID: {group.group_leader_id}, Location: {group.location}, Type: {group.workout_type}")

session.close()
