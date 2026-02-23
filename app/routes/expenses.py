from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.expense import Expense
from app.models.user import User
from app.schemas.expense import ExpenseCreate, ExpenseResponse
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/expenses", tags=["expenses"])


@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(
    payload: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ExpenseResponse:
    expense = Expense(
        user_id=current_user.id,
        date=payload.date,
        category=payload.category,
        amount=payload.amount,
        note=payload.note.strip(),
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


@router.get("", response_model=list[ExpenseResponse])
def list_expenses(
    date: date = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ExpenseResponse]:
    stmt = (
        select(Expense)
        .where(Expense.user_id == current_user.id, Expense.date == date)
        .order_by(Expense.created_at.desc())
    )
    return list(db.scalars(stmt))


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    expense = db.get(Expense, expense_id)
    if expense is None or expense.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Expense not found")

    db.delete(expense)
    db.commit()
