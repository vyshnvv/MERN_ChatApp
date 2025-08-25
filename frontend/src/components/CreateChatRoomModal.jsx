import { useState } from "react";
import { useChatRoomStore } from "../store/useChatRoomStore";
import { X, Hash, Info, Loader2 } from "lucide-react";

const CreateRoomModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { createChatRoom, isLoadingChatRooms } = useChatRoomStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    await createChatRoom({
      name: name.trim(),
      description: description.trim(),
    });

    // The store success toast will handle feedback, just close on completion
    setName("");
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box relative bg-base-100 backdrop-blur-md border border-base-300 shadow-xl p-8 max-w-md">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle absolute right-4 top-4"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full shadow-lg mb-4">
            <Hash className="w-8 h-8 text-primary-content" />
          </div>
          <h2 className="text-2xl font-bold text-base-content">
            Create New Room
          </h2>
          <p className="text-base-content/70 mt-2">
            Start a new conversation with a group.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            icon={<Hash className="w-4 h-4" />}
            label="Room Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Gaming Crew"
            required
          />
          <InputField
            icon={<Info className="w-4 h-4" />}
            label="Description"
            isTextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this room about?"
          />

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoadingChatRooms || !name.trim()}
              className="btn btn-primary flex-1"
            >
              {isLoadingChatRooms ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Room"
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

const InputField = ({ icon, label, isTextArea, ...props }) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text flex items-center gap-2">
        {icon} {label}
      </span>
    </label>
    {isTextArea ? (
      <textarea
        {...props}
        rows="3"
        className="textarea textarea-bordered w-full"
      />
    ) : (
      <input {...props} type="text" className="input input-bordered w-full" />
    )}
  </div>
);

export default CreateRoomModal;
