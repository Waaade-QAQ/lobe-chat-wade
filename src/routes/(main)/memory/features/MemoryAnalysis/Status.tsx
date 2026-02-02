'use client';

import { AsyncTaskStatus } from '@lobechat/types';
import { Alert, Flexbox, Icon, Text } from '@lobehub/ui';
import { Button, Progress } from 'antd';
import { Loader2Icon, TriangleAlertIcon } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { MemoryExtractionTask } from '@/services/userMemory/extraction';
import { memoryExtractionService } from '@/services/userMemory/extraction';

import { useMemoryAnalysisAsyncTask } from './useTask';

interface StatusProps {
  onRefresh?: () => void;
  task?: MemoryExtractionTask | null;
}

export const MemoryAnalysisStatus = memo<StatusProps>(({ task, onRefresh }) => {
  const { t } = useTranslation(['memory', 'common']);
  const data = task;

  const status = data?.status;
  const isRunning = status === AsyncTaskStatus.Pending || status === AsyncTaskStatus.Processing;
  const isError = status === AsyncTaskStatus.Error;

  if (!data || (!isRunning && !isError)) return null;

  const { progress } = data.metadata;
  const percent =
    progress.totalTopics && progress.totalTopics > 0
      ? Math.min(100, Math.round((progress.completedTopics / progress.totalTopics) * 100))
      : undefined;

  const progressText = progress.totalTopics
    ? t('analysis.status.progress', {
        completed: progress.completedTopics,
        total: progress.totalTopics,
      })
    : t('analysis.status.progressUnknown', { completed: progress.completedTopics });

  const body = data.error?.body;
  const errorText =
    typeof body === 'string'
      ? body
      : body && typeof body === 'object' && 'detail' in body && typeof body.detail === 'string'
        ? body.detail
        : (data.error?.name ?? t('analysis.status.errorTitle'));
  const handleCancel = async () => {
    if (data?.id) {
      await memoryExtractionService.cancelTask(data.id);
      onRefresh?.();
    }
  };

  return (
    <Alert
      action={
        <Button onClick={handleCancel} size={'small'} type={'text'}>
          {t('cancel', { ns: 'common' })}
        </Button>
      }
      icon={<Icon icon={isError ? TriangleAlertIcon : Loader2Icon} spin={isRunning && !isError} />}
      title={isError ? t('analysis.status.errorTitle') : t('analysis.status.title')}
      type={isError ? 'error' : 'info'}
      variant={'borderless'}
      description={
        <Flexbox gap={12}>
          <Flexbox horizontal align="center" gap={12} wrap="wrap">
            <Progress
              percent={percent ?? 30}
              showInfo={Boolean(percent)}
              status={isError ? 'exception' : 'active'}
              style={{ flex: 1, minWidth: 220 }}
            />
            <Text fontSize={13} type={isError ? 'danger' : 'secondary'}>
              {isError ? (errorText ?? t('analysis.status.errorTitle')) : progressText}
            </Text>
          </Flexbox>
        </Flexbox>
      }
    />
  );
});

MemoryAnalysisStatus.displayName = 'MemoryAnalysisStatus';

const Status = memo(() => {
  const { data, refresh } = useMemoryAnalysisAsyncTask();

  return <MemoryAnalysisStatus onRefresh={refresh} task={data} />;
});

Status.displayName = 'MemoryAnalysisStatusWithData';

export default Status;
