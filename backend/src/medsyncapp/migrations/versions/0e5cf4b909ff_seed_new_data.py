"""seed new data

Revision ID: 0e5cf4b909ff
Revises: 7b0bae0ba599
Create Date: 2023-09-29 11:58:40.668065

"""
import random
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from faker import Faker

# revision identifiers, used by Alembic.
revision: str = '0e5cf4b909ff'
down_revision: Union[str, None] = '7b0bae0ba599'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

male_photos = [1, 2, 3, 5, 6, 10]
female_photos = [4, 7, 8, 9, 11, 12]

diagnostics_list = [
    {
        "type_name": "Magnetic Resonance Imaging",
        "description": "A procedure using magnetic fields and radio waves to create detailed images of the organs and tissues within the body.",
    },
    {
        "type_name": "Computed Tomography",
        "description": "An imaging procedure using X-rays and computer technology to produce cross-sectional images of the body.",
    },
    {
        "type_name": "X-Ray",
        "description": "A test using small amounts of radiation to produce images of the structures inside the body, especially bones.",
    },
    {
        "type_name": "Ultrasound",
        "description": "An imaging technique using high-frequency sound waves to create images of structures within the body.",
    },
    {
        "type_name": "Positron Emission Tomography",
        "description": "A procedure that helps show how tissues and organs are functioning, using a radioactive drug to show activity.",
    },
    {
        "type_name": "Blood Tests",
        "description": "Tests performed on a blood sample to check the function of certain organs and to assess health.",
    },
    {
        "type_name": "Urine Tests",
        "description": "Tests performed on a urine sample to check for various disorders, including those related to the kidneys and urinary tract.",
    },
    {
        "type_name": "Biopsy",
        "description": "A procedure where a piece of tissue or a sample of cells is removed from the body to be examined under a microscope.",
    },
    {
        "type_name": "Electrocardiogram",
        "description": "A test that measures the electrical activity of the heartbeat to identify abnormalities.",
    },
    {
        "type_name": "Bone Density Test",
        "description": "A test that measures bone mineral content to check for bone loss and osteoporosis.",
    },
    {
        "type_name": "Endoscopy",
        "description": "A procedure to examine the digestive tract using a flexible tube with a light and camera attached to it.",
    },
    {
        "type_name": "Colonoscopy",
        "description": "A procedure to examine the inside of the colon and rectum, using a long, flexible tube with a camera on the end.",
    },
]

doctor_specialties = [
    "Cardiologist",
    "Dermatologist",
    "Endocrinologist",
    "Gastroenterologist",
    "Gynecologist",
    "Hematologist",
    "Neurologist",
    "Ophthalmologist",
    "Otolaryngologist",
]


def upgrade() -> None:
    # Get the database connection
    conn = op.get_bind()
    # Initialize Faker
    fake = Faker()

    # Seed Locations
    location_ids = []
    for _ in range(3):
        result = conn.execute(
            sa.text(
                "INSERT INTO locations (name, address) VALUES (:name, :address) RETURNING location_id;",
            ),
            parameters=dict(
                name=fake.company(),
                address=fake.address()[:25],
            ),
        )
        location_id = result.scalar()
        location_ids.append(location_id)

    # Seed Diagnostics
    diagnostic_ids = []
    for diagnostic_type in diagnostics_list:
        result = conn.execute(
            sa.text(
                "INSERT INTO diagnostics (type_name, description, price) VALUES (:type_name, :description, :price) RETURNING diagnostic_id;",
            ),
            parameters=dict(
                type_name=diagnostic_type["type_name"],
                description=diagnostic_type["description"],
                price=float("{:.2f}".format(random.uniform(50.0, 500.0))),
            ),
        )
        diagnostic_id = result.scalar()
        diagnostic_ids.append(diagnostic_id)

    # Seed Diagnostic_Locations
    for diag_id in diagnostic_ids:
        for loc_id in random.sample(location_ids, 3):
            conn.execute(
                sa.text(
                    "INSERT INTO diagnostic_locations (diagnostic_id, location_id) VALUES (:diagnostic_id, :location_id);",
                ),
                parameters=dict(
                    diagnostic_id=diag_id,
                    location_id=loc_id,
                ),
            )
    speciality_ids = []
    # Seed Specialties
    for title in doctor_specialties:
        result = conn.scalar(
            sa.text(
                "INSERT INTO specialties (specialty_name) VALUES (:title) RETURNING specialty_id;",
            ),
            parameters=dict(
                title=title,
            ),
        )
        speciality_ids.append(result)

    # Seed Doctors
    for gender, photo_ids in [("male", male_photos), ("female", female_photos)]:
        for photo_id in photo_ids:
            conn.execute(
                sa.text(
                    "INSERT INTO doctors (location_id, full_name, specialty_id, price, photo_url) VALUES (:location_id, :full_name, :specialty_id, :price, :photo_url) RETURNING doctor_id;"
                ),
                parameters=dict(
                    location_id=random.choice(location_ids),
                    full_name=fake.name_male()
                    if gender == "male"
                    else fake.name_female(),
                    specialty_id=random.choice(speciality_ids),
                    price=float("{:.2f}".format(random.uniform(50.0, 200.0))),
                    photo_url=f"/images/doctors-listing/profiles/{photo_id}.png",
                ),
            )


def downgrade() -> None:
    pass
