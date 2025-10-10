import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { ChatAudioItem } from '@/types/message';

interface AudioFileListViewerProps {
    items: ChatAudioItem[];
}

const AudioFileListViewer = memo<AudioFileListViewerProps>(({ items }) => {
    return (
        <Flexbox gap={8}>
            {items.map((item) => (
                <audio
                    controls
                    key={item.id}
                    style={{
                        borderRadius: 8,
                        maxWidth: '100%',
                    }}
                >
                    <source src={item.url} />
                    {item.alt}
                </audio>
            ))}
        </Flexbox>
    );
});

export default AudioFileListViewer;

