from flask import Flask, render_template, request, session, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import current_user
import uuid


# Create a new Flask app instance
app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'  # Set your secret key for session management

# Configure the database URI for SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///taskmanager.db'

# Initialize the SQLAlchemy object
db = SQLAlchemy(app)

# Define the Task class for representing tasks
class User(db.Model):
    id = db.Column(db.String(80), primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.String(15), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    
    tasks = db.relationship('Task', backref='user', lazy=True)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task_name = db.Column(db.String(100), nullable=False)
    tag = db.Column(db.String(50))
    priority = db.Column(db.String(20))
    duration = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        return {
            'task_name': self.task_name,
            'tag': self.tag,
            'priority': self.priority,
            'duration' : self.duration
        }


# Route to display the signup page
@app.route('/home', methods = ["GET","Post","DELETE"])
def App():
    return render_template("app.html")




# Route to display the signup page
@app.route('/signuppage')
def signup():
    return render_template("signup.html")

# Route to display the welcome page
@app.route('/')
def hello():
    return render_template("welcome.html")

# Route to display the login page
@app.route('/login')
def login():
    return render_template("login.html")

@app.route('/signup', methods=['POST'])
def userInsertion():
    username = request.form.get("username")
    email = request.form.get("email")
    phone = request.form.get("phone")
    password = request.form.get("password")
    password = password.strip()

   # Generate a unique user ID using UUID
    user_id = str(uuid.uuid4())

    # Store the generated user ID in the session
    session["user_id"] = user_id
    
    # Create a new User instance
    new_user = User(id=user_id, username=username, email=email, phone_number=phone, password=password)

    # Add the new user to the database and commit the changes
    db.session.add(new_user)
    db.session.commit()

    return redirect("/home")

# Route to handle login form submission
@app.route("/loginvalidation", methods=["POST","GET"])
def logincheck():
    user_name = request.form.get("username")
    password = request.form.get("password")
    user = User.query.filter_by(username=user_name, password=password).first()
    if user:
        # Start a session for the user
        session["user_id"] = user.id
        return redirect("/home")
    else:
        return "User not found."






# Route to receive a task from the client
@app.route("/add-task", methods=["POST"])
def add_task():
    task_name = request.form["task"]
    tag = request.form["tag"]
    priority = request.form["priority"]
    user_id = session["user_id"]
    
    # Fetch the user using the user ID
    user = User.query.get(user_id)
    if user:
        new_task = Task(task_name=task_name, tag=tag, priority=priority, duration=0)
        user.tasks.append(new_task)
        db.session.add(new_task)
        db.session.commit()
        return redirect("/home")
    else:
        return "User not found"



@app.route('/tasks')
def get_tasks():
    user_id = session['user_id']
    tasks = Task.query.filter_by(user_id=user_id).all()
    return jsonify({'tasks': [task.to_dict() for task in tasks]})



@app.route("/delete-task/<string:task_name>", methods=["GET","Post","DELETE"])
def delete_task(task_name):
    task = Task.query.filter_by(task_name=task_name).first()
    if task:
        db.session.delete(task)
        db.session.commit()
        tasks = Task.query.all()
        return jsonify({"tasks": [task.to_dict() for task in tasks]})
    else:
        return "Task not found.", 404



@app.route("/new-duration/<string:task_name>/<string:new_duration>" , methods=["GET","Post","DELETE"])
def insertDuration(task_name,new_duration):
  task = Task.query.filter_by(task_name=task_name).first()
  if task is None:
    return jsonify({'error': 'Task not found'})
  task.duration += int(new_duration)
  if (task.duration<60):
      db.session.commit()
      return {'duration': str(task.duration) + " minutes"}
  elif(task.duration<60):
        Dd = task.duration/60
        h = int(Dd)
        m = (Dd-h)*60
        db.session.commit()
        return {'duration': str(h) + " hours" + str(m) + " minutes"}
      
  
      













# Route to handle user logout
@app.route("/logout")
def logout():
    session.pop('user_id', None)
    return render_template("welcome.html")

# Create the necessary database tables and run the Flask app
if __name__ == '__main__':
    # Create the necessary database tables within the application context
    with app.app_context():
        db.create_all()
    
    # Run the Flask app in debug mode
    app.run(debug=True)
