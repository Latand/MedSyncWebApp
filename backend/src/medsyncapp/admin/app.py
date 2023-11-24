from fastapi import FastAPI
from sqladmin import Admin, ModelView

from medsyncapp.infrastructure.database.models import User, Doctor, Diagnostic
from medsyncapp.infrastructure.database.models.doctors import Specialty
from medsyncapp.infrastructure.database.setup import create_engine
from medsyncapp.tgbot.config import load_config

app = FastAPI()
config = load_config()
engine = create_engine(config.db)
admin = Admin(app, engine)


class UserAdmin(ModelView, model=User):
    column_list = [User.user_id, User.username, User.full_name]

class DoctorAdmin(ModelView, model=Doctor):
    column_list = [Doctor.doctor_id, Doctor.full_name, Specialty.specialty_name]

    form_ajax_refs = {
        'specialty': {
            'fields': (Specialty.specialty_name,)
        }
    }

class DiagnosticAdmin(ModelView, model=Diagnostic):
    column_list = [Diagnostic.diagnostic_id, Diagnostic.type_name]

admin.add_view(UserAdmin)
admin.add_view(DoctorAdmin)
admin.add_view(DiagnosticAdmin)