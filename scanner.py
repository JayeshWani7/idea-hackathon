import cv2
import pytesseract
import re
import json
import logging
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your Next.js app's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure pytesseract path (update this to your installation path)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'  # For Windows
# For Linux/Mac, you might not need this line if tesseract is in your PATH

# Function to extract Aadhaar data from the OCR text
def extract_aadhaar_data(text):
    """Extract relevant information from Aadhaar card text"""
    data = {
        "aadhaar_number": None,
        "name": None,
        "dob": None,
        "gender": None,
        "address": None
    }

    # Extract Aadhaar number (12 digits)
    aadhaar_pattern = r'\d{4}\s\d{4}\s\d{4}'
    aadhaar_matches = re.findall(aadhaar_pattern, text)
    if aadhaar_matches:
        data["aadhaar_number"] = aadhaar_matches[0].replace(" ", "")

    # Extract name (usually appears after "Name:" or similar)
    name_patterns = [
        r'(?:Name|नाम)[:\s]+([A-Za-z\s]+)',
        r'([A-Z][a-z]+\s[A-Z][a-z]+(?:\s[A-Z][a-z]+)?)'
    ]
    for pattern in name_patterns:
        name_matches = re.search(pattern, text)
        if name_matches:
            data["name"] = name_matches.group(1).strip()
            break

    # Extract DOB
    dob_pattern = r'(?:DOB|Date of Birth|जन्म तिथि)[:\s]+(\d{2}/\d{2}/\d{4})'
    dob_matches = re.search(dob_pattern, text)
    if dob_matches:
        data["dob"] = dob_matches.group(1)

    # Extract gender
    if re.search(r'\bMALE\b|\bM\b|\bपुरुष\b', text, re.IGNORECASE):
        data["gender"] = "Male"
    elif re.search(r'\bFEMALE\b|\bF\b|\bमहिला\b', text, re.IGNORECASE):
        data["gender"] = "Female"

    # Extract address (typically appears after "Address:" or similar)
    address_pattern = r'(?:Address|पता)[:\s]+(.+?)(?:\n\n|\n[A-Z])'
    address_matches = re.search(address_pattern, text, re.DOTALL)
    if address_matches:
        data["address"] = ' '.join(address_matches.group(1).split())

    return data

# FastAPI endpoint to scan Aadhaar card image
@app.post("/scan-aadhaar/")
async def scan_aadhaar(file: UploadFile = File(...)):
    logger.info("Received file: %s", file.filename)
    
    # Read the image file
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Check if the image was loaded successfully
    if img is None:
        logger.error("Failed to load image.")
        return {"error": "Failed to load image."}

    # Preprocess the image (convert to grayscale and apply Gaussian Blur)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blurred, 150, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Perform OCR on the image
    text = pytesseract.image_to_string(thresh, lang='eng+hin')

    # Log OCR output for debugging
    logger.info("OCR Output: %s", text)

    # Extract data from OCR text
    data = extract_aadhaar_data(text)

    # Return extracted data
    return data

# Run the FastAPI app with Uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
