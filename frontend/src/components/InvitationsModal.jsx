import { useEffect } from "react";
import { useChatRoomStore } from "../store/useChatRoomStore";
import { X, Check, Mail, Bell } from "lucide-react";
import { formatMessageTime } from "../lib/utils";

const InvitationsModal = ({ isOpen, onClose }) => {
  const { invitations, getInvitations, respondToInvitation } =
    useChatRoomStore();

  useEffect(() => {
    if (isOpen) {
      getInvitations();
    }
  }, [isOpen, getInvitations]);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box relative bg-base-100 backdrop-blur-md border border-base-300 shadow-xl p-8 max-w-lg max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle absolute right-4 top-4"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full shadow-lg mb-4">
            <Bell className="w-8 h-8 text-primary-content" />
          </div>
          <h2 className="text-2xl font-bold text-base-content">
            Room Invitations
          </h2>
          <p className="text-base-content/70 mt-2">
            Accept or decline invitations to join new rooms.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {invitations.length === 0 ? (
            <div className="text-center py-12 text-base-content/50">
              <Mail size={48} className="mx-auto mb-4 opacity-40" />
              <h3 className="text-lg font-semibold">All Caught Up!</h3>
              <p>You have no pending invitations.</p>
            </div>
          ) : (
            invitations.map((invitation) => (
              <InvitationCard
                key={invitation._id}
                invitation={invitation}
                onRespond={respondToInvitation}
              />
            ))
          )}
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

const InvitationCard = ({ invitation, onRespond }) => (
  <div className="bg-base-200 p-5 rounded-2xl shadow-md border border-base-300 space-y-4">
    <div>
      <h3 className="font-bold text-lg text-base-content">
        {invitation.room.name}
      </h3>
      <p className="text-sm text-base-content/70 mt-1">
        {invitation.room.description}
      </p>
      <p className="text-xs text-base-content/50 mt-2">
        from {invitation.invitedBy.fullName} •{" "}
        {formatMessageTime(invitation.createdAt)}
      </p>
    </div>
    <div className="flex gap-3">
      <button
        onClick={() => onRespond(invitation.room._id, "decline")}
        className="btn btn-outline flex-1"
      >
        Decline
      </button>
      <button
        onClick={() => onRespond(invitation.room._id, "accept")}
        className="btn btn-primary flex-1"
      >
        <Check className="inline-block mr-1 w-4 h-4" />
        Accept
      </button>
    </div>
  </div>
);

export default InvitationsModal;
  