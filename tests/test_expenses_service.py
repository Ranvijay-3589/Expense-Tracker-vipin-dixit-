from datetime import date

from app.database import SessionLocal
from app.models.expense import Expense
from app.routes.expenses import create_expense, delete_expense, list_expenses
from app.routes.summary import get_summary
from app.schemas.expense import ExpenseCreate


def setup_function() -> None:
    db = SessionLocal()
    try:
        db.query(Expense).delete()
        db.commit()
    finally:
        db.close()


def test_create_and_list_expense_by_date() -> None:
    db = SessionLocal()
    try:
        payload = ExpenseCreate(date=date(2026, 2, 16), category="Food", amount="120.50", note="Lunch")
        created = create_expense(payload, db)

        assert created.id is not None
        assert created.category == "Food"

        result = list_expenses(date(2026, 2, 16), db)
        assert len(result) == 1
        assert result[0].note == "Lunch"
    finally:
        db.close()


def test_daily_summary_category_totals() -> None:
    db = SessionLocal()
    try:
        create_expense(ExpenseCreate(date=date(2026, 2, 16), category="Food", amount="10.00", note="A"), db)
        create_expense(ExpenseCreate(date=date(2026, 2, 16), category="Food", amount="5.50", note="B"), db)
        create_expense(ExpenseCreate(date=date(2026, 2, 16), category="Transport", amount="20.00", note="Cab"), db)

        summary = get_summary(date(2026, 2, 16), db)
        totals = {item.category: str(item.total) for item in summary.totals}

        assert totals["Food"] == "15.50"
        assert totals["Transport"] == "20.00"
        assert str(summary.grand_total) == "35.50"
    finally:
        db.close()


def test_delete_expense() -> None:
    db = SessionLocal()
    try:
        created = create_expense(
            ExpenseCreate(date=date(2026, 2, 16), category="Health", amount="40.00", note="Medicine"),
            db,
        )

        delete_expense(created.id, db)

        result = list_expenses(date(2026, 2, 16), db)
        assert result == []
    finally:
        db.close()
