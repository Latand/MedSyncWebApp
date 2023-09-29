"""seed doctor about data

Revision ID: f8318189ccce
Revises: 80330b4aa722
Create Date: 2023-09-29 19:01:16.356469

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f8318189ccce'
down_revision: Union[str, None] = '80330b4aa722'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

doctor_about_data = [
    {
        "doctor_id": 1,
        "experience": "With a robust experience in diagnosing and treating a variety of neurological conditions such as epilepsy, Alzheimer's disease, and migraine, I ensure a thorough examination and tailored treatment plans for every patient.",
        "services": "Neurological consultation\nEpilepsy management\nAlzheimer's treatment\nMigraine treatment.",
        "certificates": "Board Certified in Neurology, Fellowship in Epilepsy.",
        "working_time": "Monday to Friday: 9:00 AM - 5:00 PM."
    },
    {
        "doctor_id": 2,
        "experience": "My expertise in diagnosing and treating eye conditions has been honed over years of practice. I specialize in cataract surgery, glaucoma management, and refractive surgery to correct vision problems.",
        "services": "Eye examinations\nCataract surgery\nGlaucoma management\nRefractive surgery.",
        "certificates": "Board Certified in Ophthalmology, Fellowship in Cornea and Refractive Surgery.",
        "working_time": "Monday to Friday: 8:00 AM - 4:00 PM."
    },
    {
        "doctor_id": 3,
        "experience": "As a neurologist with extensive experience, I focus on providing personalized care for patients with neurological disorders, ensuring a comprehensive approach towards diagnosis and treatment.",
        "services": "Neurological consultation\nParkinson's disease management\nStroke rehabilitation.",
        "certificates": "Board Certified in Neurology, Certified in Clinical Neurophysiology.",
        "working_time": "Monday to Friday: 10:00 AM - 6:00 PM."
    },
    {
        "doctor_id": 4,
        "experience": "Specializing in blood disorders and cancers, I am dedicated to providing exceptional care and innovative treatments to patients with a variety of hematological conditions.",
        "services": "Hematology consultation\nBlood disorder treatment\nHematologic oncology.",
        "certificates": "Board Certified in Hematology, Fellowship in Hematologic Oncology.",
        "working_time": "Monday to Friday: 9:00 AM - 5:00 PM."
    },
    {
        "doctor_id": 5,
        "experience": "With a profound knowledge in eye care, I specialize in diagnosing and treating various eye conditions ensuring a clear vision and healthy eyes for my patients.",
        "services": "Eye examinations\nDiabetic retinopathy management\nMacular degeneration treatment.",
        "certificates": "Board Certified in Ophthalmology, Certified in Retinal Diseases.",
        "working_time": "Monday to Friday: 8:00 AM - 4:00 PM."
    },
    {
        "doctor_id": 6,
        "experience": "I am dedicated to managing hormonal disorders and ensuring that my patients receive the appropriate care and treatment to maintain a balanced hormonal health.",
        "services": "Endocrinology consultation\nDiabetes management\nThyroid disorder treatment.",
        "certificates": "Board Certified in Endocrinology, Certified in Diabetes Care.",
        "working_time": "Monday to Friday: 9:00 AM - 5:00 PM."
    },
    {
        "doctor_id": 7,
        "experience": "Providing comprehensive neurological care, I specialize in treating a range of neurological disorders ensuring a better quality of life for my patients.",
        "services": "Neurological consultation\nMultiple Sclerosis management\nHeadache treatment.",
        "certificates": "Board Certified in Neurology, Certified in Neuroimmunology.",
        "working_time": "Monday to Friday: 10:00 AM - 6:00 PM."
    },
    {
        "doctor_id": 8,
        "experience": "I am dedicated to women's health, providing gynecological care that covers a wide range of women's health issues from preventive care to treatment of gynecological disorders.",
        "services": "Gynecological consultation\nPrenatal care\nMenopause management.",
        "certificates": "Board Certified in Obstetrics and Gynecology, Fellowship in Minimally Invasive Gynecologic Surgery.",
        "working_time": "Monday to Friday: 9:00 AM - 5:00 PM."
    },
    {
        "doctor_id": 9,
        "experience": "Specializing in endocrinology, I focus on providing individualized care to manage hormonal disorders, ensuring a balanced and healthier life for my patients.",
        "services": "Endocrinology consultation\nDiabetes management\nThyroid disorder treatment.",
        "certificates": "Board Certified in Endocrinology, Certified in Metabolic Bone Disease.",
        "working_time": "Monday to Friday: 9:00 AM - 5:00 PM."
    },
    {
        "doctor_id": 10,
        "experience": "With a focus on women's health, I provide a range of gynecological services ensuring a comfortable and understanding environment for every patient.",
        "services": "Gynecological consultation\nFamily planning\nReproductive endocrinology.",
        "certificates": "Board Certified in Obstetrics and Gynecology, Certified in Reproductive Endocrinology and Infertility.",
        "working_time": "Monday to Friday: 9:00 AM - 5:00 PM."
    },
    {
        "doctor_id": 11,
        "experience": "Specializing in gastroenterology, I provide comprehensive care for digestive and liver diseases, ensuring accurate diagnosis and effective treatment.",
        "services": "Gastroenterology consultation\nColonoscopy\nLiver disease treatment.",
        "certificates": "Board Certified in Gastroenterology, Fellowship in Hepatology.",
        "working_time": "Monday to Friday: 8:00 AM - 4:00 PM."
    },
    {
        "doctor_id": 12,
        "experience": "As an endocrinologist, I am devoted to treating hormonal imbalances and disorders ensuring the well-being and hormonal health of my patients.",
        "services": "Endocrinology consultation\nDiabetes management\nOsteoporosis treatment.",
        "certificates": "Board Certified in Endocrinology, Certified in Bone Densitometry.",
        "working_time": "Monday to Friday: 9:00 AM - 5:00 PM."
    }
]



def upgrade() -> None:

    # ### commands auto generated by Alembic - please adjust! ###
    conn = op.get_bind()
    for doctor_about in doctor_about_data:
        conn.execute(
            sa.text(
                "UPDATE doctors SET experience = :experience, services = :services, certificates = :certificates, working_time = :working_time WHERE doctor_id = :doctor_id"
            ),
            parameters=doctor_about
        )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    # ### end Alembic commands ###
    pass
