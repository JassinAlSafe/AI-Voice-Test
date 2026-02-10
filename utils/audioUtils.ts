
const SAMPLE_RATE = 24000;
const NUM_CHANNELS = 1;

/**
 * Decodes a base64 string into a Uint8Array.
 * @param base64 The base64 encoded string.
 * @returns A Uint8Array of the decoded data.
 */
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Converts raw PCM audio data into an AudioBuffer.
 * @param data The raw audio data as a Uint8Array.
 * @param ctx The AudioContext instance.
 * @returns A promise that resolves with the created AudioBuffer.
 */
async function decodePcmData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / NUM_CHANNELS;
  const buffer = ctx.createBuffer(NUM_CHANNELS, frameCount, SAMPLE_RATE);

  for (let channel = 0; channel < NUM_CHANNELS; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * NUM_CHANNELS + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Writes a string to a DataView.
 * @param view The DataView to write to.
 * @param offset The offset to start writing at.
 * @param str The string to write.
 */
function writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
    }
}

/**
 * Converts an AudioBuffer to a WAV audio blob.
 * @param buffer The AudioBuffer to convert.
 * @returns A Blob representing the WAV file.
 */
function bufferToWav(buffer: AudioBuffer): Blob {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const bufferArray = new ArrayBuffer(length);
    const view = new DataView(bufferArray);
    const channels: Float32Array[] = [];
    let i, sample;
    let offset = 0;
    // FIX: Changed `pos` from `const` to `let` because it is incremented in a loop.
    let pos = 0;

    // write WAVE header
    writeString(view, offset, 'RIFF'); offset += 4;
    view.setUint32(offset, length - 8, true); offset += 4;
    writeString(view, offset, 'WAVE'); offset += 4;
    writeString(view, offset, 'fmt '); offset += 4;
    view.setUint32(offset, 16, true); offset += 4;
    view.setUint16(offset, 1, true); offset += 2;
    view.setUint16(offset, numOfChan, true); offset += 2;
    view.setUint32(offset, buffer.sampleRate, true); offset += 4;
    view.setUint32(offset, buffer.sampleRate * 2 * numOfChan, true); offset += 4;
    view.setUint16(offset, numOfChan * 2, true); offset += 2;
    view.setUint16(offset, 16, true); offset += 2;
    writeString(view, offset, 'data'); offset += 4;
    view.setUint32(offset, length - pos - 44, true); offset += 4;

    for (i = 0; i < buffer.numberOfChannels; i++) {
        channels.push(buffer.getChannelData(i));
    }

    while (offset < length) {
        for (i = 0; i < numOfChan; i++) {
            sample = Math.max(-1, Math.min(1, channels[i][pos]));
            sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
            view.setInt16(offset, sample, true);
            offset += 2;
        }
        pos++;
    }

    return new Blob([view], { type: 'audio/wav' });
}


/**
 * Creates a playable audio URL from a base64 encoded raw PCM string.
 * @param base64Audio The base64 encoded audio data.
 * @returns A promise that resolves to a blob URL string.
 */
export async function createAudioUrl(base64Audio: string): Promise<string> {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: SAMPLE_RATE });
    const decodedPcm = decodeBase64(base64Audio);
    const audioBuffer = await decodePcmData(decodedPcm, audioContext);
    const wavBlob = bufferToWav(audioBuffer);
    return URL.createObjectURL(wavBlob);
}
