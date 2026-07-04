from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from pydantic import BaseModel, Field
from database.models import Match
from database.config import get_db
from backend.services.auth import get_current_user

router = APIRouter(prefix="/matches")

class MatchResponse(BaseModel):
    id: UUID
    user_id: UUID
    result: str
    winner: Optional[str] = None
    moves: int
    created_at: datetime

    class Config:
        orm_mode = True

@router.post("/", response_model=MatchResponse, operation_id="create_match", status_code=status.HTTP_201_CREATED)
async def create_match(
    match_data: MatchResponse,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    try:
        new_match = Match(
            id=match_data.id,
            user_id=current_user.id,
            result=match_data.result,
            winner=match_data.winner,
            moves=match_data.moves,
            created_at=match_data.created_at
        )
        db.add(new_match)
        db.commit()
        db.refresh(new_match)
        return new_match
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create match"
        )

@router.get("/", response_model=List[MatchResponse], operation_id="get_matches", status_code=status.HTTP_200_OK)
async def get_matches(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    try:
        matches = db.query(Match).filter(Match.user_id == current_user.id).all()
        return matches
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve matches"
        )