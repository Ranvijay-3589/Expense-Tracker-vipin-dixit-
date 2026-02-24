import datetime as dt
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field, field_validator

from app.utils.categories import CATEGORIES


class ExpenseCreate(BaseModel):
    date: dt.date
    category: str
    amount: Decimal = Field(gt=0, decimal_places=2)
    note: str = Field(default="", max_length=100)

    @field_validator("category")
    @classmethod
    def validate_category(cls, value: str) -> str:
        if value not in CATEGORIES:
            raise ValueError(f"Category must be one of: {', '.join(CATEGORIES)}")
        return value


class ExpenseUpdate(BaseModel):
    date: Optional[dt.date] = None
    category: Optional[str] = None
    amount: Optional[Decimal] = Field(default=None, gt=0, decimal_places=2)
    note: Optional[str] = Field(default=None, max_length=100)

    @field_validator("category")
    @classmethod
    def validate_category(cls, value: Optional[str]) -> Optional[str]:
        if value is not None and value not in CATEGORIES:
            raise ValueError(f"Category must be one of: {', '.join(CATEGORIES)}")
        return value


class ExpenseResponse(BaseModel):
    id: int
    date: dt.date
    category: str
    amount: Decimal
    note: str
    created_at: dt.datetime

    model_config = {"from_attributes": True}


class CategoryTotal(BaseModel):
    category: str
    total: Decimal


class DailySummary(BaseModel):
    date: dt.date
    totals: list[CategoryTotal]
    grand_total: Decimal


class PeriodSummary(BaseModel):
    totals: list[CategoryTotal]
    grand_total: Decimal
