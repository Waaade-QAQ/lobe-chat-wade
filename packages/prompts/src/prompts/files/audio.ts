import { ChatAudioItem } from '@lobechat/types';

export const audiosPrompts = (audioList: ChatAudioItem[], addUrl: boolean = true) => {
    if (!audioList || audioList.length === 0) return '';

    const prompt = audioList
        .map((audio, index) => {
            const parts = [`<audio id="${audio.id}" index="${index + 1}">`];

            if (addUrl && audio.url) {
                parts.push(`  <url>${audio.url}</url>`);
            }

            if (audio.alt) {
                parts.push(`  <alt>${audio.alt}</alt>`);
            }

            parts.push('</audio>');

            return parts.join('\n');
        })
        .join('\n\n');

    return `<audios>
${prompt}
</audios>`;
};

