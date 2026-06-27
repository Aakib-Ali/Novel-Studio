from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.jobModel import Job
from app.services.jobService import listjobs, serializejob

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("")
def jobslist(
    bookid: str | None = Query(default=None, alias="book_id"),
    activeonly: bool = Query(default=False, alias="active_only"),
    db: Session = Depends(get_db),
):
    return listjobs(db, bookid=bookid, activeonly=activeonly)


@router.get("/{jobid}")
def jobdetail(jobid: str, db: Session = Depends(get_db)):
    job = db.get(Job, jobid)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return serializejob(job)