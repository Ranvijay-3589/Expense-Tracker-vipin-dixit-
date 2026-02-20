from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, Field, field_validator

from app.utils.categories import CATEGORIES


class ExpenseCreate(BaseModel):
    date: date
    category: str
    amount: Decimal = Field(gt=0, decimal_places=2)
    note: str = Field(default="", max_length=100)

    @field_validator("category")
    @classmethod
    def validate_category(cls, value: str) -> str:
        if value not in CATEGORIES:
            raise ValueError(f"Category must be one of: {', '.join(CATEGORIES)}")
        return value


class ExpenseResponse(BaseModel):
    id: int
    date: date
    category: str
    amount: Decimal
    note: str
    created_at: datetime

    model_config = {"from_attributes": True}


class CategoryTotal(BaseModel):
    category: str
    total: Decimal


class DailySummary(BaseModel):
    date: date
    totals: list[CategoryTotal]
    grand_total: Decimal
