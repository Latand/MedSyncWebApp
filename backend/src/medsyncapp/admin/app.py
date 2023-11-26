import logging

from fastapi import FastAPI
from sqladmin import Admin, ModelView

from medsyncapp.infrastructure.database.models import User, Specialist, Service, Location
from medsyncapp.infrastructure.database.models.slots import Booking

from medsyncapp.infrastructure.database.setup import create_engine
from medsyncapp.tgbot.config import load_config
from markupsafe import Markup
from fastapi.staticfiles import StaticFiles
import logging

app = FastAPI()
config = load_config()
engine = create_engine(config.db)
admin = Admin(app, engine)


class UserAdmin(ModelView, model=User):
    column_list = [User.user_id, User.username, User.full_name, "booking"]

    # @staticmethod
    # def format_booking(model, attribute):  # может разберешься как представить в виде строки без __repr__, но сейчас оно работает и без этой функции ( но с __repr__ )
    #     if model.booking:
    #         return model.booking
    #     else:
    #         return 'No Phone Number'
    #
    # column_formatters = {
    #     "booking": format_booking
    # }

    column_labels = {
        "booking": "phone_number"
    }


class DoctorAdmin(ModelView, model=Specialist):
    column_list = [Specialist.specialist_id, Specialist.full_name, "specialty", "provided_services"]

    @staticmethod
    def _list_thumbnail(view, context):
        image_url = '/' + f"{view.photo}"
        return Markup(
            '<img src="{}" alt="Photo of {}" style="width:50px; height:50px;">'.format(image_url, view.full_name))

    column_formatters = {
        'file': _list_thumbnail,
    }
    column_labels = {
        "full_name": "Full name",
        "provided_services": "Provided services"
    }


class ServiceAdmin(ModelView, model=Service):
    column_list = [Service.service_name, Service.description, Service.duration, Service.specialists]


class BookingAdmin(ModelView, model=Booking):
    column_list = [Booking.user_id,
                   Booking.user_full_name,
                   Booking.user_phone_number,
                   Booking.booking_time,
                   "specialist",
                   "service"]


admin.add_view(UserAdmin)
admin.add_view(DoctorAdmin)
admin.add_view(ServiceAdmin)
admin.add_view(BookingAdmin)
