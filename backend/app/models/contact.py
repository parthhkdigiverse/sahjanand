from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, Literal
from bson import ObjectId
from pydantic_core import core_schema
from datetime import datetime
from typing import Any


class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, _source_type: Any, _handler: Any
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ]),
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def validate(cls, v: Any) -> ObjectId:
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)


class ContactBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    preferred_date: Optional[str] = None
    subject: str
    message: str
    type: Literal["GENERAL", "PRODUCT", "VIDEO_CALL", "STORE_VISIT", "VIRTUAL_CALL", "HOME_VISIT"] = "GENERAL"
    product_id: Optional[str] = None
    product_name: Optional[str] = None
    is_read: bool = False


class ContactCreate(ContactBase):
    pass


class Contact(ContactBase):
    mongo_id: Optional[PyObjectId] = Field(None, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
