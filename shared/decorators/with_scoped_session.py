def with_scoped_session(func):
    """
    Decorator that creates an SQLAlchemy session before calling the function and closes it afterward.
    """

    def wrapper(self, *args, **kwargs):
        session = self.database_manager.get_session()
        try:
            result = func(self, session, *args, **kwargs)
            return result
        except Exception as e:
            session.rollback()
            raise e
        finally:
            self.database_manager.close_session(session)

    return wrapper
