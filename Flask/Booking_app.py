from flask import Flask, render_template, url_for, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, ValidationError
from flask_login import LoginManager
from flask_bcrypt import Bcrypt


db = SQLAlchemy()
DB_NAME="Booking_database.db"

def create_app():
    BookingApp = Flask(__name__)
    # This is to connect to the database #
    bcrypt = Bcrypt(BookingApp)
    BookingApp.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}' 
    
    BookingApp.config['SECRET_KEY'] = 'secretkey'

    db.init_app(BookingApp)


    login_manager = LoginManager() #Allows our app and Flask login to woirk together to handle login users ect #
    login_manager.init_app(BookingApp)
    login_manager.login_view = 'login'
 

    @login_manager.user_loader #Used to reload user object from user ID # 
    def load_user(user_id):
        return User.query.get(int(user_id))


    class User(db.Model, UserMixin):
        id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String(20), nullable=False, unique = True)
        password = db.Column(db.String(80), nullable=False)
    
    
    # Register fro website #
    class RegisterForm(FlaskForm):
        username = StringField(validators=[InputRequired(), Length(min=4, max=20)], 
            render_kw={"placeholder": "Username"})
        
        password = PasswordField(validators=[InputRequired(), Length(min=8, max=20)], render_kw={"placeholder": "Password"})

        submit = SubmitField('Register')

    def validate_username(self, username):
        existing_user_username = User.query.filter_by(
            username=username.data).first()
        if existing_user_username:
            raise ValidationError('That username already exists. Please choose a different one.')
   
   
   
    def clear_data(): #Funciton Userd to clear data from previsouse flask section#
        meta = db.metadata
        for table in reversed(meta.sorted_tables):
            db.session.execute(table.delete())
        db.session.commit() 
        return 'Content deleted from tables' 

    

    class LoginForm(FlaskForm):
        username = StringField(validators=[InputRequired(), Length(min=4, max=20)], render_kw={"placeholder": "Username"})

        password = PasswordField(validators=[InputRequired(), Length(min=8, max=20)], render_kw={"placeholder": "Password"})

        submit = SubmitField('Login')

    
    
    @BookingApp.route('/')
    def home():
        return render_template("Booking.html")

    @BookingApp.route('/dash', methods = ['GET', 'POST'])
    @login_required
    def dash():
        return render_template("Booking-Dashboard.html")

    
    @BookingApp.route('/clear')
    def clear():
        clear_data()
        return redirect(url_for('login'))

    #Route to log out of your Dsahboard#
    @BookingApp.route('/logout', methods = ['GET', 'POST'] )
    @login_required
    def logout():
        logout_user()
        return redirect(url_for('login'))

    
    @BookingApp.route('/login', methods = ['GET', 'POST'])
    def login():
        form = LoginForm()
        if form.validate_on_submit():
            user = User.query.filter_by(username=form.username.data).first()
            if user:
                if bcrypt.check_password_hash(user.password, form.password.data):
                    login_user(user)
                    return redirect(url_for('dash'))
        return render_template("Booking-Login.html", form = form)


    @BookingApp.route('/register', methods = ['GET', 'POST'])
    def register():
        form = RegisterForm()
           
        if form.validate_on_submit():
            hashed_password = bcrypt.generate_password_hash(form.password.data) 
            new_user = User(username=form.username.data, password=hashed_password)
            db.session.add(new_user)
            db.session.commit()
            return redirect(url_for('login'))
        
        return render_template("Booking-Register.html", form =form)

    
    with BookingApp.app_context():
        #Creates Database Tables
        db.create_all()

    return BookingApp


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)

# Booking_App
