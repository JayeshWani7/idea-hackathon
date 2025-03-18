import cv2
from deepface import DeepFace

# Path to stored (registered) image of the user
STORED_IMAGE_PATH = "stored_face.jpg"  # Change this to the actual stored image

def capture_image():
    """Capture an image from the webcam and save it as captured_face.jpg"""
    cap = cv2.VideoCapture(0)  # Open the default camera

    if not cap.isOpened():
        print("Error: Could not access camera")
        return None

    print("Press 'Space' to capture the image for authentication...")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Failed to capture frame")
            break

        cv2.imshow("Press Space to Capture", frame)

        key = cv2.waitKey(1)
        if key == 32:  # Spacebar pressed
            captured_image_path = "captured_face.jpg"
            cv2.imwrite(captured_image_path, frame)  # Save the captured image
            print(f"Image captured and saved as {captured_image_path}")
            cap.release()
            cv2.destroyAllWindows()
            return captured_image_path  # Return the path of the captured image
        
        elif key == 27:  # Escape key to exit
            print("Exiting...")
            cap.release()
            cv2.destroyAllWindows()
            return None

    cap.release()
    cv2.destroyAllWindows()
    return None

def authenticate_face(captured_image_path, STORED_IMAGE_PATH):
    """Compare the captured image with the stored image using DeepFace"""
    try:
        print("Authenticating...")
        result = DeepFace.verify(captured_image_path, STORED_IMAGE_PATH)

        if result["verified"]:
            print("✅ Authentication Successful!")
        else:
            print("❌ Authentication Failed!")

    except Exception as e:
        print(f"Error during authentication: {str(e)}")

if __name__ == "__main__":
    captured_image = capture_image()

    if captured_image:
        authenticate_face(captured_image, STORED_IMAGE_PATH)