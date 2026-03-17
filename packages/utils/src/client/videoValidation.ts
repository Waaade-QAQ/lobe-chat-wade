export interface VideoValidationResult {
  actualSize?: string;
  isValid: boolean;
}

export const validateVideoFileSize = (file: File): VideoValidationResult => {
  // 不再限制视频文件大小，允许上传任意大小的视频文件
  return { isValid: true };
};
