from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database.models import Match
from database.config import get_db
from backend.services.auth import get_current_user
from uuid import UUID

router = APIRouter(prefix='/stats')

class StatsResponse(BaseModel):
    total_matches: int
    wins: int
    losses: int
    draws: int
    total_moves: int

@router.get("/", response_model=StatsResponse, operation_id="get_stats")
async def get_stats(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.id
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access"
        )

    total_matches = db.query(Match).filter(Match.user_id == user_id).count()
    wins = db.query(Match).filter(Match.user_id == user_id, Match.result == "win").count()
    losses = db.query(Match).filter(Match.user_id == user_id, Match.result == "loss").count()
    draws = db.query(Match).filter(Match.user_id == user_id, Match.result == "draw").count()
    total_moves = db.query(Match).filter(Match.user_id == user_id).with_entities(
        db.func.sum(Match.moves)
    ).scalar() or 0

    return StatsResponse(
        total_matches=total_matches,
        wins=wins,
        losses=losses,
        draws=draws,
        total_moves=total_moves
    )