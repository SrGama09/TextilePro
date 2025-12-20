import json
from pydantic import BaseModel, ConfigDict, model_validator


class TPBaseModel(BaseModel):
    """
    TPBaseModel: Entity to represent the TPBaseModel
    """

    @model_validator(mode="before")
    def parse_json_fields(cls, values):
        for field, value in values.items():
            if isinstance(value, str):
                try:
                    parsed_value = json.loads(value)
                    if isinstance(parsed_value, (list, dict)):
                        values[field] = parsed_value
                except json.JSONDecodeError:
                    pass

        return values

    def to_db_dict(self, clean: bool = True, *args, **kwargs) -> dict:
        original_dict = super().model_dump(*args, **kwargs, by_alias=False)
        return {
            k: (json.dumps(v) if isinstance(v, (dict, list)) else v)
            for k, v in original_dict.items()
            if not (clean and v is None)
        }

    model_config = ConfigDict(populate_by_name=True)


class TPGetBaseModel(TPBaseModel):
    """
    TPGetBaseModel: Entity to represent the TPGetBaseModel
    """
    pass


class TPInsertBaseModel(TPBaseModel):
    """
    TPInsertBaseModel: Entity to represent the TPInsertBaseModel
    """
    pass


class TPUpdateBaseModel(TPBaseModel):
    """
    TPUpdateBaseModel: Entity to represent the TPUpdateBaseModel
    """
    pass
