'use client';

import { useState } from 'react';
import { Modal } from './modal';
import { useToast } from '@/lib/toast-context';
import { createMeeting } from '@/app/actions/meetings';

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateMeetingModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateMeetingModalProps) {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    participants: '',
    transcriptText: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      addToast('Please enter a meeting title', 'error');
      return;
    }

    try {
      setIsLoading(true);

      const participants = formData.participants
        .split(',')
        .map((p) => p.trim())
        .filter((p) => p);

      await createMeeting({
        title: formData.title,
        description: formData.description || undefined,
        startTime: new Date(),
        participants: participants.length > 0 ? participants : undefined,
      });

      addToast('Meeting created successfully', 'success');
      setFormData({
        title: '',
        description: '',
        participants: '',
        transcriptText: '',
      });
      onClose();
      onSuccess?.();
    } catch (error) {
      addToast('Failed to create meeting', 'error');
      console.error('Failed to create meeting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Meeting" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Meeting Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g., Q4 Planning Meeting"
            className="w-full px-3 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Add meeting details (optional)"
            rows={3}
            className="w-full px-3 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Participants (comma-separated emails)
          </label>
          <input
            type="text"
            value={formData.participants}
            onChange={(e) =>
              setFormData({ ...formData, participants: e.target.value })
            }
            placeholder="e.g., alice@company.com, bob@company.com"
            className="w-full px-3 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Paste Transcript (optional)
          </label>
          <textarea
            value={formData.transcriptText}
            onChange={(e) =>
              setFormData({ ...formData, transcriptText: e.target.value })
            }
            placeholder="Paste transcript text here or upload audio/video later"
            rows={4}
            className="w-full px-3 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded border border-border text-foreground hover:bg-card transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Meeting'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
