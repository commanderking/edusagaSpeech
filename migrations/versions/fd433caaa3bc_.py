"""empty message

Revision ID: fd433caaa3bc
Revises: 9a32178ce187
Create Date: 2016-11-17 17:54:33.907940

"""

# revision identifiers, used by Alembic.
revision = 'fd433caaa3bc'
down_revision = '9a32178ce187'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('episode', 'episodeAssigned')
    op.add_column('episodes', sa.Column('episode_assigned', sa.Boolean(), nullable=False))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('episodes', 'episode_assigned')
    op.add_column('episode', sa.Column('episodeAssigned', sa.BOOLEAN(), autoincrement=False, nullable=False))
    ### end Alembic commands ###
