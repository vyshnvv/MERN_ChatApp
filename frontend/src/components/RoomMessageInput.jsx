import { useRef, useState } from "react";
import { useChatRoomStore } from "../store/useChatRoomStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const RoomMessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const { sendRoomMessage, selectedChatRoom } = useChatRoomStore();

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

      // Resolve with the entire result, which is the full Data URL string
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
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    // Validate file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 5MB.");
      return;
    }

    // Set file for submission and generate preview
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    // Reset the file input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imageFile) {
      return; // Nothing to send
    }

    if (!selectedChatRoom) {
      return toast.error("No chat room selected.");
    }

    try {
      const messageData = {
        text: text.trim(),
      };

      if (imageFile) {
        try {
          const base64Image = await convertFileToBase64(imageFile);
          messageData.image = base64Image;
          console.log(messageData.image);
        } catch (conversionError) {
          console.error("Frontend: Image conversion failed:", conversionError);
          toast.error("Failed to process the selected image.");
          return;
        }
      }

      await sendRoomMessage(selectedChatRoom._id, messageData);

      // Reset form state after successful send
      setText("");
      removeImage();
    } catch (error) {
      console.error("Failed to send message:", error);
      // The store already shows a toast on error, so no need for another one here.
    }
  };

  return (
    <div className="p-4 bg-base-100 border-t border-base-300">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-base-300"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-error text-error-content flex items-center justify-center shadow-md hover:bg-error-focus transition-colors"
              type="button"
              aria-label="Remove image"
            >
              <X className="size-4" />
            </button>
          </div>
          <span className="text-sm text-base-content/70">Image preview</span>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            className="flex-1 input input-bordered input-primary rounded-full"
            placeholder={`Message #${selectedChatRoom?.name || "..."}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`btn btn-circle btn-ghost ${
              imagePreview ? "text-primary" : "text-base-content/70"
            }`}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach image"
          >
            <Image size={20} />
          </button>
        </div>
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

export default RoomMessageInput;
