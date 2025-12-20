from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class InsertIpexCustomerConfigValidator(BaseModel):
    """
    InsertIpexCustomerConfigValidator: Entity to represent the insertion of an ipex customer config.

    Class Attributes:
        companyUuid (str): The UUID of the company to insert the ipex customer config.
    """
    company_uuid: str = Field(..., alias='companyUuid')

    @field_validator('company_uuid')
    def check_not_empty(cls, value):
        if not value or not value.strip():
            raise ValueError("El parámetro 'companyUuid' es obligatorio y no puede estar vacío")
        return value


class GetIpexCustomerConfigValidator(BaseModel):
    """
    GetIpexCustomerConfigValidator: Entity to represent the filters for getting ipex customer config.

    Class Attributes:
        companyUuid (Optional[str]): The UUID of the company to get the ipex customer config.
    """
    company_uuid: str = Field(None, alias='companyUuid')

    @field_validator('company_uuid')
    def check_not_empty(cls, value):
        if value is None:
            raise ValueError(f"El parámetro companyUuid es obligatorio")
        return value


class UpdateIpexCustomerConfigValidator(BaseModel):
    """
    UpdateIpexCustomerConfigValidator: Entity to represent the update of an ipex customer config.

    Class Attributes:
        id (int): The ID of the ipex customer config to update.
        companyUuid (Optional[str]): The UUID of the company to update the ipex customer config.
        maxCompanies (Optional[int]): The maximum number of companies allowed.
        companiesObtained (Optional[int]): The number of companies obtained.
        lastRefreshDate (Optional[str]): The last refresh date of the customer config.
        nextRefreshDate (Optional[str]): The next refresh date of the customer config.
    """
    id: int
    company_uuid: Optional[str] = Field(None, alias='companyUuid')
    max_companies: Optional[int] = Field(None, alias='maxCompanies')
    companies_obtained: Optional[int] = Field(None, alias='companiesObtained')
    last_refresh_date: Optional[datetime] = Field(None, alias='lastRefreshDate')
    next_refresh_date: Optional[datetime] = Field(None, alias='nextRefreshDate')
