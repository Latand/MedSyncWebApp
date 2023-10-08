"""seed doctor ratings

Revision ID: 566ce5e78aa3
Revises: 2651025c84a1
Create Date: 2023-10-01 08:36:35.653763

"""
import random
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "566ce5e78aa3"
down_revision: Union[str, None] = "2651025c84a1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    conn = op.get_bind()

    doctor_ids = conn.scalars(
        sa.text("SELECT doctor_id FROM doctors"),
    )
    bad_review = lambda: random.randint(0, 50) < 2

    for doctor_id in doctor_ids:
        conn.execute(
            sa.text(
                "INSERT INTO doctor_ratings (doctor_id, rating) VALUES (:doctor_id, :rating)"
            ),
            parameters=[
                dict(
                    doctor_id=doctor_id,
                    rating=random.randint(4, 5) if not bad_review() else random.randint(1, 3),
                )
                for _ in range(random.randint(50, 250))
            ],
        )

    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    conn = op.get_bind()
    conn.execute(sa.text("TRUNCATE TABLE doctor_ratings"))
    # ### end Alembic commands ###