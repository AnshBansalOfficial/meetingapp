'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/lib/toast-context';
import { updateActionItem, deleteActionItem, createActionItem } from '@/app/actions/meetings';

interface ActionItem {
  id: string;
  title: string;
  description: string | null;
  status: string;
  assignedTo: string | null;
  dueDate: Date | null;
}

interface ActionItemsPanelProps {
  meetingId: string;
  actionItems: ActionItem[];
  onRefresh?: () => void;
}

export function ActionItemsPanel({
  meetingId,
  actionItems,
  onRefresh,
}: ActionItemsPanelProps) {
  const { addToast } = useToast();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [isLoadingUpdate, setIsLoadingUpdate] = useState<string | null>(null);

  const handleToggleStatus = async (item: ActionItem) => {
    const newStatus = item.status === 'completed' ? 'pending' : 'completed';
    try {
      setIsLoadingUpdate(item.id);
      await updateActionItem(item.id, { status: newStatus });
      addToast(
        `Action item marked as ${newStatus}`,
        'success'
      );
      onRefresh?.();
    } catch (error) {
      addToast('Failed to update action item', 'error');
      console.error('Failed to update action item:', error);
    } finally {
      setIsLoadingUpdate(null);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Delete this action item?')) return;

    try {
      setIsLoadingUpdate(itemId);
      await deleteActionItem(itemId);
      addToast('Action item deleted', 'success');
      onRefresh?.();
    } catch (error) {
      addToast('Failed to delete action item', 'error');
      console.error('Failed to delete action item:', error);
    } finally {
      setIsLoadingUpdate(null);
    }
  };

  const handleAddItem = async () => {
    if (!newItemTitle.trim()) {
      addToast('Please enter an action item title', 'error');
      return;
    }

    try {
      setIsAddingItem(true);
      await createActionItem(meetingId, {
        title: newItemTitle,
      });
      addToast('Action item created', 'success');
      setNewItemTitle('');
      onRefresh?.();
    } catch (error) {
      addToast('Failed to create action item', 'error');
      console.error('Failed to create action item:', error);
    } finally {
      setIsAddingItem(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Action Items</h3>

      {actionItems.length === 0 ? (
        <p className="text-muted-foreground text-sm mb-4">No action items yet</p>
      ) : (
        <div className="space-y-3 mb-4">
          {actionItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 bg-background rounded border border-border hover:border-accent/50 transition-colors"
            >
              <button
                onClick={() => handleToggleStatus(item)}
                disabled={isLoadingUpdate === item.id}
                className="mt-0.5 flex-shrink-0 text-accent hover:text-accent/80 disabled:opacity-50 transition-colors"
              >
                {item.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    item.status === 'completed'
                      ? 'line-through text-muted-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.description}
                  </p>
                )}
                {item.assignedTo && (
                  <p className="text-xs text-accent mt-1">
                    Assigned to: {item.assignedTo}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                disabled={isLoadingUpdate === item.id}
                className="flex-shrink-0 text-muted-foreground hover:text-red-400 disabled:opacity-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-border pt-4">
        {!isAddingItem ? (
          <button
            onClick={() => setIsAddingItem(true)}
            className="w-full px-3 py-2 text-sm text-accent hover:bg-accent/10 rounded transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Action Item
          </button>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              placeholder="Enter action item..."
              className="w-full px-3 py-2 bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddItem}
                className="flex-1 px-3 py-1 bg-accent text-accent-foreground rounded text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setIsAddingItem(false);
                  setNewItemTitle('');
                }}
                className="flex-1 px-3 py-1 bg-card border border-border rounded text-sm text-foreground hover:bg-background transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
