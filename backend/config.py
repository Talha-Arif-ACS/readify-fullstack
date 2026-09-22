import os
from dotenv import load_dotenv

load_dotenv()

db_connection = os.environ.get('DB_CONNECTION')
#this key is loaded from the .evn
origins = os.environ.get('ORIGINS')
documentation_url = os.environ.get("DOCS_URL") or None




