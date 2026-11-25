import logging
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId
from backend.app.config import settings

logger = logging.getLogger("stockmind.database")

class InMemoryCollection:
    """Async in-memory MongoDB-compatible collection for local testing and standalone execution."""
    def __init__(self, name: str):
        self.name = name
        self.docs: Dict[str, Dict[str, Any]] = {}

    def _matches_filter(self, doc: Dict[str, Any], filter_doc: Dict[str, Any]) -> bool:
        if not filter_doc:
            return True
        if "$or" in filter_doc:
            if not any(self._matches_filter(doc, cond) for cond in filter_doc["$or"]):
                return False
        for key, expected in filter_doc.items():
            if key == "$or":
                continue
            if key == "_id":
                if str(doc.get("_id")) != str(expected):
                    return False
            elif isinstance(expected, dict):
                # Handle operators like $in, $gte, $lte, $gt, $lt, $ne, $exists
                val = doc.get(key)
                for op, op_val in expected.items():
                    if op == "$exists":
                        if op_val and key not in doc:
                            return False
                        elif not op_val and key in doc:
                            return False
                    elif op == "$in" and val not in op_val:
                        return False
                    elif op == "$ne" and val == op_val:
                        return False
                    elif op == "$gte" and (val is None or val < op_val):
                        return False
                    elif op == "$lte" and (val is None or val > op_val):
                        return False
                    elif op == "$gt" and (val is None or val <= op_val):
                        return False
                    elif op == "$lt" and (val is None or val >= op_val):
                        return False
                    elif op == "$regex":
                        import re
                        if not re.search(op_val, str(val or ""), re.IGNORECASE):
                            return False
            else:
                if doc.get(key) != expected:
                    return False
        return True

    async def find_one(self, filter_doc: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        for doc in self.docs.values():
            if self._matches_filter(doc, filter_doc):
                return dict(doc)
        return None

    def find(self, filter_doc: Optional[Dict[str, Any]] = None):
        class Cursor:
            def __init__(self, collection: InMemoryCollection, filter_doc: Optional[Dict[str, Any]]):
                self.collection = collection
                self.filter_doc = filter_doc or {}
                self._sort_field = None
                self._sort_dir = 1
                self._limit_num = None
                self._skip_num = 0

            def sort(self, key_or_list, direction=1):
                if isinstance(key_or_list, list) and len(key_or_list) > 0:
                    self._sort_field, self._sort_dir = key_or_list[0]
                elif isinstance(key_or_list, str):
                    self._sort_field = key_or_list
                    self._sort_dir = direction
                return self

            def limit(self, n: int):
                self._limit_num = n
                return self

            def skip(self, n: int):
                self._skip_num = n
                return self

            def __aiter__(self):
                matches = [
                    dict(d) for d in self.collection.docs.values()
                    if self.collection._matches_filter(d, self.filter_doc)
                ]
                if self._sort_field:
                    matches.sort(
                        key=lambda x: (x.get(self._sort_field) is None, x.get(self._sort_field)),
                        reverse=(self._sort_dir == -1)
                    )
                if self._skip_num:
                    matches = matches[self._skip_num:]
                if self._limit_num is not None:
                    matches = matches[:self._limit_num]
                self._results = matches
                self._idx = 0
                return self

            async def __anext__(self):
                if not hasattr(self, "_results"):
                    self.__aiter__()
                if self._idx < len(self._results):
                    res = self._results[self._idx]
                    self._idx += 1
                    return res
                raise StopAsyncIteration

            async def to_list(self, length: Optional[int] = None) -> List[Dict[str, Any]]:
                matches = [
                    dict(d) for d in self.collection.docs.values()
                    if self.collection._matches_filter(d, self.filter_doc)
                ]
                if self._sort_field:
                    matches.sort(
                        key=lambda x: (x.get(self._sort_field) is None, x.get(self._sort_field)),
                        reverse=(self._sort_dir == -1)
                    )
                if self._skip_num:
                    matches = matches[self._skip_num:]
                if length is not None:
                    matches = matches[:length]
                elif self._limit_num is not None:
                    matches = matches[:self._limit_num]
                return matches

        return Cursor(self, filter_doc)

    async def insert_one(self, doc: Dict[str, Any]):
        doc_copy = dict(doc)
        if "_id" not in doc_copy:
            doc_copy["_id"] = ObjectId()
        doc_id = str(doc_copy["_id"])
        self.docs[doc_id] = doc_copy
        class InsertResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        return InsertResult(doc_copy["_id"])

    async def insert_many(self, docs: List[Dict[str, Any]]):
        ids = []
        for d in docs:
            res = await self.insert_one(d)
            ids.append(res.inserted_id)
        class InsertManyResult:
            def __init__(self, inserted_ids):
                self.inserted_ids = inserted_ids
        return InsertManyResult(ids)

    async def update_one(self, filter_doc: Dict[str, Any], update_doc: Dict[str, Any]):
        matched = 0
        modified = 0
        for doc_id, doc in self.docs.items():
            if self._matches_filter(doc, filter_doc):
                matched = 1
                if "$set" in update_doc:
                    for k, v in update_doc["$set"].items():
                        doc[k] = v
                    modified = 1
                if "$inc" in update_doc:
                    for k, v in update_doc["$inc"].items():
                        doc[k] = doc.get(k, 0) + v
                    modified = 1
                break
        class UpdateResult:
            def __init__(self, m, mod):
                self.matched_count = m
                self.modified_count = mod
        return UpdateResult(matched, modified)

    async def update_many(self, filter_doc: Dict[str, Any], update_doc: Dict[str, Any]):
        matched = 0
        modified = 0
        for doc_id, doc in self.docs.items():
            if self._matches_filter(doc, filter_doc):
                matched += 1
                if "$set" in update_doc:
                    for k, v in update_doc["$set"].items():
                        doc[k] = v
                    modified += 1
                if "$inc" in update_doc:
                    for k, v in update_doc["$inc"].items():
                        doc[k] = doc.get(k, 0) + v
                    modified += 1
        class UpdateResult:
            def __init__(self, m, mod):
                self.matched_count = m
                self.modified_count = mod
        return UpdateResult(matched, modified)

    async def delete_one(self, filter_doc: Dict[str, Any]):
        del_count = 0
        for doc_id, doc in list(self.docs.items()):
            if self._matches_filter(doc, filter_doc):
                del self.docs[doc_id]
                del_count = 1
                break
        class DeleteResult:
            def __init__(self, c):
                self.deleted_count = c
        return DeleteResult(del_count)

    async def delete_many(self, filter_doc: Dict[str, Any]):
        del_count = 0
        for doc_id, doc in list(self.docs.items()):
            if self._matches_filter(doc, filter_doc):
                del self.docs[doc_id]
                del_count += 1
        class DeleteResult:
            def __init__(self, c):
                self.deleted_count = c
        return DeleteResult(del_count)

    async def count_documents(self, filter_doc: Optional[Dict[str, Any]] = None) -> int:
        filter_doc = filter_doc or {}
        return sum(1 for d in self.docs.values() if self._matches_filter(d, filter_doc))


class DatabaseManager:
    def __init__(self):
        self.client = None
        self.db = None
        self.mode = "uninitialized"
        self._collections: Dict[str, InMemoryCollection] = {}

    async def connect(self):
        if settings.MONGODB_URI:
            try:
                from motor.motor_asyncio import AsyncIOMotorClient
                logger.info("Attempting connection to MongoDB Atlas...")
                self.client = AsyncIOMotorClient(
                    settings.MONGODB_URI,
                    serverSelectionTimeoutMS=2500
                )
                # Verify connection with a ping
                await self.client.admin.command('ping')
                self.db = self.client[settings.MONGODB_DB_NAME]
                self.mode = "atlas"
                logger.info(f"Connected successfully to MongoDB Atlas database: {settings.MONGODB_DB_NAME}")
                return
            except Exception as e:
                logger.warning(f"MongoDB Atlas connection failed: {e}. Falling back to high-performance async in-memory document store.")
        
        self.mode = "in-memory"
        logger.info("Operating in standalone in-memory document store mode (MongoDB-compatible).")

    async def close(self):
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed.")

    def get_collection(self, name: str):
        if self.mode == "atlas" and self.db is not None:
            return self.db[name]
        if name not in self._collections:
            self._collections[name] = InMemoryCollection(name)
        return self._collections[name]

db_manager = DatabaseManager()

def get_db():
    return db_manager
