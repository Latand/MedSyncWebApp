"""seed data

Revision ID: 5a5dafefde9b
Revises: c3601dc5d69d
Create Date: 2023-09-29 07:06:41.042185

"""
import random
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from faker import Faker

# revision identifiers, used by Alembic.
revision: str = "5a5dafefde9b"
down_revision: Union[str, None] = "c3601dc5d69d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Get the database connection
    conn = op.get_bind()
    # Initialize Faker
    fake = Faker()

    # Seed Locations
    location_ids = []
    for _ in range(10):
        result = conn.execute(
            sa.text(
                "INSERT INTO locations (name, address) VALUES (:name, :address) RETURNING location_id;",
            ),
            parameters=dict(
                name=fake.company(),
                address=fake.address(),
            ),
        )
        location_id = result.scalar()
        location_ids.append(location_id)

    # Seed Diagnostics
    diagnostic_ids = []
    for _ in range(5):
        result = conn.execute(
            sa.text(
                "INSERT INTO diagnostics (type_name, description, price) VALUES (:type_name, :description, :price) RETURNING diagnostic_id;",
            ),
            parameters=dict(
                type_name=fake.bs(),
                description=fake.catch_phrase(),
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
                )
            )

    # Seed Doctors
    for loc_id in location_ids:
        conn.execute(
            sa.text(
            "INSERT INTO doctors (location_id, full_name, specialty, price, photo_url) VALUES (:location_id, :full_name, :specialty, :price, :photo_url) RETURNING doctor_id;",
            ),
            parameters=dict(
            location_id=loc_id,
            full_name=fake.name(),
            specialty=fake.job(),
            price=float("{:.2f}".format(random.uniform(50.0, 200.0))),
            photo_url=fake.image_url(),
            )
        )



def downgrade() -> None:
    pass
