import { Avatar as A } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { type CSSProperties, memo } from 'react';

import { type ChatItemProps } from '../type';

const useStyles = createStyles(({ css }) => ({
  thinking: css`
    animation: dog-thinking 3s ease-in-out infinite;

    @keyframes dog-thinking {
      0% {
        transform: rotate(0deg);
      }

      25% {
        transform: rotate(-5deg);
      }

      50% {
        transform: rotate(0deg);
      }

      75% {
        transform: rotate(5deg);
      }

      100% {
        transform: rotate(0deg);
      }
    }
  `,
}));

export interface AvatarProps {
  alt?: string;
  avatar: ChatItemProps['avatar'];
  loading?: boolean;
  onClick?: ChatItemProps['onAvatarClick'];
  size?: number;
  style?: CSSProperties;
  unoptimized?: boolean;
}

const Avatar = memo<AvatarProps>(
  ({ loading, avatar, unoptimized, onClick, size = 28, style, alt }) => {
    const { styles } = useStyles();
    return (
      <A
        alt={alt || avatar.title}
        animation={loading}
        avatar={loading ? '/images/ai-avatar-dog.png' : avatar.avatar}
        background={avatar.backgroundColor}
        className={loading ? styles.thinking : undefined}
        shape={'square'}
        size={size}
        style={style}
        title={avatar.title}
        unoptimized={unoptimized}
        onClick={onClick}
      />
    );
  },
);

export default Avatar;
