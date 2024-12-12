from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Users(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    purdue_id = Column(String, nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.now)

class WorkoutGroups(Base):
    __tablename__ = 'workout_groups'

    group_id = Column(Integer, primary_key=True, autoincrement=True)
    group_name = Column(String, nullable=False)
    group_leader_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    workout_type = Column(String, nullable=False)
    location = Column(Integer, ForeignKey('workout_locations.location_id'), nullable=False)
    scheduled_time = Column(String, nullable=False)
    duration = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.now)

class WorkoutGroupMembers(Base):
    __tablename__ = 'workout_group_members'

    member_id = Column(Integer, primary_key=True, autoincrement=True)
    group_id = Column(Integer, ForeignKey('workout_groups.group_id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    joined_at = Column(DateTime, default=datetime.now)
    status = Column(String, nullable=False)

class WorkoutLocations(Base):
    __tablename__ = 'workout_locations'

    location_id = Column(Integer, primary_key=True, autoincrement=True)
    location_name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    indoor = Column(Boolean, nullable=False)
    max_capacity = Column(Integer, nullable=False)
