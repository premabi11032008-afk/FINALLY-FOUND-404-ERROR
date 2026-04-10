import google.generativeai as genai
from PIL import Image
import io

def verify_with_gemini(image_bytes, api_key):
    """
    Uses Gemini Vision to verify if the image contains a phone or laptop.
    Returns: (is_verified, type_detected, condition_description)
    """
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        img = Image.open(io.BytesIO(image_bytes))
        
        prompt = """
        Analyze this image of an electronic device. 
        1. Is it a smartphone or a laptop? (Answer only 'phone', 'laptop', or 'unknown')
        2. Briefly describe its physical condition (cracks, scratches, or pristine).
        
        Your response should be in this exact format:
        Type: [type]
        Condition: [condition]
        """
        
        response = model.generate_content([prompt, img])
        text = response.text.lower()
        
        is_verified = False
        device_type = "unknown"
        condition = "unknown"
        
        if "type: phone" in text:
            is_verified = True
            device_type = "phone"
        elif "type: laptop" in text:
            is_verified = True
            device_type = "laptop"
            
        if "condition:" in text:
            condition = text.split("condition:")[1].strip()
            
        return is_verified, device_type, condition
    except Exception as e:
        print(f"Gemini Error: {e}")
        return False, "error", str(e)
