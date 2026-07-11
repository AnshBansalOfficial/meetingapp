'use server';

import { revalidatePath } from 'next/cache';

const API_BASE_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'http://127.0.0.1:8000/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function getMeetings() {
  return request<any[]>('/meetings');
}

export async function searchMeetings(query: string) {
  const meetings = await getMeetings();
  return meetings.filter((meeting) =>
    meeting.title.toLowerCase().includes(query.toLowerCase())
  );
}

export async function getMeetingById(meetingId: string) {
  return request<any>(`/meetings/${meetingId}`);
}

export async function createMeeting(data: {
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  participants?: string[];
  primarySpeaker?: string;
}) {
  const payload = {
    title: data.title,
    description: data.description,
    startTime: data.startTime.toISOString(),
    endTime: data.endTime?.toISOString(),
    participants: data.participants || [],
    primarySpeaker: data.primarySpeaker,
  };

  const meeting = await request<any>('/meetings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  revalidatePath('/');
  revalidatePath(`/meeting/${meeting.id}`);
  return meeting.id;
}

export async function updateMeeting(
  meetingId: string,
  data: {
    title?: string;
    description?: string;
    participants?: string[];
    primarySpeaker?: string;
  }
) {
  await request(`/meetings/${meetingId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  revalidatePath('/');
  revalidatePath(`/meeting/${meetingId}`);
}

export async function deleteMeeting(meetingId: string) {
  await request(`/meetings/${meetingId}`, { method: 'DELETE' });
  revalidatePath('/');
}

export async function getMeetingTranscript(meetingId: string) {
  return request<any[]>(`/meetings/${meetingId}/transcript`);
}

export async function addTranscriptLines(
  meetingId: string,
  lines: Array<{
    speakerId: string;
    speakerName: string;
    text: string;
    startTime: number;
    endTime: number;
  }>
) {
  await request(`/meetings/${meetingId}/transcript`, {
    method: 'POST',
    body: JSON.stringify({ lines }),
  });

  revalidatePath(`/meeting/${meetingId}`);
}

export async function getMeetingSummary(meetingId: string) {
  return request<any | null>(`/meetings/${meetingId}/summary`);
}

export async function createSummary(
  meetingId: string,
  data: {
    title: string;
    summary: string;
    keyTopics?: string[];
  }
) {
  const summary = await request<any>(`/meetings/${meetingId}/summary`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  revalidatePath(`/meeting/${meetingId}`);
  return summary.id;
}

export async function getMeetingActionItems(meetingId: string) {
  return request<any[]>(`/meetings/${meetingId}/action-items`);
}

export async function createActionItem(
  meetingId: string,
  data: {
    title: string;
    description?: string;
    assignedTo?: string;
    dueDate?: Date;
  }
) {
  const actionItem = await request<any>(`/meetings/${meetingId}/action-items`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  revalidatePath(`/meeting/${meetingId}`);
  return actionItem.id;
}

export async function updateActionItem(
  actionItemId: string,
  data: {
    title?: string;
    description?: string;
    status?: string;
    assignedTo?: string;
    dueDate?: Date;
  }
) {
  await request(`/action-items/${actionItemId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  revalidatePath('/');
}

export async function deleteActionItem(actionItemId: string) {
  await request(`/action-items/${actionItemId}`, { method: 'DELETE' });
  revalidatePath('/');
}

export async function getSpeakers(meetingId: string) {
  return request<any[]>(`/meetings/${meetingId}/speakers`);
}

export async function addSpeaker(
  meetingId: string,
  data: {
    name: string;
    email?: string;
    avatar?: string;
  }
) {
  const speaker = await request<any>(`/meetings/${meetingId}/speakers`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  revalidatePath(`/meeting/${meetingId}`);
  return speaker.id;
}
