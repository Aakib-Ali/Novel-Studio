from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.job import Job
from app.services.job_service import list_jobs, serialize_job

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.get("")
def jobs_list(
    book_id: str | None = Query(default=None),
    active_only: bool = Query(default=False),
    db: Session = Depends(get_db)
):
    return list_jobs(db, book_id=book_id, active_only=active_only)

@router.get("/{job_id}")
def job_detail(job_id: str, db: Session = Depends(get_db)):
    job = db.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return serialize_job(job)