import { describe, expect, it } from 'vitest';

import { validateVideoFileSize } from './videoValidation';

describe('validateVideoFileSize', () => {
  it('should return valid for non-video files', () => {
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const result = validateVideoFileSize(mockFile);

    expect(result.isValid).toBe(true);
  });

  it('should return valid for video files regardless of size (small)', () => {
    const mockVideoFile = new File(['x'.repeat(10 * 1024 * 1024)], 'video.mp4', {
      type: 'video/mp4',
    });
    const result = validateVideoFileSize(mockVideoFile);

    expect(result.isValid).toBe(true);
  });

  it('should return valid for video files regardless of size (large)', () => {
    const mockLargeVideoFile = new File(['x'.repeat(100 * 1024 * 1024)], 'large-video.mp4', {
      type: 'video/mp4',
    });
    const result = validateVideoFileSize(mockLargeVideoFile);

    expect(result.isValid).toBe(true);
  });

  it('should return valid for audio files regardless of size', () => {
    const mockAudioFile = new File(['x'.repeat(50 * 1024 * 1024)], 'audio.mp3', {
      type: 'audio/mp3',
    });
    const result = validateVideoFileSize(mockAudioFile);

    expect(result.isValid).toBe(true);
  });
});
