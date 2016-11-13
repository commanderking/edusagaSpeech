"""empty message

Revision ID: 38a225ff6a1d
Revises: b7132879edc0
Create Date: 2016-11-11 15:57:57.558746

"""

# revision identifiers, used by Alembic.
revision = '38a225ff6a1d'
down_revision = 'b7132879edc0'

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('episode',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('episodeJSONFileName', sa.String(length=30), nullable=False),
    sa.Column('episodeAssigned', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('episodeJSONFileName')
    )
    op.create_table('teacher',
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
    op.drop_table('teacher_user')
    op.drop_table('teachers')
    op.add_column('episodes', sa.Column('episode_id', sa.Integer(), nullable=True))
    op.add_column('episodes', sa.Column('teacher_id', sa.Integer(), nullable=True))
    op.drop_constraint(u'episodes_episodeJSONFileName_key', 'episodes', type_='unique')
    op.create_foreign_key(None, 'episodes', 'episode', ['episode_id'], ['id'])
    op.create_foreign_key(None, 'episodes', 'teacher', ['teacher_id'], ['id'])
    op.drop_column('episodes', 'episodeAssigned')
    op.drop_column('episodes', 'id')
    op.drop_column('episodes', 'episodeJSONFileName')
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('episodes', sa.Column('episodeJSONFileName', sa.VARCHAR(length=30), autoincrement=False, nullable=False))
    op.add_column('episodes', sa.Column('id', sa.INTEGER(), nullable=False))
    op.add_column('episodes', sa.Column('episodeAssigned', sa.BOOLEAN(), autoincrement=False, nullable=False))
    op.drop_constraint(None, 'episodes', type_='foreignkey')
    op.drop_constraint(None, 'episodes', type_='foreignkey')
    op.create_unique_constraint(u'episodes_episodeJSONFileName_key', 'episodes', ['episodeJSONFileName'])
    op.drop_column('episodes', 'teacher_id')
    op.drop_column('episodes', 'episode_id')
    op.create_table('teachers',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('firstName', sa.VARCHAR(length=30), autoincrement=False, nullable=False),
    sa.Column('lastName', sa.VARCHAR(length=30), autoincrement=False, nullable=False),
    sa.Column('email', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id', name=u'teachers_pkey')
    )
    op.create_table('teacher_user',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('username', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('password', sa.VARCHAR(length=255), server_default=sa.text(u"''::character varying"), autoincrement=False, nullable=False),
    sa.Column('reset_password_token', sa.VARCHAR(length=100), server_default=sa.text(u"''::character varying"), autoincrement=False, nullable=False),
    sa.Column('email', sa.VARCHAR(length=255), autoincrement=False, nullable=False),
    sa.Column('confirmed_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('is_active', sa.BOOLEAN(), server_default=sa.text(u'false'), autoincrement=False, nullable=False),
    sa.Column('first_name', sa.VARCHAR(length=100), server_default=sa.text(u"''::character varying"), autoincrement=False, nullable=False),
    sa.Column('last_name', sa.VARCHAR(length=100), server_default=sa.text(u"''::character varying"), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id', name=u'teacher_user_pkey'),
    sa.UniqueConstraint('email', name=u'teacher_user_email_key'),
    sa.UniqueConstraint('username', name=u'teacher_user_username_key')
    )
    op.drop_table('teacher')
    op.drop_table('episode')
    ### end Alembic commands ###
