"""empty message

Revision ID: b7132879edc0
Revises: 567038ea3029
Create Date: 2016-11-10 10:58:42.156651

"""

# revision identifiers, used by Alembic.
revision = 'b7132879edc0'
down_revision = '567038ea3029'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('episodes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('episodeJSONFileName', sa.String(length=30), nullable=False),
    sa.Column('episodeAssigned', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('episodeJSONFileName')
    )
    op.create_table('teacher_user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=50), nullable=False),
    sa.Column('password', sa.String(length=255), server_default='', nullable=False),
    sa.Column('reset_password_token', sa.String(length=100), server_default='', nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('confirmed_at', sa.DateTime(), nullable=True),
    sa.Column('is_active', sa.Boolean(), server_default='0', nullable=False),
    sa.Column('first_name', sa.String(length=100), server_default='', nullable=False),
    sa.Column('last_name', sa.String(length=100), server_default='', nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('teachers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('firstName', sa.String(length=30), nullable=False),
    sa.Column('lastName', sa.String(length=30), nullable=False),
    sa.Column('email', sa.String(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('test_model',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('firstName', sa.String(length=30), nullable=False),
    sa.Column('lastName', sa.String(length=30), nullable=False),
    sa.Column('email', sa.String(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('test_model')
    op.drop_table('teachers')
    op.drop_table('teacher_user')
    op.drop_table('episodes')
    ### end Alembic commands ###