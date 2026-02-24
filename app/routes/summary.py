import datetime as dt
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.expense import Expense
from app.models.user import User
from app.schemas.expense import CategoryTotal, PeriodSummary
from app.utils.auth import get_current_user

router = APIRouter(prefix="/api/summary", tags=["summary"])


@router.get("", response_model=PeriodSummary)
def get_summary(
    date: Optional[dt.date] = Query(None),
    start_date: Optional[dt.date] = Query(None),
    end_date: Optional[dt.date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PeriodSummary:
    stmt = (
        select(Expense.category, func.coalesce(func.sum(Expense.amount), 0).label("total"))
        .where(Expense.user_id == current_user.id)
    )

    if date is not None:
        stmt = stmt.where(Expense.date == date)
    elif start_date is not None and end_date is not None:
        stmt = stmt.where(Expense.date >= start_date, Expense.date <= end_date)

    stmt = stmt.group_by(Expense.category).order_by(Expense.category.asc())

    totals = [CategoryTotal(category=row.category, total=row.total) for row in db.execute(stmt)]
    grand_total = sum((item.total for item in totals), Decimal("0"))
    return PeriodSummary(totals=totals, grand_total=grand_total)
