import datetime as dt
from decimal import Decimal

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.expense import Expense
from app.models.user import User
from app.schemas.expense import CategoryTotal, DailySummary
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/summary", tags=["summary"])


@router.get("", response_model=DailySummary)
def get_summary(
    date: dt.date = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DailySummary:
    stmt = (
        select(Expense.category, func.coalesce(func.sum(Expense.amount), 0).label("total"))
        .where(Expense.user_id == current_user.id, Expense.date == date)
        .group_by(Expense.category)
        .order_by(Expense.category.asc())
    )

    totals = [CategoryTotal(category=row.category, total=row.total) for row in db.execute(stmt)]
    grand_total = sum((item.total for item in totals), Decimal("0"))
    return DailySummary(date=date, totals=totals, grand_total=grand_total)
