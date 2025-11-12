import { BRANDING_NAME } from '@lobechat/business-const';
import { memo, useEffect } from 'react';

import { isDesktop } from '@/const/version';
import { useElectronStore } from '@/store/electron';

const PageTitle = memo<{ title: string }>(({ title }) => {
  const setCurrentPageTitle = useElectronStore((s) => s.setCurrentPageTitle);

  useEffect(() => {
    // 如果标题是"AI对话"，只显示"AI对话"，不添加品牌名称
    if (title === 'AI对话') {
      document.title = 'AI对话';
    } else {
      document.title = title ? `${title} · ${BRANDING_NAME}` : BRANDING_NAME;
    }

    // Sync title to electron store for navigation history
    if (isDesktop) {
      setCurrentPageTitle(title);
    }
  }, [title, setCurrentPageTitle]);

  return null;
});

export default PageTitle;
