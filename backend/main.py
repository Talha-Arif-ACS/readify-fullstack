from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import config

from routes import student1_endpoints, student2_endpoints, student3_endpoints

app = FastAPI(docs_url=config.documentation_url)

# If config.origins exists, split by comma; otherwise allow all origins
origins = config.origins.split(',') if config.origins else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect all the individual router files to this main app
app.include_router(router=student1_endpoints.router, prefix="/student1", tags=["Student 1"])
app.include_router(router=student2_endpoints.router, prefix="/student2", tags=["Student 2"])
app.include_router(router=student3_endpoints.router, prefix="/student3", tags=["Student 3"])

@app.get("/")
def read_root():
    return {"message": "Readify Final Core Backend is Live."}
