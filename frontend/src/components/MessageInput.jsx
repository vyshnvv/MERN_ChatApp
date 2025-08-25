import { useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = ({ onSendMessage, placeholder = "Type a message..." }) => {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null); // State now holds the File object
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  /**
   * Converts a File object to a base64 Data URL string.
   * @param {File} file The file to convert.
   * @returns {Promise<string>} A promise that resolves with the data URL.
   */
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        return reject(new Error("No file provided"));
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          resolve(event.target.result);
        } else {
          reject(new Error("Failed to read file as data URL"));
        }
      };
      reader.onerror = (error) => {
        reject(new Error("FileReader failed to read file: " + error));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic validation
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image is too large. Maximum size is 5MB.");
        return;
      }

      setImageFile(file); // Store the file object

      // Create a URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the input
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imageFile) return;

    try {
      // Prepare the payload for the parent component
      const messageData = {
        text: text.trim(),
        image: null, // Default image to null
      };

      // If an image exists, convert it to base64 before sending
      if (imageFile) {
        const base64Image = await convertFileToBase64(imageFile);
        messageData.image = base64Image;
      }

      // Call the parent's handler function with the correct payload
      await onSendMessage(messageData);

      // Reset the form on successful submission
      setText("");
      removeImage();
    } catch (error) {
      toast.error("Failed to send message.");
      console.error("Message sending error:", error);
    }
  };

  return (
    <div className="w-full p-4 bg-base-100 border-t border-base-300">
      {imagePreview && (
        <div className="mb-3 p-3 bg-base-200 rounded-lg relative inline-block">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-md"
          />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-error text-error-content flex items-center justify-center shadow-md hover:bg-error-focus transition-colors"
            type="button"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`btn btn-circle btn-ghost ${
            imagePreview ? "text-primary" : "text-base-content/70"
          }`}
          aria-label="Attach image"
        >
          <Image size={20} />
        </button>

        <input
          type="text"
          className="flex-1 input input-bordered input-primary rounded-full"
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          type="submit"
          className="btn btn-circle btn-primary"
          disabled={!text.trim() && !imageFile}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
